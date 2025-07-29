// นี่คือโค้ด EnterKeyPage.jsx (พร้อมระบบตรวจสอบ Key + background) เพิ่มเติมปุ่มจากโค้ดนี้โดยไม่เปลี่ยนแปลงโค้ดเดิม
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function EnterKeyPage() {
  const [keyInput, setKeyInput] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const VALID_LICENSE_KEY = 'SG1234'; // 🔐 ตัวอย่าง key ที่ถูกต้อง (สามารถเชื่อมต่อกับ backend ได้ในอนาคต)

  const handleSubmit = () => {
    if (keyInput.trim() === '') {
      setError('กรุณากรอก License Key');
      return;
    }

    if (keyInput.trim() !== VALID_LICENSE_KEY) {
      setError('❌ License Key ไม่ถูกต้อง');
      return;
    }

    // ✅ ถ้าผ่าน
    localStorage.setItem('licenseKey', keyInput);
    navigate('/company-form');
  };

  return (
    <div
      style={{
        backgroundImage: `url('/assets/SG-Background.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        padding: '40px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: '30px',
          borderRadius: '12px',
          maxWidth: '400px',
          width: '100%',
          boxShadow: '0 0 10px rgba(0,0,0,0.2)',
        }}
      >
        <h1 style={{ marginBottom: '20px', textAlign: 'center', fontSize: '24px' }}>
          🔐 เข้าสู่ระบบด้วย License Key
        </h1>
        <input
          type="text"
          placeholder="พิมพ์ License Key ที่นี่"
          value={keyInput}
          onChange={(e) => setKeyInput(e.target.value)}
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '16px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            marginBottom: '15px',
            boxSizing: 'border-box',
          }}
        />

        {error && (
          <p style={{ color: 'red', marginBottom: '15px', textAlign: 'center' }}>{error}</p>
        )}

        <button
          onClick={handleSubmit}
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '16px',
            backgroundColor: '#007BFF',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
        ยืนยัน License Key
        </button>

        {/* ปุ่มซื้อผ่านระบบอัตโนมัติ */}
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <p style={{ marginBottom: '10px', color: '#555' }}>ยังไม่มี License Key?</p>
          <button
            onClick={() => {
              const beamCheckoutUrl =
                'https://pay.beamcheckout.com/siamguard/FastformSG';
              window.location.href = beamCheckoutUrl;
            }}
            style={{
              padding: '10px 16px',
              fontSize: '16px',
              backgroundColor: '#28a745',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            ซื้อผ่านระบบอัตโนมัติ
          </button>
        </div>

        {/* ปุ่มเพิ่มเติม: ดูวิดีโอสาธิต */}
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button
            onClick={() => {
              window.open('https://www.youtube.com/watch?v=YOUR_VIDEO_ID', '_blank');
            }}
            style={{
              padding: '10px 16px',
              fontSize: '16px',
              backgroundColor: '#6c757d',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            ▶️ ดูวิดีโอวิธีใช้งาน
          </button>
        </div>
      </div>
    </div>
  );
}
