// QuotationForm.jsx ที่ใช้อยู่ในตอนนี้
import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import '../fonts/THSarabun';
import { useNavigate } from 'react-router-dom';



function generateQuotationNumber() {
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0].replace(/-/g, ''); // YYYYMMDD
  return `QT-${dateStr}`;
}


export default function QuotationForm({ company }) {
  const [quotationNumber] = useState(generateQuotationNumber());
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [items, setItems] = useState([{ name: '', quantity: 1, price: 0 }]);
  const clearCache = () => {
      sessionStorage.removeItem('quotationClientName');
      sessionStorage.removeItem('quotationItems');
      setClientName('');
      setItems([{ name: '', quantity: '', price: '' }]);
    };
  const [notes, setNotes] = useState(['']);;
  const [paymentTerms, setPaymentTerms] = useState(['']);

  const handlePaymentTermChange = (index, value) => {
    const updated = [...paymentTerms];
    updated[index] = value;
    setPaymentTerms(updated);
  };

  const addPaymentTerm = () => {
    setPaymentTerms([...paymentTerms, '']);
  };

  const removePaymentTerm = (index) => {
    const updated = paymentTerms.filter((_, i) => i !== index);
    setPaymentTerms(updated);
  };

  const [includeVAT, setIncludeVAT] = useState(true);

  const navigate = useNavigate();


  useEffect(() => {
    const cachedClient = sessionStorage.getItem('quotationClientName');
    const cachedItems = sessionStorage.getItem('quotationItems');
    if (cachedClient) setClientName(cachedClient);
    if (cachedItems) setItems(JSON.parse(cachedItems));
  }, []);

  const addItem = () => {
    setItems([...items, { name: '', quantity: 1, price: 0 }]);
  };

  const handleItemChange = (index, field, value) => {
  const newItems = [...items];
  newItems[index][field] = value; // เก็บเป็น string ไว้ก่อน
  setItems(newItems);
};

  const handleNoteChange = (index, value) => {
    const updatedNotes = [...notes];
    updatedNotes[index] = value;
    setNotes(updatedNotes);
  };

  const addNote = () => {
    setNotes([...notes, '']);
  };

  const removeNote = (index) => {
    const updatedNotes = notes.filter((_, i) => i !== index);
    setNotes(updatedNotes);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFont('THSarabun');

    // ✅ แสดงโลโก้บริษัท
    if (company.logo) {
      doc.addImage(company.logo, 'PNG', 14, 10, 30, 30);
    }

    // ✅ ข้อมูลบริษัท
    doc.setFont('THSarabun');
    doc.setFontSize(14);
    doc.text(company.name || '', 50, 15);
    doc.text(company.address || '', 50, 21);
    doc.text(`โทร: ${company.phone || ''} | อีเมล: ${company.email || ''}`, 50, 27);

    // ✅ หัวใบเสนอราคา
    doc.setFont('THSarabun');
    doc.setFontSize(18);
    doc.text('ใบเสนอราคา', 14, 50);
    doc.setFontSize(14);
    doc.text(`เลขที่ใบเสนอราคา: ${quotationNumber}`, 190, 60, { align: 'right' }); // หรือปรับตำแหน่งตามต้องการ
    doc.setFontSize(14);
    doc.text(`ชื่อลูกค้า: ${clientName}`, 14, 60);
    doc.text(`เบอร์โทรลูกค้า: ${clientPhone}`, 14, 66);

    // ✅ สร้างตารางสินค้า
    const tableData = items.map((item) => [
      item.name,
      item.quantity,
      item.price,
      (Number(item.quantity) * Number(item.price)).toFixed(2),
    ]);

    const today = new Date().toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    doc.text(`วันที่: ${today}`, 190, 50, { align: 'right' }); // ปรับตำแหน่ง x,y ตามต้องการ


    autoTable(doc, {
      startY: 75,
      head: [['สินค้า/บริการ', 'จำนวน', 'ราคาต่อหน่วย', 'รวม']],
      body: tableData,
      styles: {
        font: 'THSarabun',
        fontStyle: 'normal',
        fontSize: 14,
      },
      headStyles: {
        font: 'THSarabun',
        fontStyle: 'normal',
        fontSize: 14,
        fillColor: [41, 128, 185], // สีน้ำเงิน
        textColor: [255, 255, 255],
        halign: 'left',
      },
      bodyStyles: {
        font: 'THSarabun',
        fontStyle: 'normal',
        fontSize: 14,
        halign: 'left',
      },
    });

    // ✅ คำนวณราคารวมทั้งหมด
    const subtotal = items.reduce(
      (sum, item) => sum + Number(item.quantity) * Number(item.price),
      0
    );
    const vat = includeVAT ? subtotal * 0.07 : 0;
    const grandTotal = subtotal + vat;
    
    const totalY = doc.lastAutoTable.finalY + 10;

    if (includeVAT) {
      doc.text('รวมเป็นเงิน', 130, totalY);
      doc.text(`${subtotal.toFixed(2)} บาท`, 180, totalY, { align: 'right' });

      doc.text('ภาษีมูลค่าเพิ่ม 7 %', 120, totalY + 7);
      doc.text(`${vat.toFixed(2)} บาท`, 180, totalY + 7, { align: 'right' });

      doc.text('ค่าใช้จ่ายรวมทั้งสิ้น', 120, totalY + 14);
      doc.text(`${grandTotal.toFixed(2)} บาท`, 180, totalY + 14, { align: 'right' });
    } else {
      doc.text('รวมเป็นเงิน', 130, totalY);
      doc.text(`${subtotal.toFixed(2)} บาท`, 180, totalY, { align: 'right' });

      doc.text('ค่าใช้จ่ายรวมทั้งสิ้น', 120, totalY + 7);
      doc.text(`${subtotal.toFixed(2)} บาท`, 180, totalY + 7, { align: 'right' });
    }


    let noteY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.text('หมายเหตุ:', 14, noteY);
    notes.forEach((n, idx) => {
      noteY += 7;
      doc.text(`- ${n}`, 20, noteY);
    });

    let termY = noteY + 15;
    doc.setFontSize(14);
    doc.text('เงื่อนไขการชำระเงิน:', 14, termY);
    paymentTerms.forEach((t, idx) => {
      termY += 7;
      doc.text(`- ${t}`, 20, termY);
    });

    // ✅ ก่อน doc.save(...)
    sessionStorage.setItem('quotationClientName', clientName);
    sessionStorage.setItem('quotationItems', JSON.stringify(items));


    doc.save('quotation.pdf');
  };

  return (
   <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow space-y-5">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        🧾 ข้อมูลใบเสนอราคา
      </h2>

      <p className="text-sm text-gray-500">เลขที่ใบเสนอราคา: <span className="font-mono text-black">{quotationNumber}</span></p>

      {/* ชื่อลูกค้า */}
      <input
        type="text"
        placeholder="ชื่อลูกค้า"
        value={clientName}
        onChange={(e) => setClientName(e.target.value)}
        className="w-full border rounded px-4 py-2 text-sm"
      />

      {/* เบอร์โทร */}
      <input
        type="text"
        placeholder="เบอร์โทร"
        value={clientPhone}
        onChange={(e) => setClientPhone(e.target.value)}
        className="w-full border rounded px-4 py-2 text-sm"
      />

      {/* รายการสินค้า */}
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="grid grid-cols-4 gap-3">
            <input
              type="text"
              placeholder="ชื่อบริการ"
              value={item.name}
              onChange={(e) => handleItemChange(index, 'name', e.target.value)}
              className="border rounded px-3 py-2 text-sm"
            />
            <input
              type="number"
              placeholder="จำนวน"
              value={item.quantity}
              onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
              className="border rounded px-3 py-2 text-sm"
            />
            <input
              type="number"
              placeholder="ราคาต่อหน่วย"
              value={item.price}
              onChange={(e) => handleItemChange(index, 'price', e.target.value)}
              className="border rounded px-3 py-2 text-sm"
            />
            {index === items.length - 1 ? (
              <button
                onClick={addItem}
                className="text-blue-600 hover:underline text-sm whitespace-nowrap"
              >
                + เพิ่มรายการ
              </button>
            ) : (
              <span></span> // คอลัมน์ว่างสำหรับไม่ให้ layout เพี้ยน
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={includeVAT}
          onChange={() => setIncludeVAT(!includeVAT)}
          id="vat-toggle"
        />
        <label htmlFor="vat-toggle" className="text-sm text-gray-700">รวมภาษีมูลค่าเพิ่ม 7%</label>
      </div>

      {/* หมายเหตุ */}
      <div className="mt-6">
        <h3 className="text-md font-semibold mb-2">หมายเหตุ</h3>

        {notes.map((note, index) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <input
              type="text"
              value={note}
              onChange={(e) => handleNoteChange(index, e.target.value)}
              placeholder={`หมายเหตุ #${index + 1}`}
              className="flex-1 px-3 py-2 border rounded-md text-sm"
            />
            {notes.length > 1 && (
              <button
                onClick={() => removeNote(index)}
                className="text-red-500 hover:underline text-sm"
              >
                ❌
              </button>
            )}
          </div>
        ))}

        <button
          onClick={addNote}
          className="border rounded px-3 py-2 text-sm hover:bg-gray-100"
        >
          ➕ เพิ่มหมายเหตุ
        </button>
      </div>

      <div className="mt-6">
        <h3 className="text-md font-semibold mb-2">เงื่อนไขการชำระเงิน</h3>

        {paymentTerms.map((term, index) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <input
              type="text"
              value={term}
              onChange={(e) => handlePaymentTermChange(index, e.target.value)}
              placeholder={`เงื่อนไข #${index + 1}`}
              className="flex-1 px-3 py-2 border rounded-md text-sm"
            />
            {paymentTerms.length > 1 && (
              <button
                onClick={() => removePaymentTerm(index)}
                className="text-red-500 hover:underline text-sm"
              >
                ❌
              </button>
            )}
          </div>
        ))}

        <button
          onClick={addPaymentTerm}
          className="border rounded px-3 py-2 text-sm hover:bg-gray-100"
        >
          ➕ เพิ่มเงื่อนไข
        </button>
      </div>


      {/* ปุ่มต่าง ๆ */}
      <div className="flex flex-wrap gap-3 pt-2">
        <button onClick={() => navigate('/company-form')} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 text-sm">
          🔧 แก้ข้อมูลบริษัท
        </button>
        <button onClick={generatePDF} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm">
          📄 สร้าง PDF
        </button>
        <button onClick={clearCache} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 text-sm">
          🗑 ล้างข้อมูล
        </button>
      </div>
    </div>
  );
}
