export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { event, data } = req.body;

  if (event === 'payment_link.paid') {
    const email = data.customer.email;
    const licenseKey = 'SG' + Math.floor(1000 + Math.random() * 9000);

    console.log('✅ Payment received from', email, 'License:', licenseKey);

    // TODO: save to database, send email, etc.
  }

  return res.status(200).json({ received: true });
}
