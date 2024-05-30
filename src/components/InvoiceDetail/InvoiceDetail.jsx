import React, { useState,useContext } from 'react'
import  {useLocation} from 'react-router-dom';
import InvoicePDFPreview from './InvoicePDFPreview';
import { AuthContext } from '../../AuthProvider';
function InvoiceDetail() {
  const { currentUser } = useContext(AuthContext); // Access currentUser from AuthContext
  console.log(currentUser)
    const location= useLocation();
    console.log(location);
    const [data,setData]=useState(location.state);
  return (
    <div>
      <div className="invoice-wrapper">
      <InvoicePDFPreview invoiceData={data} />

      </div>
    </div>
  )
}

export default InvoiceDetail