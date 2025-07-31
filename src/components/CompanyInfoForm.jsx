// src/components/CompanyInfoForm.jsx
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import styles from './CompanyInfoForm.module.css';

export default function CompanyInfoForm({ onSubmit }) {
  const router = useRouter();
  const [formText, setFormText] = useState('');
  const [showTaxIdInPdf, setShowTaxIdInPdf] = useState(false);

  const [company, setCompany] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    taxId: '',
    logo: null,
    showTaxId: true,
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
    const companyToSave = {
      name: company.name,
      address: company.address,
      phone: company.phone,
      email: company.email,
      taxId: company.taxId,
      logoBase64: company.logo,
      showTaxId: showTaxIdInPdf,
    };

    sessionStorage.setItem('companyInfo', JSON.stringify(companyToSave));
    router.push('/quotation-form');
  };



  return (
    <div className={styles.companyFormContainer}>
       <div className={styles.companyForm}>
        <h1 className={styles.formTitle}>ข้อมูลบริษัท</h1>
        <p>กรอกข้อความจากฟอร์ม</p>

        <textarea
          value={formText}
          onChange={(e) => setFormText(e.target.value)}
          rows={5}
          placeholder="สำหรับใส่ฟอร์มที่คัดลอกมา"
          className={styles.textarea}
        />

        <div className={styles.centeredButton}>
          <button 
            className={styles.buttonSecondary}
            onClick={extractCompanyData}
          >
            📄 ดึงข้อมูลจากข้อความ
          </button>
        </div>

        <div className={styles.inputGroup}>
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
        </div>

         <div className={styles.checkboxRow}>
          <input
            type="checkbox"
            checked={showTaxIdInPdf}
            onChange={(e) => setShowTaxIdInPdf(e.target.checked)}
            style={{ marginRight: '8px' }}
          />
          <label>แสดงเลขประจำตัวผู้เสียภาษีใน PDF</label>
        </div>

        <div className={styles.logoUpload}>
          <label htmlFor="logoInput">เลือกโลโก้</label>
          <input
            id="logoInput"
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            style={{ marginLeft: '15px' }}
          />
        </div>

        <div className={styles.centeredButton}>
          <button 
            onClick={handleSave}
            className={styles.buttonPrimary}
          >
            💾 บันทึกข้อมูลบริษัท
          </button>
        </div>
      </div>
    </div>
  );
}
