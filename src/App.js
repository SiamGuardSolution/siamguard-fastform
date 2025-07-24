// src/App.jsที่ใช้อยู่ตอนนี้
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EnterKeyPage from './pages/EnterKeyPage';
import CompanyInfoForm from './components/CompanyInfoForm';
import QuotationForm from './components/QuotationForm';
import './App.css';

function App() {
  const [companyInfo, setCompanyInfo] = useState(null);

  return (
    <div className="app-background"
      style={{
        backgroundImage: "url('/assets/SG-Background.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        width: '100vw',
      }}>

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
            element={<h1>404 - Not Found</h1>} 
          />
        </Routes>       
      </Router>
    </div>
  );
}


export default App;
