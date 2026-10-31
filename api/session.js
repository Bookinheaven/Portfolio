// In-memory rate limiting map
const rateLimitMap = new Map();

// Session deduplication map (dedupeKey -> timestamp)
const notifiedSessions = new Map();
const PROD_DEDUPE_MS = 30 * 60 * 1000; // 30 minutes window for live visitors
const DEV_DEDUPE_MS = 15 * 1000;       // 15 seconds window for local testing

const isRateLimited = (ip) => {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 30;

  const userRecord = rateLimitMap.get(ip) || { count: 0, resetTime: now + windowMs };

  if (now > userRecord.resetTime) {
    userRecord.count = 1;
    userRecord.resetTime = now + windowMs;
    rateLimitMap.set(ip, userRecord);
    return false;
  }

  userRecord.count += 1;
  rateLimitMap.set(ip, userRecord);
  return userRecord.count > maxRequests;
};

// Bot user-agent signatures
const isAutomatedClient = (userAgent = '') => {
  const ua = userAgent.toLowerCase();
  const signatures = [
    'bot', 'crawl', 'spider', 'slurp', 'headless', 'lighthouse',
    'python-requests', 'curl', 'wget', 'postman', 'insomnia',
    'googlebot', 'bingbot', 'yandex', 'baidu', 'facebookexternalhit'
  ];
  return signatures.some(sig => ua.includes(sig));
};

function parseEmail(emailString, defaultName = 'Portfolio Visitor') {
  if (!emailString) return { name: defaultName, email: 'tanviksriram@gmail.com' };
  const match = emailString.match(/^(.*?)\s*<(.+?)>$/);
  if (match) {
    return { name: match[1].trim() || defaultName, email: match[2].trim() };
  }
  return { name: defaultName, email: emailString.trim() };
}

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get client IP
  const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.headers['x-real-ip'] ||
    req.socket?.remoteAddress ||
    '127.0.0.1';

  // Rate limit
  if (isRateLimited(clientIp)) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  // Filter automated clients
  const userAgent = req.headers['user-agent'] || '';
  if (isAutomatedClient(userAgent)) {
    return res.status(200).json({ ok: true, ignored: true });
  }

  // Parse Body
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: 'Invalid payload' });
    }
  }

  if (!body || typeof body !== 'object') {
    return res.status(400).json({ error: 'Missing payload' });
  }

  const {
    sessionId = 'unknown',
    section = 'home',
    project = null,
    device = 'Desktop',
    browser = 'Unknown',
    os = 'Unknown',
    screen = 'Unknown',
    viewport = 'Unknown',
    colorScheme = 'Unknown',
    timezone = 'UTC',
    language = 'en',
    connection = 'Standard',
    touchSupport = 'Unknown',
    localTime = '',
    referrer = 'Direct / Bookmark',
    pageUrl = '',
    timestamp = new Date().toISOString(),
    triggerNotification = false
  } = body;

  // Extract Vercel Geolocation Headers
  const country = req.headers['x-vercel-ip-country'] || 'India';
  const region = req.headers['x-vercel-ip-country-region'] || '';
  const rawCity = req.headers['x-vercel-ip-city'];
  const city = rawCity ? decodeURIComponent(rawCity) : '';
  const latitude = req.headers['x-vercel-ip-latitude'] || '';
  const longitude = req.headers['x-vercel-ip-longitude'] || '';

  const locationParts = [city, region, country].filter(Boolean);
  const locationStr = locationParts.length > 0 ? locationParts.join(', ') : 'Direct Visitor';

  // Handle Brevo Email Notification
  const brevoApiKey = process.env.BREVO_API_KEY;
  const toEmail = process.env.NOTIFICATION_EMAIL || 'tanviksriram@gmail.com';
  const fromEmail = process.env.NOTIFICATION_FROM_EMAIL || 'burnknuckleofficial@gmail.com';

  const isLocal = clientIp === '127.0.0.1' || clientIp === '::1' || clientIp.startsWith('192.168.') || process.env.DEV === 'true';
  const dedupeKey = isLocal ? `dev_${sessionId}` : `prod_${clientIp}_${sessionId}`;
  const lastNotified = notifiedSessions.get(dedupeKey);
  const now = Date.now();
  const cooldownWindow = isLocal ? DEV_DEDUPE_MS : PROD_DEDUPE_MS;

  let emailStatus = 'skipped';

  if (triggerNotification && brevoApiKey) {
    if (lastNotified && (now - lastNotified) < cooldownWindow) {
      console.log(`[Session] Suppressed duplicate notification for ${dedupeKey}`);
      return res.status(200).json({ ok: true, emailStatus: 'duplicate_prevented' });
    }

    // Set notified timestamp
    notifiedSessions.set(dedupeKey, now);

    try {
      const subjectActivity = project 
        ? `Viewing Case Study: ${project}` 
        : `Browsing ${section.toUpperCase()}`;

      const subject = `⚡ Visitor: ${locationStr} (${device} · ${browser})`;

      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Portfolio Visitor</title>
</head>
<body style="margin: 0; padding: 24px 12px; background-color: #07080a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e4e4e7; -webkit-font-smoothing: antialiased;">
  <div style="max-width: 620px; margin: 0 auto; background: #0c0d12; border: 1px solid #1f222e; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.6);">
    
    <!-- Top Header Bar -->
    <div style="background: linear-gradient(135deg, #111420 0%, #0d0f17 100%); padding: 22px 28px; border-bottom: 1px solid #1f222e;">
      <div style="display: table; width: 100%;">
        <div style="display: table-cell; vertical-align: middle;">
          <span style="display: inline-block; font-size: 11px; font-weight: 800; font-family: monospace; letter-spacing: 1.5px; color: #00e5ff; text-transform: uppercase;">
            PORTFOLIO // TELEMETRY
          </span>
          <h1 style="margin: 6px 0 0 0; font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: -0.02em;">
            New Visitor Alert
          </h1>
        </div>
        <div style="display: table-cell; vertical-align: middle; text-align: right;">
          <span style="display: inline-block; font-size: 11px; font-weight: 700; font-family: monospace; letter-spacing: 0.5px; color: #10b981; background: rgba(16, 185, 129, 0.12); padding: 5px 12px; border-radius: 9999px; border: 1px solid rgba(16, 185, 129, 0.3);">
            ● 1 PER VISIT
          </span>
        </div>
      </div>
    </div>

    <!-- Main Content Container -->
    <div style="padding: 26px 28px;">

      <!-- Hero Summary Pill -->
      <div style="background: rgba(0, 229, 255, 0.04); border: 1px solid rgba(0, 229, 255, 0.2); border-radius: 12px; padding: 16px 20px; margin-bottom: 24px;">
        <div style="font-size: 11px; font-family: monospace; text-transform: uppercase; letter-spacing: 1px; color: #00e5ff; margin-bottom: 4px;">
          Primary Action
        </div>
        <div style="font-size: 16px; font-weight: 700; color: #ffffff;">
          ${escapeHtml(subjectActivity)}
        </div>
        <div style="font-size: 13px; color: #a1a1aa; margin-top: 4px;">
          📍 Location: <strong style="color: #f4f4f5;">${escapeHtml(locationStr)}</strong> &bull; IP: <span style="font-family: monospace; color: #cbd5e1;">${escapeHtml(clientIp)}</span>
        </div>
      </div>

      <!-- Card 1: Location & Network -->
      <div style="background: #11131a; border: 1px solid #1f222e; border-radius: 12px; padding: 18px 20px; margin-bottom: 16px;">
        <div style="font-size: 12px; font-weight: 700; color: #00e5ff; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 14px; display: flex; align-items: center;">
          🌍 Location & Network
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <tr>
            <td style="padding: 6px 0; color: #71717a; width: 140px;">Country / Region:</td>
            <td style="padding: 6px 0; color: #f4f4f5; font-weight: 600;">${escapeHtml(country)} ${region ? `(${escapeHtml(region)})` : ''}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #71717a;">City:</td>
            <td style="padding: 6px 0; color: #f4f4f5; font-weight: 600;">${escapeHtml(city || 'Unknown / Not provided')}</td>
          </tr>
          ${latitude && longitude ? `
          <tr>
            <td style="padding: 6px 0; color: #71717a;">Coordinates:</td>
            <td style="padding: 6px 0; color: #a1a1aa; font-family: monospace;">${escapeHtml(latitude)}, ${escapeHtml(longitude)}</td>
          </tr>` : ''}
          <tr>
            <td style="padding: 6px 0; color: #71717a;">IP Address:</td>
            <td style="padding: 6px 0; color: #a1a1aa; font-family: monospace;">${escapeHtml(clientIp)}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #71717a;">Timezone:</td>
            <td style="padding: 6px 0; color: #f4f4f5;">${escapeHtml(timezone)} ${localTime ? `&bull; Local: ${escapeHtml(localTime)}` : ''}</td>
          </tr>
        </table>
      </div>

      <!-- Card 2: Device & Client Environment -->
      <div style="background: #11131a; border: 1px solid #1f222e; border-radius: 12px; padding: 18px 20px; margin-bottom: 16px;">
        <div style="font-size: 12px; font-weight: 700; color: #a855f7; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 14px;">
          💻 Device & Environment
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <tr>
            <td style="padding: 6px 0; color: #71717a; width: 140px;">Device & OS:</td>
            <td style="padding: 6px 0; color: #f4f4f5; font-weight: 600;">${escapeHtml(device)} &bull; ${escapeHtml(os)}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #71717a;">Browser:</td>
            <td style="padding: 6px 0; color: #f4f4f5; font-weight: 600;">${escapeHtml(browser)}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #71717a;">Screen Resolution:</td>
            <td style="padding: 6px 0; color: #f4f4f5;">${escapeHtml(screen)} &bull; Viewport: ${escapeHtml(viewport)}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #71717a;">Language & Theme:</td>
            <td style="padding: 6px 0; color: #f4f4f5;">${escapeHtml(language)} &bull; ${escapeHtml(colorScheme)} &bull; ${escapeHtml(touchSupport)}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #71717a;">Connection:</td>
            <td style="padding: 6px 0; color: #a1a1aa;">${escapeHtml(connection)}</td>
          </tr>
        </table>
      </div>

      <!-- Card 3: Navigation & Referral -->
      <div style="background: #11131a; border: 1px solid #1f222e; border-radius: 12px; padding: 18px 20px; margin-bottom: 24px;">
        <div style="font-size: 12px; font-weight: 700; color: #10b981; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 14px;">
          🔗 Navigation & Referral
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <tr>
            <td style="padding: 6px 0; color: #71717a; width: 140px;">Referral Source:</td>
            <td style="padding: 6px 0; color: #00e5ff; font-weight: 600;">${escapeHtml(referrer)}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #71717a;">Landing Section:</td>
            <td style="padding: 6px 0; color: #f4f4f5; font-weight: 600; text-transform: uppercase;">${escapeHtml(section)}</td>
          </tr>
          ${project ? `
          <tr>
            <td style="padding: 6px 0; color: #71717a;">Case Study Opened:</td>
            <td style="padding: 6px 0; color: #a855f7; font-weight: 700;">${escapeHtml(project)}</td>
          </tr>` : ''}
          <tr>
            <td style="padding: 6px 0; color: #71717a;">Page URL:</td>
            <td style="padding: 6px 0; color: #a1a1aa; word-break: break-all; font-size: 12px;">${escapeHtml(pageUrl)}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #71717a;">Session ID:</td>
            <td style="padding: 6px 0; color: #71717a; font-family: monospace; font-size: 12px;">${escapeHtml(sessionId)}</td>
          </tr>
        </table>
      </div>

      <!-- Quick Actions -->
      <div style="text-align: center; margin-bottom: 8px;">
        <a href="https://app.brevo.com/transactional/logs" target="_blank" style="display: inline-block; background: #00e5ff; color: #000000; font-weight: 700; font-size: 13px; text-decoration: none; padding: 10px 22px; border-radius: 8px; margin: 4px;">
          View Brevo Logs &rarr;
        </a>
      </div>

    </div>

    <!-- Footer -->
    <div style="background: #090a0e; border-top: 1px solid #1f222e; padding: 16px 28px; text-align: center; font-size: 11px; color: #71717a;">
      Automated visitor telemetry from your Portfolio &bull; Received at ${escapeHtml(timestamp)}
    </div>

  </div>
</body>
</html>
      `;

      const senderObj = parseEmail(fromEmail, 'Portfolio Visitor');
      const recipientObj = parseEmail(toEmail, 'Portfolio Owner');

      const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': brevoApiKey,
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          sender: senderObj,
          to: [{ email: recipientObj.email, name: recipientObj.name }],
          subject: subject,
          htmlContent: htmlContent
        })
      });

      if (!brevoResponse.ok) {
        const errorText = await brevoResponse.text();
        console.error('[Session] Brevo error:', brevoResponse.status, errorText);
        emailStatus = `error: ${brevoResponse.status}`;
      } else {
        const successData = await brevoResponse.json();
        console.log(`[Session] Email dispatched [ID: ${successData.messageId}] to ${recipientObj.email}`);
        emailStatus = `sent: ${successData.messageId}`;
      }
    } catch (emailErr) {
      console.error('[Session] Brevo notification error:', emailErr.message);
      emailStatus = `exception: ${emailErr.message}`;
    }
  }

  return res.status(200).json({ ok: true, emailStatus });
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
