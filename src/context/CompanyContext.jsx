// src/context/CompanyContext.js
import React, { createContext, useState } from 'react';

const CompanyContext = createContext();

const CompanyProvider = ({ children }) => {
  const [companyData, setCompanyData] = useState({
    companyName: '',
    photoURL: '',
    email: '',
  });

  return (
    <CompanyContext.Provider value={{ companyData, setCompanyData }}>
      {children}
    </CompanyContext.Provider>
  );
};

export { CompanyContext, CompanyProvider };
