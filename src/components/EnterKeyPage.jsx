// นี่คือโค้ด EnterKeyPage.jsx (พร้อมระบบตรวจสอบ Key + background) เพิ่มเติมปุ่มจากโค้ดนี้โดยไม่เปลี่ยนแปลงโค้ดเดิม
import React, { useState } from 'react';
import { useRouter } from 'next/router';

export default function EnterKeyPage() {
  const [keyInput, setKeyInput] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();;
  const [showVideo, setShowVideo] = useState(false);

  const handleCreatePaymentLink = async () => {
    try {
      const res = await fetch('/api/create-payment', {
        method: 'POST',
      });

      const result = await res.json();

      console.log('💬 Beam Response:', result);

      if (res.ok && result.checkout_url) {
        window.location.href = result.checkout_url;
      } else {
        alert('ไม่สามารถสร้างลิงก์ชำระเงินได้');
        console.error('⚠️ Beam API error:', result);
      }
    } catch (err) {
      alert('เกิดข้อผิดพลาดระหว่างการสร้างลิงก์ชำระเงิน');
      console.error('❌ Network error:', err);
    }
  };


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
    router.push('/company-form');
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
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <p style={{ marginBottom: '10px', color: '#555' }}>ยังไม่มี License Key?</p>

          <button
            onClick={handleCreatePaymentLink}
            style={{
              padding: '10px 16px',
              fontSize: '16px',
              backgroundColor: '#28a745',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            ซื้อผ่านระบบอัตโนมัติ
          </button>
        </div>

        {/* ปุ่มเพิ่มเติม: ดูวิดีโอสาธิต */}
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <button
            onClick={() => setShowVideo(true)}
            style={{
              padding: '8px 14px',
              fontSize: '15px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            🎥 ดูวิดีโอวิธีใช้งาน
          </button>

          {showVideo && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0,0,0,0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
              }}
            >
              <div
                style={{
                  background: '#fff',
                  padding: '10px',
                  borderRadius: '10px',
                  position: 'relative',
                  width: '90%',
                  maxWidth: '720px',
                  boxShadow: '0 0 20px rgba(0,0,0,0.3)',
                }}
              >
                {/* ปุ่มปิด Popup */}
                <button
                  onClick={() => setShowVideo(false)}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: '#ff4d4f',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '50%',
                    width: '30px',
                    height: '30px',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    cursor: 'pointer',
                    zIndex: 10000,
                  }}
                >
                  ✕
                </button>

                {/* กรอบวิดีโอ YouTube */}
                <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                  <iframe
                    src="https://www.youtube.com/embed/YOUR_VIDEO_ID_HERE"
                    title="วิธีใช้งานระบบ"
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      borderRadius: '8px',
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
