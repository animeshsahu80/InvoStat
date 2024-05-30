import React, { useState, useContext } from "react";
import "./Login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Loader from "../loader/Loader";
import { CompanyContext } from "../../context/CompanyContext";

function Login() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setCompanyData } = useContext(CompanyContext);

  const navigate = useNavigate();
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handlePasswordChange = (e) => {
    if (emailError) {
      setEmailError("");
    }
    setPassword(e.target.value);
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
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          setLoading(false);
          console.log(userCredential);
          
          localStorage.setItem('cName', userCredential.user.displayName);
          localStorage.setItem('photoUrl', userCredential.user.photoURL)
          navigate("/dashboard");
        })
        .catch((error) => {
          setLoading(false);
          const errorCode = error.code;
          const errorMessage = error.message;
          setEmailError(`${errorMessage}`);

          console.error(`Error [${errorCode}]: ${errorMessage}`);
        });
    } else {
      setEmailError("Please enter a valid email address.");
    }
  };
  return (
    <>
      <div className="container">
        <div className="background-blur"></div>
        <div className="login-wrapper">
          <h1>Login</h1>
          <form onSubmit={handleSubmit} className="login-form">
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
                onChange={handlePasswordChange}
                required
              />
              <FontAwesomeIcon
                icon={passwordVisible ? faEyeSlash : faEye}
                onClick={togglePasswordVisibility}
                className="password-icon"
              />
            </div>
            {emailError && <p className="error-message">{emailError}</p>}

            <input
              className="login-submit"
              type="submit"
              value="Login"
              disabled={emailError !== "" || email === "" || password === ""}
            />
          </form>
          {loading && <Loader />}

          <div className="register-link"></div>
          <Link to="/register">Create an account</Link>
        </div>
      </div>
    </>
  );
}

export default Login;
