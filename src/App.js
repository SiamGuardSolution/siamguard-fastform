// src/App.jsที่ใช้อยู่ตอนนี้
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EnterKeyPage from './pages/EnterKeyPage';
import CompanyInfoForm from './components/CompanyInfoForm';
import QuotationForm from './components/QuotationForm';



function App() {
  const [companyInfo, setCompanyInfo] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<EnterKeyPage />} />
        <Route 
          path="/company-form" 
          element={
            <CompanyInfoForm 
              onSubmit={(data) => {
                console.log('📦 ได้ข้อมูลบริษัท:', data);
                setCompanyInfo(data);
              }}
            />
          } 
        />
        <Route 
          path="/quotation-form"
          element={<QuotationForm company={companyInfo} />} 
        />
        <Route 
          path="*"
          element={<h1>404 - Not Found</h1>} // ✅ fallback
        />
      </Routes>
    </Router>
  );
}

export default App;
