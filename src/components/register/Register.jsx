import React, { useRef, useState, useContext } from "react";
import "./Register.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth, db } from "../../firebase";
import { storage } from "../../firebase";
import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import Loader from "../loader/Loader";
import { CompanyContext } from "../../context/CompanyContext";

export default function Register() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const { setCompanyData } = useContext(CompanyContext);

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  const handleEmailChange = (e) => {
    if (emailError) {
      setEmailError("");
    }
    setEmail(e.target.value);
    if (!e.target.validity.valid) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!emailError && email) {
      setLoading(true);
      console.log("Form submitted");
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCred) => {
          const date = new Date().getTime();
          console.log(file);
          const storageRef = ref(storage, `${companyName + date}`);
          console.log(userCred);
          uploadBytesResumable(storageRef, file).then((snap) => {
            getDownloadURL(storageRef).then((url) => {
              console.log(url);
              updateProfile(userCred.user, {
                displayName: companyName,
                photoURL: url,
              });
              setDoc(doc(db, "users", userCred.user.uid), {
                uid: userCred.user.uid,
                displayName: companyName,
                email: email,
                photoURL: url,
              });
              localStorage.setItem('cName',companyName);
              localStorage.setItem('photoUrl',url )
              navigate("/dashboard");
              setLoading(false);
            });
          });
        })
        .catch((error) => {
          setEmailError(`${error}`);
          setLoading(false);
        });
    } else {
      setLoading(false);

      setEmailError("Please enter a valid email address.");
    }
  };
  return (
    <>
      <div className="container">
        <div className="background-blur"></div>
        <div className="login-wrapper">
          <h1>Register</h1>
          <form onSubmit={handleSubmit} className="login-form">
            <input
              className="login-input"
              type="text"
              placeholder="Company name"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
            <input
              className="login-input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={handleEmailChange}
              required
            />

            <div className="password-wrapper">
              <input
                className="login-input"
                type={passwordVisible ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <FontAwesomeIcon
                icon={passwordVisible ? faEyeSlash : faEye}
                onClick={togglePasswordVisibility}
                className="password-icon"
              />
            </div>
            <input
              style={{ display: "none" }}
              className="login-input"
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              ref={fileInputRef}
            />
            <input
              className="login-input"
              type="button"
              onClick={() => fileInputRef.current.click()}
              value={"select your logo"}
            />
            {emailError && <p className="error-message">{emailError}</p>}

            <input
              className="login-submit"
              type="submit"
              value="Create account"
              disabled={
                emailError !== "" ||
                email === "" ||
                password === "" ||
                companyName === ""
              }
            />
          </form>
          {loading && <Loader />}

          <div className="register-link"></div>
          <Link to="/login">Login with your account</Link>
        </div>
      </div>
    </>
  );
}
