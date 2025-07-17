import { useState } from 'react';
import CompanyInfoForm from './components/CompanyInfoForm';
import QuotationForm from './components/QuotationForm';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EnterKeyPage from './pages/EnterKeyPage';



function App() {
  const [companyInfo, setCompanyInfo] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<EnterKeyPage />} />
        <Route
          path="/company-form"
          element={<CompanyInfoForm onSubmit={setCompanyInfo} />}
        />
        <Route
          path="/quotation-form"
          element={<QuotationForm company={companyInfo} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
