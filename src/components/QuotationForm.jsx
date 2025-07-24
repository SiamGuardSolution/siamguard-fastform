// ตรวจสอบQuotationForm.jsx ที่ใช้อยู่ในตอนนี้
import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import '../fonts/THSarabun';
import { useNavigate } from 'react-router-dom';
import './QuotationForm.css';


export default function QuotationForm({ company }) {
  const [quotationNumber, setQuotationNumber] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [items, setItems] = useState([{ name: '', quantity: '', price: '' }]);
  const [documentType, setDocumentType] = useState('ใบเสนอราคา');


  const clearCache = () => {
      sessionStorage.removeItem('quotationClientName');
      sessionStorage.removeItem('quotationItems');
      setClientName('');
      setClientPhone('');
      setItems([{ name: '', quantity: '', price: '' }]);
      setNotes([]);
      setPaymentTerms([]);
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
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0].replace(/-/g, ''); // YYYYMMDD
    const prefixMap = {
      'ใบเสนอราคา': 'QT',
      'ใบเสร็จรับเงิน': 'RN',
      'ใบแจ้งหนี้': 'IN',
      'ใบกำกับภาษี': 'TAX',
      'ใบส่งของ': 'DN'
    };
    const prefix = prefixMap[documentType] || 'DOC';
    setQuotationNumber(`${prefix}-${dateStr}`);

    if (cachedClient) setClientName(cachedClient);
    if (cachedItems) setItems(JSON.parse(cachedItems));
  }, [documentType]);

  const addItem = () => {
    setItems([...items, { name: '', quantity:'', price:'' }]);
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

  const bankList = [
    'ธนาคารกรุงเทพ',
    'ธนาคารกรุงไทย',
    'ธนาคารกรุงศรีอยุธยา',
    'ธนาคารกสิกรไทย',
    'ธนาคารไทยพาณิชย์',
    'ธนาคารทหารไทยธนชาต',
    'ธนาคารออมสิน',
    'ธนาคารยูโอบี',
    'ธนาคารเกียรตินาคินภัทร',
    'ธนาคารซีไอเอ็มบีไทย',
    'ธนาคารแลนด์ แอนด์ เฮ้าส์',
  ];

  const [bankAccounts, setBankAccounts] = useState([
    { bank: '', accountNumber: '' },
  ]);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFont('THSarabun');

    // ✅ แสดงโลโก้บริษัท
    if (company && company.logo) {
      doc.addImage(company.logo, 'PNG', 14, 10, 30, 30);
    }


    // ✅ ข้อมูลบริษัท
    doc.setFont('THSarabun');
    doc.setFontSize(18);
    doc.text(company.name || '', 50, 15);
    doc.setFontSize(14);
    doc.text(company.address || '', 50, 21);
    doc.text(`โทร: ${company.phone || ''} | อีเมล: ${company.email || ''}`, 50, 27);

    //เส้นแนวนอนระหว่างหัวข้อใบเสนอราคากับวันที่
    doc.setDrawColor(0); // สีดำ
    doc.setLineWidth(0.5); // ความหนาเส้น
    doc.line(14, 42, 195, 42); // x1, y1, x2, y2

    // ✅ หัวใบเสนอราคา
    doc.setFont('THSarabun');
    doc.setFontSize(25);
    doc.text(documentType, 14, 50);
    doc.setFontSize(14);
    doc.text(`เลขที่${documentType}: ${quotationNumber}`, 190, 60, { align: 'right' });
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


    // ✅ กำหนดตำแหน่งเริ่มหลังค่าใช้จ่ายรวมทั้งสิ้น
    let nextY = includeVAT ? totalY + 21 : totalY + 10;

    // ✅ หมายเหตุ
    if (notes.length > 0) {
      doc.setFontSize(14);
      doc.text('หมายเหตุ:', 14, nextY);
      notes.forEach((n, idx) => {
        nextY += 7;
        doc.text(`- ${n}`, 20, nextY);
      });
      nextY += 7;
    }

    // ✅ เงื่อนไขการชำระเงิน
    if (paymentTerms.length > 0) {
      doc.setFontSize(14);
      doc.text('เงื่อนไขการชำระเงิน:', 14, nextY);
      paymentTerms.forEach((t, idx) => {
        nextY += 7;
        doc.text(`- ${t}`, 20, nextY);
      });
      nextY += 7;
    }

    // ✅ ช่องทางการชำระเงิน
    if (
      bankAccounts.length > 0 &&
      bankAccounts.some((acc) => acc.bank && acc.accountNumber)
    ) {
      doc.setFontSize(14);
      doc.text('ช่องทางการชำระเงิน (Mobile Banking):', 14, nextY);
      bankAccounts.forEach((acc) => {
        if (acc.bank && acc.accountNumber) {
          const line = `${acc.bank} - เลขบัญชี ${acc.accountNumber}`;
          const lines = doc.splitTextToSize(line, 180);
          lines.forEach((l) => {
            nextY += 7;
            doc.text(`- ${l}`, 20, nextY);
          });
        }
      });
    }

    // ✅ ลายเซ็นท้าย PDF
    const footerY = doc.internal.pageSize.getHeight() - 50; // ระยะจากล่างขึ้นบน

    if (['ใบเสนอราคา', 'ใบเสร็จรับเงิน', 'ใบส่งของ'].includes(documentType)) {
      // ฝั่งลูกค้า
      doc.text(`ลงนาม ${clientName || '..................................'}`, 25, footerY);
      doc.line(20, footerY + 15, 70, footerY + 15);
      doc.text(documentType === 'ใบส่งของ' ? 'ผู้รับของ' : 'ผู้เสนอราคา', 37, footerY + 22);
    }

    if (['ใบเสร็จรับเงิน', 'ใบกำกับภาษี', 'ใบแจ้งหนี้', 'ใบส่งของ'].includes(documentType)) {
      // ฝั่งบริษัท
      doc.text(`ลงนาม ${company.name || '..................................'}`, 125, footerY);
      doc.line(120, footerY + 15, 170, footerY + 15);
      doc.text(documentType === 'ใบส่งของ' ? 'ผู้ส่งของ' : 'ผู้มีอำนาจ', 140, footerY + 22);
    }


    // ✅ ก่อน doc.save(...)
    sessionStorage.setItem('quotationClientName', clientName);
    sessionStorage.setItem('quotationItems', JSON.stringify(items));

    // ✅ เครดิตท้าย PDF
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFontSize(10);
    doc.setTextColor(50); // สีเทา
    doc.text('SIAMGUARD FASTFORM', 14, pageHeight - 5);

    doc.save(`${documentType}_${quotationNumber}.pdf`);

  };

  return (
    <div className="quotation-form">
      <div className="quotation-section">
        <label htmlFor="documentType" className="quotation-label">ประเภทเอกสาร:</label>
        <select
          id="documentType"
          value={documentType}
          onChange={(e) => setDocumentType(e.target.value)}
          className="quotation-select"
        >
          <option value="ใบเสนอราคา">ใบเสนอราคา</option>
          <option value="ใบเสร็จรับเงิน">ใบเสร็จรับเงิน</option>
          <option value="ใบแจ้งหนี้">ใบแจ้งหนี้</option>
          <option value="ใบกำกับภาษี">ใบกำกับภาษี</option>
          <option value="ใบส่งของ">ใบส่งของ</option>
        </select>
      </div>

      <h2 className="quotation-section">🧾 ข้อมูล{documentType}</h2>
      <p className="quotation-label">เลขที่{documentType}: <span className="font-mono">{quotationNumber}</span></p>

      <input
        type="text"
        placeholder="ชื่อลูกค้า"
        value={clientName}
        onChange={(e) => setClientName(e.target.value)}
        className="quotation-input"
      />

      <input
        type="text"
        placeholder="เบอร์โทร"
        value={clientPhone}
        onChange={(e) => setClientPhone(e.target.value)}
        className="quotation-input"
      />

      <div className="quotation-section">
        {items.map((item, index) => (
          <div key={index} className="quotation-item-row">
            <input
              type="text"
              placeholder="ชื่อบริการ"
              value={item.name}
              onChange={(e) => handleItemChange(index, 'name', e.target.value)}
              className="quotation-input"
            />
            <input
              type="number"
              placeholder="จำนวน"
              value={item.quantity}
              onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
              className="quotation-input"
            />
            <input
              type="number"
              placeholder="ราคาต่อหน่วย"
              value={item.price}
              onChange={(e) => handleItemChange(index, 'price', e.target.value)}
              className="quotation-input"
            />
            {index === items.length - 1 && (
              <button onClick={addItem} className="quotation-button blue">
                + เพิ่มรายการ
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="quotation-section">
        <label className="quotation-label">
          <input
            type="checkbox"
            checked={includeVAT}
            onChange={() => setIncludeVAT(!includeVAT)}
            className="quotation-checkbox"
          />
          รวมภาษีมูลค่าเพิ่ม 7%
        </label>
      </div>

      <div className="quotation-section quotation-note">
        <h3>หมายเหตุ</h3>
        {notes.map((note, index) => (
          <div key={index}>
            <input
              type="text"
              value={note}
              onChange={(e) => handleNoteChange(index, e.target.value)}
              placeholder={`หมายเหตุ #${index + 1}`}
              className="quotation-input"
            />
            {notes.length > 1 && (
              <button onClick={() => removeNote(index)} className="quotation-button red">
                ❌
              </button>
            )}
          </div>
        ))}
        <button onClick={addNote} className="quotation-button lightgray">➕ เพิ่มหมายเหตุ</button>
      </div>

      <div className="quotation-section quotation-payment">
        <h3>เงื่อนไขการชำระเงิน</h3>
        {paymentTerms.map((term, index) => (
          <div key={index}>
            <input
              type="text"
              value={term}
              onChange={(e) => handlePaymentTermChange(index, e.target.value)}
              placeholder={`เงื่อนไข #${index + 1}`}
              className="quotation-input"
            />
            {paymentTerms.length > 1 && (
              <button onClick={() => removePaymentTerm(index)} className="quotation-button red">
                ❌
              </button>
            )}
          </div>
        ))}
        <button onClick={addPaymentTerm} className="quotation-button lightgray">➕ เพิ่มเงื่อนไข</button>
      </div>

      <div className="quotation-section">
        <h3>ช่องทางการชำระเงิน (Mobile Banking)</h3>
        {bankAccounts.map((entry, index) => (
          <div key={index}>
            <select
              value={entry.bank}
              onChange={(e) => {
                const updated = [...bankAccounts];
                updated[index].bank = e.target.value;
                setBankAccounts(updated);
              }}
              className="quotation-select"
            >
              <option value="">เลือกธนาคาร</option>
              {bankList.map((bank, idx) => (
                <option key={idx} value={bank}>{bank}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="เลขที่บัญชี"
              value={entry.accountNumber}
              onChange={(e) => {
                const updated = [...bankAccounts];
                updated[index].accountNumber = e.target.value;
                setBankAccounts(updated);
              }}
              className="quotation-input"
            />
            {bankAccounts.length > 1 && (
              <button
                onClick={() => {
                  const updated = bankAccounts.filter((_, i) => i !== index);
                  setBankAccounts(updated);
                }}
                className="quotation-button red"
              >
                ❌
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => setBankAccounts([...bankAccounts, { bank: '', accountNumber: '' }])}
          className="quotation-button purple"
        >
          ➕ เพิ่มช่องทาง
        </button>
      </div>

      <div className="quotation-buttons">
        <button onClick={() => navigate('/company-form')} className="quotation-button gray">
          🔧 แก้ข้อมูลบริษัท
        </button>
        <button onClick={generatePDF} className="quotation-button blue">
          📄 สร้าง PDF
        </button>
        <button onClick={clearCache} className="quotation-button lightgray">
          🗑 ล้างข้อมูล
        </button>
      </div>
    </div>
  );
}