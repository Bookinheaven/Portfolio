/**
 * Client session and interaction sync helper.
 * Maintains session state and syncs lightweight client environment data.
 */

// Detect device category
const getDeviceType = () => {
  const ua = navigator.userAgent || '';
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'Tablet';
  }
  if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated/i.test(ua)) {
    return 'Mobile';
  }
  return 'Desktop';
};

// Detect browser and version
const getBrowser = () => {
  const ua = navigator.userAgent || '';
  let match = ua.match(/(firefox|msie|trident|chrome|safari|edg(?=\/))\/?\s*(\d+)/i) || [];
  if (/trident/i.test(match[1])) return 'IE';
  if (match[1] === 'Chrome') {
    const edgeMatch = ua.match(/\b(Edg)\/(\d+)/);
    if (edgeMatch) return `Edge ${edgeMatch[2]}`;
    const oprMatch = ua.match(/\b(OPR)\/(\d+)/);
    if (oprMatch) return `Opera ${oprMatch[2]}`;
  }
  if (ua.includes('Safari/') && !ua.includes('Chrome/')) {
    const verMatch = ua.match(/Version\/(\d+)/);
    return verMatch ? `Safari ${verMatch[1]}` : 'Safari';
  }
  return match[1] ? `${match[1]} ${match[2] || ''}`.trim() : 'Other Browser';
};

// Detect operating system
const getOS = () => {
  const ua = navigator.userAgent || '';
  if (ua.includes('Win')) return 'Windows';
  if (/iPhone|iPad|iPod/.test(ua)) return 'iOS';
  if (ua.includes('Mac')) return 'macOS';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('Linux')) return 'Linux';
  return 'Unknown OS';
};

// Verify client environment
export const isValidClient = () => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  if (navigator.webdriver) return false;
  const ua = (navigator.userAgent || '').toLowerCase();
  const automatedSignatures = [
    'bot', 'crawler', 'spider', 'headless', 'lighthouse',
    'googlebot', 'bingbot', 'slurp', 'duckduckbot', 'baiduspider',
    'yandexbot', 'sogou', 'exabot', 'facebot', 'ia_archiver'
  ];
  return !automatedSignatures.some(sig => ua.includes(sig));
};

// Session identifier
const getSessionId = () => {
  try {
    let id = sessionStorage.getItem('_app_sid');
    if (!id) {
      id = 's_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
      sessionStorage.setItem('_app_sid', id);
    }
    return id;
  } catch {
    return 's_' + Math.random().toString(36).substring(2, 9);
  }
};

// Collect client metrics
const getClientMetrics = () => {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const dpr = window.devicePixelRatio || 1;
  const screenRes = window.screen ? `${window.screen.width}x${window.screen.height} (${dpr}x DPR)` : 'Unknown';
  const viewport = `${window.innerWidth || 0}x${window.innerHeight || 0}`;

  let colorScheme = 'Unknown';
  try {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      colorScheme = 'Dark Mode';
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      colorScheme = 'Light Mode';
    }
  } catch {}

  let timezone = 'UTC';
  try {
    timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {}

  return {
    device: getDeviceType(),
    browser: getBrowser(),
    os: getOS(),
    screen: screenRes,
    viewport: viewport,
    colorScheme: colorScheme,
    timezone: timezone,
    language: navigator.language || (navigator.languages && navigator.languages[0]) || 'en',
    connection: connection ? `${connection.effectiveType || ''} ${connection.downlink ? `(${connection.downlink} Mbps)` : ''}`.trim() : 'Standard',
    touchSupport: ('ontouchstart' in window || navigator.maxTouchPoints > 0) ? 'Touch Enabled' : 'No Touch',
    localTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    pageUrl: window.location.href,
    referrer: document.referrer || (new URLSearchParams(window.location.search).get('utm_source')) || 'Direct / Bookmark'
  };
};

/**
 * Sync session state with server.
 * Guarantees exactly 1 notification email per visitor visit/session.
 */
export const syncSession = async ({
  section = 'home',
  project = null,
  forceNotify = false
} = {}) => {
  if (!isValidClient()) return;

  try {
    const sessionId = getSessionId();
    let alreadySynced = false;
    try {
      alreadySynced = sessionStorage.getItem('_app_synced') === 'true';
    } catch {}

    // Exactly 1 notification per visit session:
    let shouldNotify = false;
    if (!alreadySynced) {
      shouldNotify = true;
      try {
        sessionStorage.setItem('_app_synced', 'true');
      } catch {}
    } else if (forceNotify) {
      shouldNotify = true;
    }

    const metrics = getClientMetrics();

    const payload = {
      sessionId,
      section,
      project: project ? (typeof project === 'string' ? project : project.title) : null,
      timestamp: new Date().toISOString(),
      triggerNotification: shouldNotify,
      ...metrics
    };

    const endpoint = '/api/session';

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true
    });

    if (import.meta.env.DEV) {
      const data = await response.json().catch(() => ({}));
      console.log('[Session] Synced:', { section, project, shouldNotify }, 'Status:', data);
    }
  } catch (err) {
    if (import.meta.env.DEV) {
      console.error('[Session] Sync error:', err);
    }
  }
};

// Developer tools in console
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  window.__resetSession = () => {
    try {
      sessionStorage.removeItem('_app_synced');
      sessionStorage.removeItem('_app_sid');
      console.log('🔄 [Session] Reset complete! Next view simulates fresh visit.');
    } catch {}
  };

  window.__sendTestNotification = () => {
    console.log('⚡ [Session] Sending test notification...');
    return syncSession({ section: 'projects', project: 'Portfolio Test', forceNotify: true });
  };
}
