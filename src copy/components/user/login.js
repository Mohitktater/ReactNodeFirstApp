import React, { useState } from "react";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios'
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom'

export default function CreateUser() {
  const navigate = useNavigate();

  const [email, setemail] = useState("")
  const [password, setpassword] = useState("")
 
  
  const [validationError,setValidationError] = useState({})
 

  const handlesubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData()

    formData.append('email', email)
    formData.append('password', password)
     
    const formDataObject = {};
    formData.forEach((value, key) => {
      formDataObject[key] = value;
    });

// Now formDataObject is a JSON representation of your form data

    await axios.post(`http://localhost:8081/api/users/login`, formDataObject).then(({data})=>{
      Swal.fire({
        icon:"success",
        text:data.message
      })
      localStorage.setItem('token', data.token_details);

      navigate("/")
    }).catch(({response})=>{
      if(response.status===422){
        setValidationError(response.data.errors)
      }else{
        Swal.fire({
          text:response.data.message,
          icon:"error"
        })
      }
    })


  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-12 col-md-6">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Login</h4>
              <hr />
              <div className="form-wrapper">
                {
                  Object.keys(validationError).length > 0 && (
                    <div className="row">
                      <div className="col-12">
                        <div className="alert alert-danger">
                          <ul className="mb-0">
                            {
                              Object.entries(validationError).map(([key, value])=>(
                                <li key={key}>{value}</li>   
                              ))
                            }
                          </ul>
                        </div>
                      </div>
                    </div>
                  )
                }
                <Form onSubmit={handlesubmit}>
               
              
                  <Row className="my-3"> 
                      <Col>
                        <Form.Group controlId="Name">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="text" value={email} onChange={(event)=>{
                              setemail(event.target.value)
                            }}/>
                        </Form.Group>
                      </Col>  
                  </Row>
                  <Row className="my-3">
                      <Col>
                        <Form.Group controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" value={password} onChange={(event)=>{
                              setpassword(event.target.value)
                            }}/>
                        </Form.Group>
                      </Col>
                  </Row>
                  <div class="col-12">
                  <Button variant="primary" className="mt-2" size="lg" block="block" type="submit">
                    Save
                  </Button>
                  <a className=" float-end" href="/user/create">Registration</a>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
