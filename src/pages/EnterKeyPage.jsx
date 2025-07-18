// src/pages/EnterKeyPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">
          🔒 เข้าสู่ระบบด้วย <span className="text-black">License Key</span>
        </h1>

        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            placeholder="กรอก License Key"
            className="border px-3 py-2 rounded"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            ดำเนินการต่อ
          </button>
        </form>

        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
    
  );
}
