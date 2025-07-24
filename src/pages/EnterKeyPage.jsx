import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EnterKeyPage.css'; // 👉 import CSS แยกต่างหาก

const validKeys = ['SG1234', 'SG8888', 'SGCRM2025'];

export default function EnterKeyPage() {
  const [keyInput, setKeyInput] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedKey = keyInput.trim();

    if (validKeys.includes(trimmedKey)) {
      sessionStorage.setItem('licenseKey', trimmedKey);
      navigate('/company-form');
    } else {
      setError('❌ License Key ไม่ถูกต้อง');
    }
  };

  return (
    <div className="enter-key-container">
      <div className="enter-key-box">
        <h1 className="enter-key-title">
          🔒 เข้าสู่ระบบด้วย <span>License Key</span>
        </h1>

        <form onSubmit={handleSubmit} className="enter-key-form">
          <input
            type="text"
            placeholder="กรอก License Key"
            className="enter-key-input"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
          />
          <button type="submit" className="enter-key-button">
            ดำเนินการต่อ
          </button>
        </form>

        {error && <p className="enter-key-error">{error}</p>}
      </div>
    </div>
  );

}
