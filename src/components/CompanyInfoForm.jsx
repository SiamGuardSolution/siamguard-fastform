//
//
// CompanyInfoForm.jsxที่ใช้อยู่ตอนนี้
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CompanyInfoForm({ onSubmit }) {
  const [formText, setFormText] = useState('');
  
  const extractCompanyData = () => {
    const nameMatch = formText.match(/ชื่อ[:：]?\s*(.+)/);
    const addressMatch = formText.match(/ที่อยู่[:：]?\s*(.+)/);
    const phoneMatch = formText.match(/เบอร์โทร[:：]?\s*(.+)/);
    const emailMatch = formText.match(/อีเมล[:：]?\s*(.+)/);

    setCompany({
      ...company,
      name: nameMatch?.[1] || '',
      address: addressMatch?.[1] || '',
      phone: phoneMatch?.[1] || '',
      email: emailMatch?.[1] || '',
    });
  };

  const navigate = useNavigate();

  const [company, setCompany] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    logo: null,
  });

  const handleLogoUpload = (e) => {
      const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setCompany({ ...company, logo: reader.result }); // ✅ เก็บเป็น base64
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    console.log('✅ บันทึกข้อมูลบริษัท:', company);
    if (onSubmit) {
      onSubmit(company); // ส่งข้อมูลกลับไปที่ App.jsx
    }

    navigate('/quotation-form');
  };

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '28px', marginBottom: '10px' }}>ข้อมูลบริษัท</h1>
      <p style={{ marginBottom: '10px' }}>กรอกข้อความจากฟอร์ม</p>

      <textarea
        value={formText}
        onChange={(e) => setFormText(e.target.value)}
        rows={6}
        style={{
          width: '100%',
          padding: '10px',
          fontSize: '16px',
          marginBottom: '10px',
        }}
        placeholder="สำหรับใส่ฟอร์มที่คัดลอกมา"
      />

      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <button
          onClick={extractCompanyData}
          style={{
            padding: '6px 16px',
            fontSize: '14px',
            borderRadius: '8px',
            border: '1px solid #000',
          }}
        >
          ปุ่มดึงข้อมูลจากข้อความในฟอร์ม
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <label>
          ชื่อบริษัท
          <input
            type="text"
            value={company.name}
            onChange={(e) =>
              setCompany({ ...company, name: e.target.value })
            }
            style={{ width: '100%', padding: '8px', fontSize: '14px' }}
          />
        </label>

        <label>
          ที่อยู่บริษัท
          <input
            type="text"
            value={company.address}
            onChange={(e) =>
              setCompany({ ...company, address: e.target.value })
            }
            style={{ width: '100%', padding: '8px', fontSize: '14px' }}
          />
        </label>

        <label>
          เบอร์ติดต่อ
          <input
            type="text"
            value={company.phone}
            onChange={(e) =>
              setCompany({ ...company, phone: e.target.value })
            }
            style={{ width: '100%', padding: '8px', fontSize: '14px' }}
          />
        </label>

        <label>
          อีเมล
          <input
            type="email"
            value={company.email}
            onChange={(e) =>
              setCompany({ ...company, email: e.target.value })
            }
            style={{ width: '100%', padding: '8px', fontSize: '14px' }}
          />
        </label>

        <label>
          เลือกโลโก้
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            style={{ display: 'block', marginTop: '5px' }}
          />
        </label>
      </div>

      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <button
          onClick={handleSave}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            borderRadius: '10px',
            border: '1px solid #000',
            background: '#f0f0f0',
          }}
        >
          💾 บันทึกข้อมูลบริษัท
        </button>
      </div>
    </div>
  );
}
