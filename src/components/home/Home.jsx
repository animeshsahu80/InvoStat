import React, { useEffect, useRef, useState,useContext } from 'react';
import './Home.css';
import { Chart } from 'chart.js/auto';
import { db } from "../../firebase";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { AuthContext } from "../../AuthProvider"; // Adjust the path as needed
import { useNavigate } from "react-router-dom";

function Home() {
  const chartContainer = useRef(null);
  const chartInstance = useRef(null);
  const [invoices, setInvoices] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const getOverallTotal=(invoices)=>{
    let total=0;
    invoices.forEach(data=>{
      total+= data?.totalPrice;
    })
    setoverallTotal(total);
  }
  const getMonthTotal=(invoices)=>{
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    let monthTotal = 0;

    invoices.forEach(data => {
      const invoiceDate = new Date(data.time.seconds * 1000);
      if (invoiceDate.getMonth() === currentMonth && invoiceDate.getFullYear() === currentYear) {
        monthTotal += data.totalPrice;
      }
    });
    
    setTotalMonthCol(monthTotal);
  }
  const getMonthlyCollections = (invoices) => {
    const monthlyCollections = Array(12).fill(0);
    
    invoices.forEach(data => {
      const invoiceDate = new Date(data.time.seconds * 1000);
      const month = invoiceDate.getMonth();
      monthlyCollections[month] += data.totalPrice;
    });
    
    return monthlyCollections;
  };

  const getTotalNumberOfInvocies=(invoices)=>{
      setTotalInvoices(invoices.length);
  }
  const createChart = (monthlyCollections) => {
    if (chartInstance.current) {
      chartInstance.current.destroy(); // Destroy the existing chart instance if it exists
    }
    if (chartContainer.current) {
      chartInstance.current = new Chart(chartContainer.current, {
        type: 'bar',
        data: {
          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
          datasets: [{
            label: 'Monthly Collection (₹)',
            data: monthlyCollections,
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  };
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
      getOverallTotal(invoices)
      getMonthTotal(invoices);
      getTotalNumberOfInvocies(invoices)
      console.log("Fetched invoices: ", invoices);
      return invoices;
    } catch (error) {
      console.error("Error fetching invoices: ", error);
    }
  };

  useEffect(() => {
   
    // createChart();
    const fetchUserInvoices = async () => {
      const userInvoices = await fetchInvoices();
      setInvoices(userInvoices);
      const monthlyCollections = getMonthlyCollections(userInvoices);
      console.log(monthlyCollections)
      createChart(monthlyCollections);
    };
    
    fetchUserInvoices();
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy(); // Cleanup the chart on component unmount
      }
    };
  }, [currentUser]);
  const [overallTotal, setoverallTotal]= useState(0);
  const [totalInvoices, setTotalInvoices] = useState(12);
  const [totalMonthCol, setTotalMonthCol] = useState(10);

  return (
    <div>
      <div className="home-first-row">
        <div className="home-box box1">
          <h2> {overallTotal} &#x20B9;</h2>
          <p>Overall</p>
        </div>
        <div className="home-box box2">
          <h2>{totalInvoices}</h2>
          <p>Invoices</p>
        </div>
        <div className="home-box box3">
          <h2>{totalMonthCol} &#x20B9;</h2>
          <p>This month</p>
        </div>
      </div>
      <div className="home-second-row">
        <div className="chart-box">
          <canvas ref={chartContainer}></canvas>
        </div>
        <div className="recent-invoice">
          <div className='recent-invoice-header'>
            <h1>Recent invoices</h1>
          </div>
          {invoices.map((invoice) => (
            <div className='recent-invoice-item' key={invoice.id}>
              <p>{invoice.to}</p>
              <p>{new Date(invoice.time.seconds * 1000).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
