import React, { useState, useEffect } from "react";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios'
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom'
import { isAuthenticated } from '../../authService';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import  {CustomSidebar} from '../utilities/sidebar.js'
import Select from 'react-select';


export default function CreateProduct() {

  const navigate = useNavigate();
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [bill_date, setBill_date] = useState("")
  const [category, setCategory] = useState("")
 
  const [hsn_number, setHSN_number] = useState("")
  const [date_of_expiry, setDate_of_expiry] = useState("")
  const [date_of_manufacturing, setDate_of_manufacturing] = useState("")
  const [price, setPrice] = useState("")
  const [selectedOptionDealer, setselectedOptionDealer] = useState(null);
  const [selectedOptionCategory, setselectedOptionCategory] = useState(null);
  const [validationError,setValidationError] = useState({})


  const optionsofdealer = [
    { value: '1', label: 'Dealer 1' },
    { value: '2', label: 'Dealer 2' },
    { value: '3', label: 'Dealer 3' }
  ];
  const option_category = [
    { value: '1', label: 'category 1' },
    { value: '2', label: 'category 2' },
    { value: '3', label: 'category 3' }
  ];

  const handleSelectChangeDealer = (e) => {
    setselectedOptionDealer(e.value);
  };
  const handleSelectChangeCategory = (e) => {
    setselectedOptionCategory(e.value);
  }
  
  const handlesubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('bill_date', bill_date)
    formData.append('category_ID', selectedOptionCategory)
    formData.append('dealer_id', selectedOptionDealer)
    formData.append('hsn_number', hsn_number)
    formData.append('date_of_expiry', date_of_expiry)
    formData.append('date_of_manufacturing', date_of_manufacturing)
    formData.append('price', price)

    const formDataObject = {};
      formData.forEach((value, key) => {
        formDataObject[key] = value;
      });

  
  var token = localStorage.getItem('token')

    await axios.post(`http://localhost:8081/api/products/create`, formDataObject, {
    headers: {
      Authorization: `${token}`
    }
  }).then(({data})=>{
      Swal.fire({
        icon:"success",
        text:data.message
      })
      navigate("/")
    }).catch(({response})=>{
      if(response.status===422){
        setValidationError(response.data.errors)
      }else if(response.status===403){
        navigate("/login")
      }else{
        Swal.fire({
          text:response.data.message,
          icon:"error"
        })
      }
    })
  }

  return (<>
  <div className="sidebar__">
    <CustomSidebar/>
  </div>
  <div className="content">
    <div className="container">
      <div className="row justify-content-left">
        <div className="col-12 col-sm-12">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Create Product</h4>
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
                      <Col className="col-md-3" >
                        <Form.Group controlId="Name">
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" value={title} onChange={(event)=>{
                              setTitle(event.target.value)
                            }}/>
                        </Form.Group>
                      </Col>  
                      <Col className="col-md-3">
                        <Form.Group controlId="Name">
                            <Form.Label>Price</Form.Label>
                            <Form.Control type="number" value={price} onChange={(event)=>{
                              setPrice(event.target.value)
                            }}/>
                        </Form.Group>
                      </Col>  
                      <Col className="col-md-3">
                        <Form.Group controlId="Name">
                            <Form.Label>Date of Manufacturning</Form.Label>
                            <Form.Control type="date" value={date_of_manufacturing} onChange={(event)=>{
                              setDate_of_manufacturing(event.target.value)
                            }}/>
                        </Form.Group>
                      </Col>  
                      <Col className="col-md-3">
                        <Form.Group controlId="Name">
                            <Form.Label>Date of Expiry</Form.Label>
                            <Form.Control type="date" value={date_of_expiry} onChange={(event)=>{
                              setDate_of_expiry(event.target.value)
                            }}/>
                        </Form.Group>
                      </Col> 

                  </Row>
                  <Row className="my-3"> 
                      <Col className="col-md-3" >
                        <Form.Group controlId="Name">
                            <Form.Label>HSN Number</Form.Label>
                            <Form.Control type="text" value={hsn_number} onChange={(event)=>{
                              setHSN_number(event.target.value)
                            }}/>
                        </Form.Group>
                      </Col>  
                      <Col className="col-md-3">
                        <Form.Group controlId="Name">
                            <label style={{marginBottom:'0.5rem'}} htmlFor="selectBox">Dealer Name</label>
                                <Select
                                  id="selectBoxdealer"
                                  defaultValue={selectedOptionDealer}
                                  onChange = {(e) => handleSelectChangeDealer(e)}
                                  options={optionsofdealer}
                                />
                        </Form.Group>
                      </Col>  
                      <Col className="col-md-3">
                        <Form.Group controlId="Name">
                        <label style={{marginBottom:'0.5rem'}} htmlFor="selectBox">Category Name</label>
                                <Select
                                  id="selectBoxcategory"
                                  defaultValue={selectedOptionCategory}
                                  onChange = {(e) => handleSelectChangeCategory(e)}
                                  options={option_category}
                                />
                        </Form.Group>
                      </Col>  
                      <Col className="col-md-3">
                        <Form.Group controlId="Name">
                            <Form.Label>Bill Date</Form.Label>
                            <Form.Control type="date" value={bill_date} onChange={(event)=>{
                              setBill_date(event.target.value)
                            }}/>
                        </Form.Group>
                      </Col> 

                  </Row>
                 
                  <Row className="my-3">
                      <Col>
                        <Form.Group controlId="Description">
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" rows={3} value={description} onChange={(event)=>{
                              setDescription(event.target.value)
                            }}/>
                        </Form.Group>
                      </Col>
                  </Row>
 
                  <Button variant="primary" className="mt-2" size="lg" block="block" type="submit">
                    Save
                  </Button>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
    </>
  )
}
