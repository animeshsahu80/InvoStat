import React, { useState, useContext, useEffect } from "react";
import "./InvoicePDFPreview.css";
import { isValidImageUrl } from "../../utils";
import { AuthContext } from "../../AuthProvider";
import defaultProfileImg from "../../assets/user.jpeg";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
const InvoicePDFPreview = ({ invoiceData }) => {
  const { currentUser } = useContext(AuthContext);
  const [profileImgSrc, setProfileImgSrc] = useState(defaultProfileImg);

  const companyName = currentUser.displayName;

  useEffect(() => {
    async function checkImageUrl() {
      const photoUrl = localStorage.getItem("photoUrl");
      const isValid = await isValidImageUrl(photoUrl);
      if (isValid) {
        setProfileImgSrc(photoUrl);
      }
    }
    checkImageUrl();
  }, []);

  const formatTime = (time) => {
    if (time && time.seconds && time.nanoseconds) {
      const milliseconds = time.seconds * 1000 + time.nanoseconds / 1000000;
      return new Date(milliseconds).toLocaleString();
    } else {
      return "N/A";
    }
  };

  const handlePrint = () => {
    window.print();
    const input =document.getElementById('invoice-pdf');
    html2canvas(input, {useCORS:true}).
    then((canvas)=>{
      const imageData= canvas.toDataURL('image/png',1.0);
      const pdf= new jsPDF({
        orientation:'portrait',

        unit:'pt',
        format:[612,792]
      })
      pdf.internal.scaleFactor=1;
      const imageProps=pdf.getImageProperties(imageData);
      const pdfWidth= pdf.internal.pageSize.getWidth(); 
      const pdfHeight= (imageProps.height*pdfWidth)/imageProps.width;

      pdf.addImage(imageData, 'PNG',0,0,pdfWidth,pdfHeight)
      pdf.save('invoice' + new Date());
    })
  };

  return (
    <>
      <div id="invoice-pdf"  className="invoice-pdf-preview">
        <div className="header">
          <div className="invoice-heading">
            <h2>Invoice</h2>
          </div>
          <div>
            <div className="logo-section">
              <img src={profileImgSrc} alt="Company Logo" className="logo" />
              <div className="c-name">
                <h1 className="company-name">{companyName}</h1>
              </div>
            </div>

            <div className="recipient-details">
              <div className="row">
                <span className="label">To:-</span>
                <span>{invoiceData?.to}</span>
              </div>
              <div className="row">
                <span className="label">Phone:-</span>
                <span>{invoiceData?.phone}</span>
              </div>
              <div className="row">
                <span className="label">Address:-</span>
                <span>{invoiceData?.address}</span>
              </div>
              <div className="row">
                <span className="label">Time:</span>
                <span>{formatTime(invoiceData?.time)}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="invoice-section">
          <table className="product-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData?.productList.map((product, index) => (
                <tr key={index}>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.quantity}</td>
                  <td>{product.price * product.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="total-price">
            <span className="label">Total Price:</span>
            <span>{invoiceData?.totalPrice}</span>
          </div>
        </div>
      </div>
      <div className="print-button-container">
        <button onClick={handlePrint} className="print-button">
          Print Invoice
        </button>
      </div>
    </>
  );
};

export default InvoicePDFPreview;
