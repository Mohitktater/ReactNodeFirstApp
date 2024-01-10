import React, { useEffect, useState } from "react";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';
import Swal from 'sweetalert2';
import  {CustomSidebar} from '../utilities/sidebar.js'
import Select from 'react-select';

export default function EditUser() {
  const navigate = useNavigate();

  const { id } = useParams()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [validationError,setValidationError] = useState({})
  const [bill_date, setBill_date] = useState("")
  const [hsn_number, setHSN_number] = useState("")
  const [date_of_expiry, setDate_of_expiry] = useState("")
  const [date_of_manufacturing, setDate_of_manufacturing] = useState("")
  const [price, setPrice] = useState("")
  const [selectedOptionDealer, setselectedOptionDealer] = useState(null);
  const [selectedOptionCategory, setselectedOptionCategory] = useState(null);
  

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
  useEffect(()=>{
    fetchProduct()
  },[])

  const fetchProduct = async () => {
    var token = localStorage.getItem('token')
    await axios.get(`http://localhost:8081/api/products/edit/${id}`, {
      headers: {
        Authorization: `${token}`
      }
    }).then(({data})=>{
      console.log(data);
      const { title, description, date_of_manufacturing, date_of_expiry, hsn_number, dealer_id, category_id, bill_date, price } = data.data[0]
      const dateObjectexp = new Date(date_of_expiry);
      const date_of_expiryformattedDate = dateObjectexp.toISOString().split('T')[0];
      const dateObjectmen = new Date(date_of_manufacturing);
      const date_of_manufacturiongformattedDate = dateObjectmen.toISOString().split('T')[0];  
      const dateObjectbill_date = new Date(bill_date);
      const bill_formattedDate = dateObjectbill_date.toISOString().split('T')[0];   

      setTitle(title)
      setDate_of_manufacturing(date_of_manufacturiongformattedDate)
      setDate_of_expiry(date_of_expiryformattedDate)
      setHSN_number(hsn_number)

      const Dealerobj = optionsofdealer.find((obj) =>obj.value == dealer_id);
     
      if(Dealerobj) {
        setselectedOptionDealer(Dealerobj)
      }
      const Categoryobj = option_category.find((obj) =>obj.value == category_id);
     console.log(Categoryobj);
     console.log(category_id);
      if(Categoryobj) {
        setselectedOptionCategory(Categoryobj)
      }
 
 
      setBill_date(bill_formattedDate)
      setPrice(price)
      setDescription(description)
    }).catch(({response:{data}})=>{
      Swal.fire({
        text:data.message,
        icon:"error"
      })
    })
  }

 

  const updateProduct = async (e) => {
    e.preventDefault();

    const formData = new FormData()
    formData.append('_method', 'post');
    formData.append('title', title)
    formData.append('description', description)
    formData.append('bill_date', bill_date)
    formData.append('category_ID', selectedOptionCategory)
    formData.append('dealer_id', selectedOptionDealer)
    formData.append('hsn_number', hsn_number)
    formData.append('date_of_expiry', date_of_expiry)
    formData.append('date_of_manufacturing', date_of_manufacturing)
    formData.append('price', price)
    formData.append('id', id)
     
    const formDataObject = {};
    formData.forEach((value, key) => {
      formDataObject[key] = value;
    });
    var token = localStorage.getItem('token')
    await axios.post(`http://localhost:8081/api/products/update/`, formDataObject, {
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
      }else{
        Swal.fire({
          text:response.data.message,
          icon:"error"
        })
      }
    })
  }

  return (
    <>
        <div className="sidebar__">
        <CustomSidebar/>
      </div>
      <div className="content">
    <div className="container">
      <div className="row justify-content-left">
        <div className="col-12 col-sm-12 ">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Update Product</h4>
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
                <Form onSubmit={updateProduct}>
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
                                  value={selectedOptionDealer}
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
                                  value={selectedOptionCategory}
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
                    Update
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