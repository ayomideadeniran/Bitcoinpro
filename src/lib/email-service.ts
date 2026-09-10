import { UserProfile, WelcomeEmailData } from './types';

const STORAGE_KEY_EMAILS = 'bitcoinpro_sent_emails';

/**
 * Generates the official institutional BitcoinPro security email content for registration or login.
 */
export function generateWelcomeEmailContent(
  user: UserProfile,
  type: 'register' | 'login' = 'register'
): WelcomeEmailData {
  const isTier2 = user.kycTier >= 2;
  const limitText = isTier2 ? '$10,000 / day' : '$500 / day';
  const tierName = isTier2 ? 'Tier 2 (Standard Verified)' : 'Tier 1 (Starter)';
  const now = new Date();
  const formattedDate = now.toUTCString();

  const isLogin = type === 'login';
  const subject = isLogin
    ? `Welcome back to KnightPro, ${user.name}`
    : `Welcome to KnightPro, ${user.name}`;

  const headline = isLogin
    ? `Welcome Back, ${user.name}`
    : `Welcome to KnightPro, ${user.name}`;

  const descriptionText = isLogin
    ? `A successful sign-in to your KnightPro account (<strong>${user.email}</strong>) was recorded on <strong>${formattedDate}</strong>. If this was you, no action is needed.`
    : `Your investment account (<strong>${user.email}</strong>) has been successfully created. Below is your account overview and getting started information.`;

  const importantPoints = [
    'Account Authentication: Keep your login credentials and passwords safe at all times.',
    'Security Recommendation: Ensure your registered email address remains active and protected.',
    'Dedicated Assistance: Our member support desk is available to assist you with any questions.',
  ];

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #0f172a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.06);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #111827 0%, #1e293b 100%); padding: 32px; text-align: center; border-bottom: 3px solid #3b82f6;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <div style="display: inline-block; width: 44px; height: 44px; background: #3b82f6; border-radius: 10px; line-height: 44px; font-weight: 800; font-size: 24px; color: #ffffff;">★</div>
                    <h1 style="color: #ffffff; font-size: 22px; font-weight: 800; margin: 12px 0 4px; letter-spacing: -0.02em;">
                      Knight<span style="color: #3b82f6;">Pro</span>
                    </h1>
                    <p style="color: #94a3b8; font-size: 13px; margin: 0; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600;">
                      Institutional Member Desk
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 36px 32px;">
              <h2 style="font-size: 19px; font-weight: 800; color: #0f172a; margin-top: 0; margin-bottom: 12px;">
                ${headline}
              </h2>
              <p style="font-size: 14.5px; line-height: 1.6; color: #475569; margin-bottom: 24px;">
                ${descriptionText}
              </p>

              <!-- Account Parameters Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f1f5f9; border-radius: 8px; border: 1px solid #cbd5e1; margin-bottom: 28px;">
                <tr>
                  <td style="padding: 18px 20px;">
                    <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.05em; margin-bottom: 10px;">
                      Session &amp; Account Parameters
                    </div>
                    <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 13.5px;">
                      <tr>
                        <td style="padding: 4px 0; color: #64748b;">Account Holder:</td>
                        <td style="padding: 4px 0; font-weight: 600; text-align: right; color: #0f172a;">${user.name}</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; color: #64748b;">Account ID:</td>
                        <td style="padding: 4px 0; font-family: monospace; font-weight: 600; text-align: right; color: #0f172a;">${user.id}</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; color: #64748b;">Role:</td>
                        <td style="padding: 4px 0; font-weight: 700; text-align: right; color: #10b981; text-transform: uppercase;">
                          ${user.role}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; color: #64748b;">Activity Event:</td>
                        <td style="padding: 4px 0; font-weight: 600; text-align: right; color: #0f172a;">
                          ${isLogin ? 'Sign-In Authentication' : 'New Account Registration'}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0; color: #64748b;">Timestamp:</td>
                        <td style="padding: 4px 0; font-weight: 600; text-align: right; color: #64748b;">${formattedDate}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Member Guidelines -->
              <h3 style="font-size: 15px; font-weight: 700; color: #0f172a; margin-bottom: 14px; text-transform: uppercase; letter-spacing: 0.04em;">
                🛡️ Important Account Guidelines
              </h3>
              <ul style="padding-left: 20px; margin: 0 0 28px; font-size: 13.5px; line-height: 1.65; color: #334155;">
                <li style="margin-bottom: 10px;">
                  <strong>Account Security:</strong> Keep your authentication credentials private and never share them with anyone.
                </li>
                <li style="margin-bottom: 10px;">
                  <strong>Active Monitoring:</strong> Regularly check your portfolio transactions and account statements.
                </li>
                <li style="margin-bottom: 10px;">
                  <strong>Dedicated Support:</strong> If you need any assistance, reach out directly to your account concierge.
                </li>
              </ul>

              <!-- Status Badge -->
              <table width="100%" cellpadding="0" cellspacing="0" style="text-align: center; margin-bottom: 28px;">
                <tr>
                  <td align="center">
                    <span style="display: inline-block; background-color: #3b82f6; color: #ffffff; padding: 14px 32px; border-radius: 8px; font-weight: 700; font-size: 15px;">
                      Account Status: Active &amp; Verified
                    </span>
                  </td>
                </tr>
              </table>

              <p style="font-size: 13px; color: #64748b; line-height: 1.5; margin: 0; text-align: center;">
                Need help? Contact our member operations desk.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 24px 32px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="font-size: 11.5px; color: #94a3b8; margin: 0 0 6px; line-height: 1.5;">
                &copy; 2026 KnightPro Global. All rights reserved.
              </p>
              <p style="font-size: 11px; color: #cbd5e1; margin: 0;">
                You are receiving this confirmation because an account was registered for ${user.email}.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  return {
    id: `email-${Date.now()}`,
    to: user.email,
    recipientName: user.name,
    subject,
    htmlContent,
    sentAt: now.toISOString(),
    accountTier: tierName,
    importantPoints,
  };
}

/**
 * Immediately dispatches the notification email via backend API (EmailJS) and caches in local mailbox storage.
 */
export async function sendWelcomeEmail(
  user: UserProfile,
  type: 'register' | 'login' = 'register'
): Promise<{ success: boolean; email: WelcomeEmailData }> {
  const emailData = generateWelcomeEmailContent(user, type);

  // 1. Dispatch to server API endpoint immediately via EmailJS
  try {
    let emailJsConfig;
    if (typeof window !== 'undefined') {
      try {
        const rawEmailJs = localStorage.getItem('bitcoinpro_emailjs_config');
        if (rawEmailJs) emailJsConfig = JSON.parse(rawEmailJs);
      } catch { }
    }

    await fetch('/api/auth/send-welcome-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: user.email,
        name: user.name,
        role: user.role,
        subject: emailData.subject,
        htmlContent: emailData.htmlContent,
        emailJsConfig,
      }),
    });
  } catch (err) {
    console.warn('API send-welcome-email endpoint notice:', err);
  }

  // 2. Cache in local storage mailbox
  if (typeof window !== 'undefined') {
    try {
      const existing = getStoredSentEmails();
      const updated = [emailData, ...existing];
      localStorage.setItem(STORAGE_KEY_EMAILS, JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to store sent email', err);
    }
  }

  return { success: true, email: emailData };
}

export function getStoredSentEmails(): WelcomeEmailData[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_EMAILS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getLastWelcomeEmail(): WelcomeEmailData | null {
  const emails = getStoredSentEmails();
  return emails.length > 0 ? emails[0] : null;
}
