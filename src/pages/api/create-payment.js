export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const username = 'siamguard';
  const password = process.env.BEAM_API_KEY;

  const beamEndpoint = 'https://api.beamcheckout.com/api/v1/payment-links';

  const payload = {
    collectDeliveryAddress: false,
    expiresAt: '2025-12-31T23:59:59.000Z',
    feeType: 'TRANSACTION_FEE',
    linkSettings: {
      buyNowPayLater: { isEnabled: false },
      card: { isEnabled: false },
      cardInstallments: { isEnabled: false },
      eWallets: { isEnabled: true },
      mobileBanking: { isEnabled: true },
      qrPromptPay: { isEnabled: true }
    },
    order: {
      currency: 'THB',
      description: 'SiamGuard License Key',
      internalOrderId: 'order12345',
      netAmount: 36500,
      orderItems: [
        {
          name: 'SiamGuard License Key',
          amount: 36500,
          quantity: 1
        }
      ],
      referenceId: 'order#100001'
    },
    redirectUrl: 'https://www.siamguards.com/thankyou'
  };

  const authHeader =
    'Basic ' + Buffer.from(`${username}:${password}`).toString('base64');

  try {
    const beamRes = await fetch(beamEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify(payload)
    });

    const rawText = await beamRes.text();
      console.log('📄 Raw Beam Response:', rawText);

      let data;
      try {
        data = JSON.parse(rawText);
      } catch (err) {
        console.error('❌ JSON parse error:', err);
        return res.status(500).json({ message: 'Beam returned non-JSON response', raw: rawText });
      }

    if (!beamRes.ok) {
      console.error('Beam Error:', data);
      return res.status(beamRes.status).json({ message: 'Beam Error', error: data });
    }

    return res.status(200).json({ checkout_url: data.url });
  } catch (error) {
    console.error('Internal Error:', error);
    return res.status(500).json({ message: 'Internal Server Error', error });
  }
}
