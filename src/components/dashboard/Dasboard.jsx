import React, { useState, useEffect } from "react";
import defaultProfileImg from "../../assets/user.jpeg";
import "./Dashboard.css";
import { isValidImageUrl } from "../../utils";
import { CompanyContext } from "../../context/CompanyContext";
import {Link,Outlet, useNavigate} from 'react-router-dom';
import { getAuth, signOut } from "firebase/auth"; // Import Firebase auth and signOut
import { auth } from "../../firebase";
function Dashboard() {
  const [profileImgSrc, setProfileImgSrc] = useState(defaultProfileImg);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate= useNavigate();
  useEffect(() => {
    async function checkImageUrl() {
      const photoUrl = localStorage.getItem('photoUrl');
      const isValid = await isValidImageUrl(photoUrl);
      if (isValid) {
        setProfileImgSrc(photoUrl);
      }
    }

    checkImageUrl();
  }, []);
  const handleLogout = async () => {
    try {
      await signOut(auth).then(()=>{
        localStorage.clear()
        navigate('/login');
      }); 
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="dashboard-wrapper">
      <div className={`side-nav ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="profile-section">
            <div className="image-container">
            <img src={profileImgSrc} alt="Profile" className="profile-img" />

            </div>
          <h2 className="profile-name">{localStorage.getItem('cName') || "Company Name"}</h2>
        </div>
        <nav className="nav-links">
          <Link to='home' className="nav-link">
          <i className="icon fa-solid fa-house"></i>
                    <span className={`nav-link-text ${isCollapsed ? 'collapsed' : ''}`}>Home</span>
          </Link>
          <Link to="invoices" className="nav-link">
          <i className="fa-solid fa-note-sticky icon"></i>
                      <span className="nav-link-text">View Invoices</span>
          </Link>
          <Link to="create_invoices" className="nav-link">
          <i className="icon fa-solid fa-circle-plus"></i>
                      <span className="nav-link-text">Create an Invoice</span>
          </Link>
          <Link to="settings" className="nav-link">
            <i className="icon fa fa-cog"></i>

            <span className="nav-link-text">Settings</span>
          </Link>
        </nav>
        <button onClick={handleLogout} className={`logout-btn ${isCollapsed ? 'collapsed' : ''}`}>Logout</button>
        <button className="toggle-btn" onClick={toggleSidebar}>
          <span className="arrow">{isCollapsed ? '→' : '←'}</span>
        </button>
      </div>
      <div className="main-container">
        <h1>Welcome {localStorage.getItem('cName')}!</h1>
        <Outlet/>
      </div>
    </div>
  );
}

export default Dashboard;
