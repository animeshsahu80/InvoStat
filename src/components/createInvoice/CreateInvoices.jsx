import React, { useState,useContext } from "react";
import "./CreateInvoices.css";
import { db, auth } from "../../firebase";
import { doc, Timestamp, addDoc, collection } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from '../loader/Loader';  // Import the Loader component
import { AuthContext } from "../../AuthProvider";
function CreateInvoices() {
  const [to, setTo] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [product, setProduct] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const totalPrice = productList.reduce(
    (accumulator, currentValue) =>
      accumulator + currentValue.price * currentValue.quantity,
    0
  );

  const { currentUser } = useContext(AuthContext); // Access currentUser from AuthContext

  const saveData = async () => {
    setLoading(true);
    if (!currentUser) {
      console.error("No user is logged in.");
      setLoading(false);
      toast.error("Error: No user is logged in.");
      return;
    }

    const invoicesCollectionRef = collection(
      doc(db, "users", currentUser.uid), // Use currentUser.uid instead of auth.currentUser.uid
      "invoices"
    );
    const invoiceData = {
      to: to,
      phone: phone,
      address: address,
      productList: productList,
      totalPrice: totalPrice,
      time: Timestamp.fromDate(new Date())
    };

    try {
      await addDoc(invoicesCollectionRef, invoiceData);
      setLoading(false);
      toast.success("Invoice created successfully!");
      setProductList([]);
      setProduct(""); 
      setPrice(""); 
      setQuantity(0); 
      navigate("/dashboard/invoices");
    } catch (error) {
      console.error("Error adding invoice: ", error);
      setLoading(false);
      toast.error("Error creating invoice. Please try again.");
    }
  };

  const addProduct = () => {
    const newProduct = {
      id: productList.length,
      name: product,
      price: parseFloat(price),
      quantity: parseInt(quantity, 10),
    };

    setProductList([...productList, newProduct]);
    setProduct("");
    setPrice("");
    setQuantity(0);
  };

  const deleteProduct = (id) => {
    setProductList(productList.filter((product) => product.id !== id));
  };

  return (
    <div className="invoice-container">
      {loading && <Loader />}  {/* Show loader if loading */}
      <p className="new-invoice-heading">Create New Invoice</p>
      <form action="" className="new-invoice-form">
        <div className="form-row first-row">
          <div className="form-group">
            <label htmlFor="to">To</label>
            <input
              type="text"
              id="to"
              className="form-input"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              type="text"
              id="phone"
              className="form-input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              className="form-input"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        </div>
        <div className="form-row second-row">
          <div className="form-group">
            <label htmlFor="product">Product Name</label>
            <input
              type="text"
              id="product"
              className="form-input"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="price">Price</label>
            <input
              type="text"
              id="price"
              className="form-input"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="quantity">Quantity</label>
            <input
              type="number"
              id="quantity"
              className="form-input"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
        </div>
        <button type="button" className="form-button" onClick={addProduct}>
          Add Product
        </button>
      </form>
      <div className="product-list">
        <div className="product-item">
          <p>S. No.</p>
          <p>Product Name</p>
          <p>Price (Rs.)</p>
          <p>Quantity</p>
          <p>Total Price</p>
          <p style={{ color: "white" }}>Remove</p>
        </div>
        {productList.map((item, index) => (
          <div key={item.id} className="product-item">
            <p>{index + 1}</p>
            <p>{item.name}</p>
            <p>{item.price} Rs</p>
            <p>{item.quantity}</p>
            <p>{item.quantity * item.price}</p>
            <button
              className="delete-button"
              onClick={() => deleteProduct(item.id)}
            >
              Delete
            </button>
          </div>
        ))}
        <div className="product-item final-row">
          <p style={{ color: "white" }}>Total</p>
          <p style={{ color: "#0057e7" }}>Product Name</p>
          <p style={{ color: "white" }}>
            {productList.reduce(
              (accumulator, currentValue) => accumulator + currentValue.price,
              0
            )}
          </p>
          <p style={{ color: "white" }}>
            {productList.reduce(
              (accumulator, currentValue) => accumulator + currentValue.quantity,
              0
            )}
          </p>
          <p style={{ color: "white" }}>
            {productList.reduce(
              (accumulator, currentValue) =>
                accumulator + currentValue.price * currentValue.quantity,
              0
            )}
          </p>
          <p style={{ color: "#0057e7" }}>Remove</p>
        </div>
      </div>
      <div className="create-container">
        <button onClick={saveData} className="create" disabled={loading}>
          {loading ? "Creating..." : "Create an Invoice"}
        </button>
      </div>
      <ToastContainer />
    </div>
  );
}

export default CreateInvoices;
