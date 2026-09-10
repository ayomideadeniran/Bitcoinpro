import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, role, subject, htmlContent, emailJsConfig } = body;

    if (!email) {
      return NextResponse.json({ error: 'Recipient email is required' }, { status: 400 });
    }

    const timestamp = new Date().toISOString();
    const recipientName = name || 'Valued Member';
    const emailSubject = subject || `Welcome to KnightPro, ${recipientName}!`;
    const emailHtml = htmlContent || `<p>Welcome to KnightPro, ${recipientName}!</p>`;

    // EmailJS credentials from environment or client config
    const emailJsServiceId = emailJsConfig?.serviceId || process.env.EMAILJS_SERVICE_ID;
    const emailJsTemplateId = emailJsConfig?.templateId || process.env.EMAILJS_TEMPLATE_ID;
    const emailJsPublicKey = emailJsConfig?.publicKey || process.env.EMAILJS_PUBLIC_KEY;
    const emailJsPrivateKey = emailJsConfig?.privateKey || process.env.EMAILJS_PRIVATE_KEY;

    if (!emailJsServiceId || !emailJsTemplateId || !emailJsPublicKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'EmailJS credentials missing. Please verify EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, and EMAILJS_PUBLIC_KEY in .env.local.',
        },
        { status: 500 }
      );
    }

    console.log(`[EMAILJS DISPATCH] Sending via EmailJS Service: ${emailJsServiceId}, Template: ${emailJsTemplateId} to ${email}...`);

    const originHeader = request.headers.get('origin') || 'http://localhost:3000';
    const emailJsResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': originHeader,
      },
      body: JSON.stringify({
        service_id: emailJsServiceId,
        template_id: emailJsTemplateId,
        user_id: emailJsPublicKey,
        ...(emailJsPrivateKey ? { accessToken: emailJsPrivateKey } : {}),
        template_params: {
          from_name: 'KnightPro Desk',
          to_name: recipientName,
          name: recipientName,
          user_name: recipientName,
          to_email: email,
          email: email,
          to: email,
          user_email: email,
          recipient: email,
          recipient_email: email,
          dest_email: email,
          subject: emailSubject,
          title: `Welcome, ${recipientName}`,
          time: new Date().toUTCString(),
          message: `Welcome to KnightPro, ${recipientName}!\n\nYour account has been successfully created and verified.\n\nAccount Parameters:\n• Account Name: ${recipientName}\n• Account Role: ${role || 'INVESTOR'}\n• Registered Email: ${email}\n\nNext Steps:\n1. Log in to your personal dashboard to review your portfolio overview.\n2. Keep your login credentials secure at all times.\n3. Contact member support if you have any questions.`,
          html_content: emailHtml,
          content: emailHtml,
          body: emailHtml,
        },
      }),
    });

    if (emailJsResponse.ok) {
      const respText = await emailJsResponse.text();
      console.log(`[EMAILJS SUCCESS] Dispatched to ${email}:`, respText);
      return NextResponse.json({
        success: true,
        provider: 'emailjs',
        serviceId: emailJsServiceId,
        templateId: emailJsTemplateId,
        recipient: email,
        timestamp,
        message: `Real email successfully dispatched to ${email} via EmailJS (${emailJsServiceId})!`,
      });
    } else {
      const errText = await emailJsResponse.text();
      console.warn(`[EMAILJS ERROR] Status ${emailJsResponse.status}: ${errText}`);
      return NextResponse.json(
        {
          success: false,
          provider: 'emailjs',
          error: `EmailJS Error (${emailJsResponse.status}): ${errText}`,
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Error in send-welcome-email API route:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to dispatch email via EmailJS',
      },
      { status: 500 }
    );
  }
}
