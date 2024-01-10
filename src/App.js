import React, { useEffect, useState } from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "bootstrap/dist/css/bootstrap.css";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import CreateProduct from "./components/product/create.js";
import EditProduct from "./components/product/edit.js";
import ListProduct from "./components/product/list.js";
import ViewProduct from "./components/product/view.js";
import CreateUser from "./components/user/create.js";
import Login from "./components/user/login.js";
import { isAuthenticated } from './authService';
import { useNavigate } from 'react-router-dom'
import './style.css'; // Import the external CSS file


function App() {
  const [authenticated, setAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const result = await isAuthenticated();
        console.log(result);
        setAuthenticated(result);
      } catch (error) {
        console.error("Error checking authentication:", error);
        setAuthenticated(false); // Set authenticated to false in case of an error
      }
    };

    checkAuthentication();
  }, [authenticated]);

  if (authenticated === null) {
    // Loading state, you can display a loading spinner or something else
    return null;
  }

  return (
    <>
      <Router>
        <Navbar className=" main-top-navbar " bg="primary">
          <Container className="m-0">
            <Link to={"/"} className="navbar-brand text-white">
              GKMIT LEARN BASIC
            </Link>
          </Container>
        </Navbar>

       
              <Routes>
                
      
                <Route path="/user/create" element={<CreateUser />} />
                <Route path="/login" element={<Login />} />

              
                {authenticated ? (
                  <Route path="/product/create" element={<CreateProduct />} />
                ) : (
                  <Route path="/product/create" element={<Navigate to="/login" replace />} />
                )}

                {authenticated ? (
                  <Route path="/product/edit/:id" element={<EditProduct />} />
                ) : (
                  <Route path="/product/edit/:id" element={<Navigate to="/login" replace />} />
                )}

                {authenticated ? (
                  <Route path="/product/view/:id" element={<ViewProduct />} />
                ) : (
                  <Route path="/product/view/:id" element={<Navigate to="/login" replace />} />
                )}

                {authenticated ? (
                  <Route path="/" element={<ListProduct />} />
                ) : (
                  <Route path="/" element={<Navigate to="/login" replace />} />
                )}
              </Routes>
           
      </Router>
    </>
  );
}

export default App;
