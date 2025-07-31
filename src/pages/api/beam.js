// pages/api/beam.js

import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const payload = req.body;
    console.log('📩 Webhook Payload:', payload);

    if (payload.event !== 'payment_link.paid') {
      return res.status(200).json({ message: 'Ignored: Not a payment_link.paid event' });
    }

    const email = payload?.data?.customer_email;

    if (!email) {
      return res.status(400).json({ message: 'Missing email in webhook payload' });
    }

    const licenseKey = generateLicenseKey();

    const licensesPath = path.join(process.cwd(), 'data', 'licenses.json');

    // สร้างโฟลเดอร์ /data ถ้ายังไม่มี
    const dataDir = path.dirname(licensesPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // โหลดไฟล์ JSON เดิม (ถ้ามี)
    let licenses = {};
    if (fs.existsSync(licensesPath)) {
      const raw = fs.readFileSync(licensesPath);
      licenses = JSON.parse(raw);
    }

    // ถ้ามี email นี้อยู่แล้ว ไม่ต้องสร้างซ้ำ
    if (licenses[email]) {
      console.log(`🔁 License already exists for ${email}: ${licenses[email]}`);
      return res.status(200).json({ license_key: licenses[email] });
    }

    // เพิ่มใหม่
    licenses[email] = licenseKey;
    fs.writeFileSync(licensesPath, JSON.stringify(licenses, null, 2));

    console.log(`✅ Created license key for ${email}: ${licenseKey}`);
    return res.status(200).json({ license_key: licenseKey });
  } catch (error) {
    console.error('❌ Webhook error:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
}

// 🔐 สร้าง License Key แบบสุ่ม
function generateLicenseKey() {
  return 'SG-' + Math.random().toString(36).substring(2, 10).toUpperCase();
}
