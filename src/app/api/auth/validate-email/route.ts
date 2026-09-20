import { NextResponse } from 'next/server';
import dns from 'dns';

// Known disposable/temporary burner email domains
const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com',
  'tempmail.com',
  'temp-mail.org',
  'guerrillamail.com',
  'guerrillamail.net',
  '10minutemail.com',
  'yopmail.com',
  'yopmail.net',
  'trashmail.com',
  'dispostable.com',
  'fakeinbox.com',
  'throwawaymail.com',
  'sharklasers.com',
  'getairmail.com',
  'maildrop.cc',
  'mytemp.email',
  'burnermail.io',
  'crazymailing.com',
  'mohmal.com',
  'nada.ltd',
  'tempail.com',
  'fakemailgenerator.com',
  'emailondeck.com',
  'inboxkitten.com',
]);

// Common typos mapped to correct domains
const COMMON_TYPOS: Record<string, string> = {
  'gmai.com': 'gmail.com',
  'gamil.com': 'gmail.com',
  'gmial.com': 'gmail.com',
  'gmaill.com': 'gmail.com',
  'yaho.com': 'yahoo.com',
  'yahooo.com': 'yahoo.com',
  'hotmial.com': 'hotmail.com',
  'hotmai.com': 'hotmail.com',
  'outlok.com': 'outlook.com',
  'outloo.com': 'outlook.com',
};

// Strict email regex (RFC 5322 compliant)
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rawEmail = body.email;

    if (!rawEmail || typeof rawEmail !== 'string') {
      return NextResponse.json(
        { valid: false, error: 'Email address is required.' },
        { status: 400 }
      );
    }

    const email = rawEmail.trim().toLowerCase();

    // 1. Basic format and length check
    if (email.length > 254 || email.length < 5) {
      return NextResponse.json(
        { valid: false, error: 'Email length is invalid (must be 5–254 characters).' },
        { status: 400 }
      );
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { valid: false, error: 'Please enter a valid email format (e.g. user@domain.com).' },
        { status: 400 }
      );
    }

    const parts = email.split('@');
    if (parts.length !== 2) {
      return NextResponse.json(
        { valid: false, error: 'Invalid email structure.' },
        { status: 400 }
      );
    }

    const [userPart, domain] = parts;

    if (!userPart || !domain || domain.indexOf('.') === -1) {
      return NextResponse.json(
        { valid: false, error: 'Please include a valid domain extension (e.g. .com, .org, .io).' },
        { status: 400 }
      );
    }

    const tld = domain.split('.').pop();
    if (!tld || tld.length < 2 || /\d/.test(tld)) {
      return NextResponse.json(
        { valid: false, error: `'.${tld}' is not a recognized top-level domain.` },
        { status: 400 }
      );
    }

    // 2. Check for common domain typos
    if (COMMON_TYPOS[domain]) {
      const suggested = `${userPart}@${COMMON_TYPOS[domain]}`;
      return NextResponse.json(
        { 
          valid: false, 
          error: `Did you mean '${suggested}'? Please verify your email domain.`,
          suggestion: suggested 
        },
        { status: 400 }
      );
    }

    // 3. Block disposable / burner / test email domains
    if (
      DISPOSABLE_DOMAINS.has(domain) ||
      domain === 'example.com' ||
      domain.endsWith('.example.com') ||
      domain === 'example.org' ||
      domain === 'example.net' ||
      domain === 'invalid' ||
      domain.endsWith('.invalid') ||
      domain === 'test.com' ||
      domain === 'localhost'
    ) {
      return NextResponse.json(
        { valid: false, error: `The domain '@${domain}' is a reserved test or disposable domain and cannot be used for registration.` },
        { status: 400 }
      );
    }

    // 4. DNS MX Record Verification (Verify domain exists and has mail exchange servers)
    try {
      const mxRecords = await dns.promises.resolveMx(domain);
      // Filter out null MX (RFC 7505, e.g. exchange = '' or '.')
      const validMx = mxRecords?.filter((r) => r.exchange && r.exchange.trim() !== '' && r.exchange !== '.');

      if (!validMx || validMx.length === 0) {
        // Fallback: check for A record (RFC 5321 fallback)
        const aRecords = await dns.promises.resolve4(domain);
        if (!aRecords || aRecords.length === 0) {
          return NextResponse.json(
            { valid: false, error: `The domain '@${domain}' has no active mail servers configured.` },
            { status: 400 }
          );
        }
      }
    } catch (dnsErr: any) {
      const code = String(dnsErr?.code || '').toUpperCase();
      if (
        code === 'ENOTFOUND' ||
        code === 'ENODATA' ||
        code === 'NXDOMAIN' ||
        code === 'ESERVFAIL' ||
        code === 'SERVFAIL' ||
        code === 'EREFUSED' ||
        code === 'REFUSED' ||
        code === 'EBADNAME'
      ) {
        // Try fallback A record before rejecting
        try {
          const fallbackA = await dns.promises.resolve4(domain);
          if (!fallbackA || fallbackA.length === 0) {
            return NextResponse.json(
              { valid: false, error: `The email domain '@${domain}' does not exist on the internet or has no active mail server. Please check for typos.` },
              { status: 400 }
            );
          }
        } catch {
          return NextResponse.json(
            { valid: false, error: `The email domain '@${domain}' does not exist on the internet. Please check for typos.` },
            { status: 400 }
          );
        }
      } else {
        return NextResponse.json(
          { valid: false, error: `Unable to verify mail server for '@${domain}'. Please check the domain or use another email.` },
          { status: 400 }
        );
      }
    }

    return NextResponse.json({
      valid: true,
      email,
      domain,
      verified: true,
      message: 'Email address and mail server verified successfully.',
    });
  } catch (error: any) {
    console.error('Email validation error:', error);
    return NextResponse.json(
      { valid: false, error: 'An unexpected error occurred while validating the email address.' },
      { status: 500 }
    );
  }
}
