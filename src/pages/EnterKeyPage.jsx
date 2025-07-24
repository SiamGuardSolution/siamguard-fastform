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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-sm text-center">
        <h1 className="text-red-500 text-3xl font-bold">Test Tailwind!</h1>

        <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4">
          <input
            type="text"
            placeholder="กรอก License Key"
            className="border px-4 py-2 rounded w-full text-center"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
          />
          <button
            type="submit"
            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 w-full"
          >
            ดำเนินการต่อ
          </button>
        </form>

        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );

}
