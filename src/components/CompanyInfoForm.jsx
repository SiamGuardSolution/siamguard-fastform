import { useState, useEffect } from 'react'; // ✅ ต้อง import useEffect ด้วย
import { useNavigate } from 'react-router-dom';

export default function CompanyInfoForm({ onSubmit }) {
  const navigate = useNavigate();

  useEffect(() => {
    const licenseKey = sessionStorage.getItem('licenseKey');
    if (!licenseKey) {
      navigate('/'); // ถ้าไม่มี licenseKey → กลับหน้าแรก
    }
  }, [navigate]); // ✅ เพิ่ม navigate เป็น dependency

  const [form, setForm] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    logo: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'logo' && files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, logo: reader.result }));
      };
      reader.readAsDataURL(files[0]);
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = () => {
    if (!form.name || !form.logo) {
      alert('กรุณากรอกชื่อบริษัทและอัปโหลดโลโก้');
      return;
    }
    onSubmit(form); // ส่งข้อมูลไปเก็บไว้ใน App
    navigate('/quotation-form'); // ✅ เปลี่ยนหน้าไปฟอร์มใบเสนอราคา
  };

  return (
    <div className="p-4 border rounded shadow-md max-w-lg mx-auto mt-4">
      <h2 className="text-xl font-bold mb-4">📇 ข้อมูลบริษัท</h2>
      <input name="name" placeholder="ชื่อบริษัท" onChange={handleChange} className="border p-2 mb-2 w-full" />
      <input name="address" placeholder="ที่อยู่บริษัท" onChange={handleChange} className="border p-2 mb-2 w-full" />
      <input name="phone" placeholder="เบอร์โทร" onChange={handleChange} className="border p-2 mb-2 w-full" />
      <input name="email" placeholder="อีเมล" onChange={handleChange} className="border p-2 mb-2 w-full" />
      <input name="logo" type="file" accept="image/*" onChange={handleChange} className="mb-4" />
      <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">
        ✅ บันทึกข้อมูลบริษัท
      </button>
    </div>
  );
}
