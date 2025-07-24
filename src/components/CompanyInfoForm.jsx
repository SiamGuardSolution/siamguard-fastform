import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CompanyInfoForm.css';

export default function CompanyInfoForm({ onSubmit }) {
  const [formText, setFormText] = useState('');
  const navigate = useNavigate();

  const [company, setCompany] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    taxId: '',
    logo: null,
  });

  const extractCompanyData = () => {
    const nameMatch = formText.match(/ชื่อ[:：]?\s*(.+)/);
    const addressMatch = formText.match(/ที่อยู่[:：]?\s*(.+)/);
    const phoneMatch = formText.match(/เบอร์โทร[:：]?\s*(.+)/);
    const emailMatch = formText.match(/อีเมล[:：]?\s*(.+)/);
    const taxIdMatch = formText.match(/เลขประจำตัวผู้เสียภาษี[:：]?\s*(.+)/);

    setCompany({
      ...company,
      name: nameMatch?.[1] || '',
      address: addressMatch?.[1] || '',
      phone: phoneMatch?.[1] || '',
      email: emailMatch?.[1] || '',
      taxId: taxIdMatch?.[1] || '',
    });
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setCompany({ ...company, logo: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    console.log('✅ บันทึกข้อมูลบริษัท:', company);
    if (onSubmit) {
      onSubmit(company);
    }
    navigate('/quotation-form');
  };

  return (
    <div className="company-form-container">
      <div className="company-form">
        <h1 className="form-title">ข้อมูลบริษัท</h1>
        <p>กรอกข้อความจากฟอร์ม</p>

        <textarea
          value={formText}
          onChange={(e) => setFormText(e.target.value)}
          rows={5}
          placeholder="สำหรับใส่ฟอร์มที่คัดลอกมา"
          className="textarea"
        />

        <div className="centered-button">
          <button onClick={extractCompanyData} className="button secondary">
            📄 ดึงข้อมูลจากข้อความ
          </button>
        </div>

        <div className="input-group">
          <label>ชื่อบริษัท
            <input
              type="text"
              value={company.name}
              onChange={(e) => setCompany({ ...company, name: e.target.value })}
            />
          </label>

          <label>ที่อยู่บริษัท
            <input
              type="text"
              value={company.address}
              onChange={(e) => setCompany({ ...company, address: e.target.value })}
            />
          </label>

          <label>เบอร์ติดต่อ
            <input
              type="text"
              value={company.phone}
              onChange={(e) => setCompany({ ...company, phone: e.target.value })}
            />
          </label>

          <label>อีเมล
            <input
              type="email"
              value={company.email}
              onChange={(e) => setCompany({ ...company, email: e.target.value })}
            />
          </label>

          <label>เลขประจำตัวผู้เสียภาษี
            <input
              type="text"
              value={company.taxId}
              onChange={(e) => setCompany({ ...company, taxId: e.target.value })}
            />
          </label>

          <label>เลือกโลโก้
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
            />
          </label>
        </div>

        <div className="centered-button">
          <button onClick={handleSave} className="button primary">
            💾 บันทึกข้อมูลบริษัท
          </button>
        </div>
      </div>
    </div>
  );
}
