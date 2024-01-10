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
        setselectedOptionDealer(Dealerobj['label'])
      }
      console.log(selectedOptionDealer);
      const Categoryobj = option_category.find((obj) =>obj.value == category_id);
     console.log(Categoryobj);
     console.log(category_id);
      if(Categoryobj) {
        setselectedOptionCategory(Categoryobj['label'])
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
              <h4 className="card-title">Details Product</h4>
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
                <div className="card" >
                  <ul className="list-group list-group-flush productview">
                    <li className="list-group-item"><strong>Title</strong></li>
                    <li className="list-group-item">{title}</li>

                    <li className="list-group-item"><strong>Price</strong></li>
                    <li className="list-group-item">{price}</li>

                    <li className="list-group-item"><strong>Date of Manufacturing</strong></li>
                    <li className="list-group-item">{date_of_manufacturing}</li>

                    <li className="list-group-item"><strong>Date of Expiry</strong></li>
                    <li className="list-group-item">{date_of_expiry}</li>

                    <li className="list-group-item"><strong>HSN Number</strong></li>
                    <li className="list-group-item">{hsn_number}</li>

                    <li className="list-group-item"><strong>Dealer Name</strong></li>
                    <li className="list-group-item">{selectedOptionDealer}</li>

                    <li className="list-group-item"><strong>Category Name</strong></li>
                    <li className="list-group-item">{selectedOptionCategory}</li>

                    <li className="list-group-item"><strong>Bill Date</strong></li>
                    <li className="list-group-item">{bill_date}</li>

                    <li className="list-group-item"><strong>Description</strong></li>
                    <li className="list-group-item">{description}</li>
                    
                  </ul>
                </div>
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