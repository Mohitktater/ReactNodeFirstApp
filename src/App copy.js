// App.js

import * as React from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "bootstrap/dist/css/bootstrap.css";

import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";

import CreateProduct from "./components/product/create.js";
import EditProduct from "./components/product/edit.js";
import ListProduct from "./components/product/list.js";
import CreateUser from "./components/user/create.js";
import Login from "./components/user/login.js";

import { isAuthenticated } from './authService';

function App() {
 console.log(isAuthenticated());
  return (
    <Router>
      <Navbar bg="primary">
        <Container>
          <Link to={"/"} className="navbar-brand text-white">
            GKMIT LEARN BASIC
          </Link>
        </Container>
      </Navbar>

      <Container className="mt-5">
        <Row>
          <Col md={12}>
            <Routes>
              <Route path="/product/create" element={<CreateProduct />} />
              <Route path="/" element={<ListProduct />} />
              <Route path="/product/edit/:id" element={<EditProduct />} />
              <Route path="/user/create" element={<CreateUser />} />
              <Route path="/login" element={<Login />} />

              {isAuthenticated() ? (
                <Route path="/" element={<ListProduct />} />
              ) : (
                <Route
                  path="/"
                  element={<Navigate to="/login" replace />}
                />
              )}

            </Routes>
          </Col>
        </Row>
      </Container>
    </Router>
  );
}

export default App;
