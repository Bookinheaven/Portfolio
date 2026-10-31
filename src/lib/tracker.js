/**
 * Lightweight, privacy-conscious visitor tracker for React + Vite.
 * No personally identifiable information (names, emails, exact GPS) is ever collected.
 */

// Helper to detect device type
const getDeviceType = () => {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'Tablet';
  }
  if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated/i.test(ua)) {
    return 'Mobile';
  }
  return 'Desktop';
};

// Helper to detect browser
const getBrowser = () => {
  const ua = navigator.userAgent;
  if (ua.includes('Firefox/')) return 'Firefox';
  if (ua.includes('Edg/')) return 'Edge';
  if (ua.includes('Chrome/')) return 'Chrome';
  if (ua.includes('Safari/')) return 'Safari';
  return 'Other Browser';
};

// Helper to detect OS
const getOS = () => {
  const ua = navigator.userAgent;
  if (ua.includes('Win')) return 'Windows';
  if (ua.includes('Mac')) return 'macOS';
  if (ua.includes('Linux')) return 'Linux';
  if (ua.includes('Android')) return 'Android';
  if (/iPhone|iPad|iPod/.test(ua)) return 'iOS';
  return 'Unknown OS';
};

// Simple bot check
export const isBot = () => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return true;
  if (navigator.webdriver) return true;
  const ua = (navigator.userAgent || '').toLowerCase();
  const botSignatures = [
    'bot', 'crawler', 'spider', 'headless', 'lighthouse', 
    'googlebot', 'bingbot', 'slurp', 'duckduckbot', 'baiduspider',
    'yandexbot', 'sogou', 'exabot', 'facebot', 'ia_archiver'
  ];
  return botSignatures.some(sig => ua.includes(sig));
};

// Session management (resets when browser tab closes, no cross-site tracking)
const getSessionId = () => {
  try {
    let id = sessionStorage.getItem('pf_session_id');
    if (!id) {
      id = 's_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
      sessionStorage.setItem('pf_session_id', id);
    }
    return id;
  } catch {
    return 's_' + Math.random().toString(36).substring(2, 11);
  }
};

// Send tracking payload to /api/track
export const trackEvent = async ({
  section = 'home',
  project = null,
  forceNotification = false
} = {}) => {
  if (isBot()) return;

  try {
    const sessionId = getSessionId();
    let alreadyNotified = false;
    try {
      alreadyNotified = sessionStorage.getItem('pf_notified') === 'true';
    } catch {
      // sessionStorage unavailable
    }

    // Determine if notification criteria are met
    // Criteria: High-value action (e.g. viewing a project case study or exploring projects),
    // and no notification has been sent yet for this session.
    let shouldNotify = false;
    if (!alreadyNotified) {
      if (forceNotification || project || section === 'projects') {
        shouldNotify = true;
        try {
          sessionStorage.setItem('pf_notified', 'true');
        } catch {
          // ignore
        }
      }
    }

    const payload = {
      sessionId,
      section,
      project: project ? (typeof project === 'string' ? project : project.title) : null,
      device: getDeviceType(),
      browser: getBrowser(),
      os: getOS(),
      referrer: document.referrer || (new URLSearchParams(window.location.search).get('utm_source')) || 'Direct / Bookmark',
      timestamp: new Date().toISOString(),
      screen: `${window.screen?.width || 0}x${window.screen?.height || 0}`,
      triggerNotification: shouldNotify
    };

    const endpoint = '/api/track';

    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
      navigator.sendBeacon(endpoint, blob);
    } else {
      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true
      });
    }
  } catch (err) {
    // Fail silently in development or when offline
    if (import.meta.env.DEV) {
      console.debug('[Tracker] Event dispatched:', { section, project });
    }
  }
};
