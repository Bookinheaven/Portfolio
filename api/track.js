// Simple in-memory rate limiting map for Serverless Function lifetime
const rateLimitMap = new Map();

const isRateLimited = (ip) => {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 20;

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

// Obvious bot user-agent signatures
const isServerBot = (userAgent = '') => {
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
    'unknown-ip';

  // Rate limit
  if (isRateLimited(clientIp)) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  // User Agent Bot Check
  const userAgent = req.headers['user-agent'] || '';
  if (isServerBot(userAgent)) {
    return res.status(200).json({ ok: true, ignored: 'bot' });
  }

  // Parse Body
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: 'Invalid JSON payload' });
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
    referrer = 'Direct',
    timestamp = new Date().toISOString(),
    screen = 'Unknown',
    triggerNotification = false
  } = body;

  // Extract Vercel Geolocation Headers
  const country = req.headers['x-vercel-ip-country'] || 'Unknown Country';
  const region = req.headers['x-vercel-ip-country-region'] || '';
  const rawCity = req.headers['x-vercel-ip-city'];
  const city = rawCity ? decodeURIComponent(rawCity) : '';

  const locationStr = [city, region, country].filter(Boolean).join(', ') || 'Unknown Location';

  // Handle Brevo (formerly Sendinblue) Email Notification
  const brevoApiKey = process.env.BREVO_API_KEY;
  const toEmail = process.env.NOTIFICATION_EMAIL || 'tanviksriram@gmail.com';
  const fromEmail = process.env.NOTIFICATION_FROM_EMAIL || 'tanviksriram@gmail.com';

  if (triggerNotification && brevoApiKey) {
    try {
      const actionText = project
        ? `Viewed Case Study: <strong>${escapeHtml(project)}</strong>`
        : `Explored Section: <strong>${escapeHtml(section.toUpperCase())}</strong>`;

      const htmlContent = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 580px; margin: 0 auto; background-color: #0c0d0e; color: #ededed; border: 1px solid #27272a; border-radius: 12px; overflow: hidden; padding: 28px;">
          <div style="border-bottom: 1px solid #27272a; padding-bottom: 16px; margin-bottom: 20px;">
            <span style="font-size: 11px; font-family: monospace; text-transform: uppercase; letter-spacing: 1px; color: #38bdf8; background: rgba(56, 189, 248, 0.1); padding: 4px 8px; border-radius: 4px; border: 1px solid rgba(56, 189, 248, 0.2);">
              Visitor Alert
            </span>
            <h2 style="margin: 12px 0 4px 0; font-size: 20px; font-weight: 700; color: #ffffff;">
              New High-Intent Portfolio Visitor
            </h2>
            <p style="margin: 0; font-size: 13px; color: #a1a1aa;">
              ${actionText}
            </p>
          </div>

          <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 24px;">
            <tr>
              <td style="padding: 8px 0; color: #71717a; width: 130px;">Approx. Location:</td>
              <td style="padding: 8px 0; color: #f4f4f5; font-weight: 500;">📍 ${escapeHtml(locationStr)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #71717a;">Device & OS:</td>
              <td style="padding: 8px 0; color: #f4f4f5; font-weight: 500;">💻 ${escapeHtml(device)} (${escapeHtml(os)})</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #71717a;">Browser:</td>
              <td style="padding: 8px 0; color: #f4f4f5; font-weight: 500;">🌐 ${escapeHtml(browser)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #71717a;">Referral Source:</td>
              <td style="padding: 8px 0; color: #f4f4f5; font-weight: 500;">🔗 ${escapeHtml(referrer)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #71717a;">Screen Resolution:</td>
              <td style="padding: 8px 0; color: #f4f4f5; font-weight: 500;">🖥️ ${escapeHtml(screen)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #71717a;">Time (UTC):</td>
              <td style="padding: 8px 0; color: #f4f4f5; font-weight: 500;">🕒 ${escapeHtml(timestamp)}</td>
            </tr>
          </table>
        </div>
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
          subject: `⚡ Portfolio Visitor: ${locationStr} (${device} · ${browser})`,
          htmlContent: htmlContent
        })
      });

      if (!brevoResponse.ok) {
        const errorText = await brevoResponse.text();
        console.error('[API Track] Brevo send error:', brevoResponse.status, errorText);
      }
    } catch (emailErr) {
      console.error('[API Track] Brevo notification error:', emailErr.message);
      // Do not fail the response if email provider fails
    }
  }

  return res.status(200).json({ ok: true });
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
