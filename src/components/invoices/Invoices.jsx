import React, { useEffect, useState, useContext } from "react";
import { db } from "../../firebase";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { AuthContext } from "../../AuthProvider"; // Adjust the path as needed
import './Invoices.css';
import { useNavigate } from "react-router-dom";
import Loader from '../loader/Loader'; // Adjust the path as needed

function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchInvoices = async () => {
    if (!currentUser) {
      console.error("No user is logged in.");
      return;
    }

    const invoicesCollectionRef = collection(
      doc(db, "users", currentUser.uid),
      "invoices"
    );

    try {
      const querySnapshot = await getDocs(invoicesCollectionRef);
      const invoices = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("Fetched invoices: ", invoices);
      return invoices;
    } catch (error) {
      console.error("Error fetching invoices: ", error);
    }
  };

  const deleteInvoice = async (invoiceId) => {
    if (!currentUser) {
      console.error("No user is logged in.");
      return;
    }

    const invoiceDocRef = doc(db, "users", currentUser.uid, "invoices", invoiceId);

    try {
      await deleteDoc(invoiceDocRef);
      setInvoices(invoices.filter(invoice => invoice.id !== invoiceId));
      console.log("Invoice deleted successfully.");
    } catch (error) {
      console.error("Error deleting invoice: ", error);
    }
  };

  useEffect(() => {
    const fetchUserInvoices = async () => {
      setLoading(true);
      const userInvoices = await fetchInvoices();
      setInvoices(userInvoices);
      setLoading(false);
    };

    fetchUserInvoices();
  }, [currentUser]);

  if (!currentUser) {
    return <p>Please log in to view your invoices.</p>;
  }

  return (
    <div className="invoices-container">
      <h2>Your Invoices</h2>
      {loading ? (
        <Loader />
      ) : (
        <table className="invoices-table">
          <thead>
            <tr>
              <th>To</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Total Price</th>
              <th>Time</th>
              <th>Actions</th>
              <th>View Invoice</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map(invoice => (
              <tr key={invoice.id}>
                <td>{invoice.to}</td>
                <td>{invoice.phone}</td>
                <td>{invoice.address}</td>
                <td>{invoice.totalPrice}</td>
                <td>{new Date(invoice.time.seconds * 1000).toLocaleString()}</td>
                <td>
                  <button 
                    className="delete-button" 
                    onClick={() => deleteInvoice(invoice.id)}>
                    Delete
                  </button>
                </td>
                <td>
                  <button onClick={() => {navigate('/dashboard/invoice_detail', { state: invoice })}} className="view-button">
                    View Invoice
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Invoices;
