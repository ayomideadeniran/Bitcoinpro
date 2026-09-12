import { NextResponse } from 'next/server';
import docusign from 'docusign-esign';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userName, userEmail } = body;

    if (!userName || !userEmail) {
      return NextResponse.json({ error: 'Missing userName or userEmail' }, { status: 400 });
    }

    const {
      DOCUSIGN_CLIENT_ID,
      DOCUSIGN_USER_ID,
      DOCUSIGN_RSA_KEY,
      DOCUSIGN_TEMPLATE_ID,
    } = process.env;

    if (!DOCUSIGN_CLIENT_ID || !DOCUSIGN_USER_ID || !DOCUSIGN_RSA_KEY || !DOCUSIGN_TEMPLATE_ID) {
      return NextResponse.json({ error: 'DocuSign credentials not configured in .env.local' }, { status: 500 });
    }

    const apiClient = new docusign.ApiClient();
    apiClient.setBasePath('https://demo.docusign.net/restapi');
    
    // Convert multiline RSA key string properly if it was stored with literal \n
    const rsaKey = DOCUSIGN_RSA_KEY.replace(/\\n/g, '\n');

    const authRes = await apiClient.requestJWTUserToken(
      DOCUSIGN_CLIENT_ID,
      DOCUSIGN_USER_ID,
      ['signature'],
      rsaKey,
      3600
    );

    const accessToken = authRes.body.access_token;
    apiClient.addDefaultHeader('Authorization', 'Bearer ' + accessToken);
    const envelopesApi = new docusign.EnvelopesApi(apiClient);

    // Get user info to get account ID
    const userInfo = await apiClient.getUserInfo(accessToken);
    const accountId = userInfo.accounts[0].accountId;

    // Create Envelope from Template
    const envDef = new docusign.EnvelopeDefinition();
    envDef.templateId = DOCUSIGN_TEMPLATE_ID;
    
    const signer = docusign.TemplateRole.constructFromObject({
      email: userEmail,
      name: userName,
      roleName: 'Investor', // Must match template role
      clientUserId: '1001', // Required for embedded signing
    });

    envDef.templateRoles = [signer];
    envDef.status = 'sent';

    const envelopeSummary = await envelopesApi.createEnvelope(accountId, { envelopeDefinition: envDef });
    const envelopeId = envelopeSummary.envelopeId;

    if (!envelopeId) {
      throw new Error('Failed to create envelope');
    }

    // Create Recipient View for Embedded Signing
    const viewRequest = new docusign.RecipientViewRequest();
    viewRequest.returnUrl = `http://localhost:3000/dashboard?signed=true`;
    viewRequest.authenticationMethod = 'none';
    viewRequest.email = userEmail;
    viewRequest.userName = userName;
    viewRequest.clientUserId = '1001';

    const viewResult = await envelopesApi.createRecipientView(accountId, envelopeId, { recipientViewRequest: viewRequest });

    return NextResponse.json({ url: viewResult.url });
  } catch (err: any) {
    console.error('[DocuSign Error]', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
