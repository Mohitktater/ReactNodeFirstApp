import React, { useState, useEffect, useMemo } from "react";
import RotateLoader from "react-spinners/RotateLoader";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios'
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom'
import { faUser} from '@fortawesome/fontawesome-free-solid';
import DataTable from 'react-data-table-component';
import ReactPaginate from 'react-paginate';
import  {CustomSidebar} from '../utilities/sidebar.js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileAlt, faEdit} from '@fortawesome/fontawesome-free-regular'
import { faTrash} from '@fortawesome/fontawesome-free-solid'



export default function UserList() {
    const navigate = useNavigate();
    const [validationError, setvalidationError] = useState("");
    const [data, setdata] = useState("");
    const [currentPage, setcurrentPage] = useState(0);
    const [pageSize, setpageSize] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [TotalPage, setTotalPage] = useState(0);
    const [serial_number, setserial_number] = useState(0);
    const [products, setProducts] = useState([])
   

    //for loader add
    let [loading, setLoading] = useState(true);
    let [color, setColor] = useState("#36d7b7");
    let [loaderdisplay, setloaderdisplay] = useState("block");
    //for loader add
   
    //for pagination starts here
   // const items = [];
   
    const [items, setitems] = useState([]);
    const [itemOffset, setItemOffset] = useState(0);
    const endOffset = itemOffset + pageSize;
    console.log(`Loading items from ${itemOffset} to ${endOffset}`);
    const currentItems = items.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(items.length / pageSize);
    
   
    const pushtoitems = (total_counts) => {
            const item_arr = []
        for ( var i = 1; i <= total_counts; i++) {
            item_arr.push(i);
        }
        setitems(item_arr)
       
    }
    const handleEdit = (e, id) => {
        console.log(e);
        e.defaultPrevented = true;
        navigate("/product/edit/"+ id);
    }

    const handleView = (e, id) => {
        console.log(e);
        e.defaultPrevented = true;
        navigate("/product/view/"+ id);
    }
    
   
    const handleDeleteUser = async(id) => { 
        const isConfirm = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
          }).then((result) => {
            return result.isConfirmed
          });

          if(!isConfirm){
            return;
          }
          const formData = new FormData()
    
          formData.append('id', id)
          const formDataObject = {};
          formData.forEach((value, key) => {
            formDataObject[key] = value;
          });

    var token = localStorage.getItem('token')
          await axios.post(`http://localhost:8081/api/products/delete/`,formDataObject,{
             headers: {
            Authorization: `${token}`
          }
        }).then(({data})=>{
            Swal.fire({
                icon:"success",
                text:data.message
            })
            fetchProducts(1)
          }).catch(({response:{data}})=>{
            Swal.fire({
                text:data.message,
                icon:"error"
            })
          })
       
    }
 
   
 
   
   
const columns = [
 {
        name: '#',
        selector: (_, index) => index+(currentPage*10)+1,
        width:'50px'
    },
     {
        name: 'Title',
        cell: row => { return ( row.title )},
       
    },
    {
        name: 'Price',
        cell: row => { return ( row.price )},
        width:'150px'
    },
   
    {
        name: 'Date of Manufacturning',
        selector: row => {
          // Format the date string to 'YYYY-MM-DD'
          if (!row.date_of_manufacturing || row.date_of_manufacturing.trim() === '') {
            return '-';
          }
    
          const formattedDate = new Date(row.date_of_manufacturing).toISOString().split('T')[0];
          return formattedDate;
        },
      },
    
      {
        name: 'Date of Expiry',
        selector: row => {
            if (!row.date_of_expiry || row.date_of_expiry.trim() === '') {
                return '-';
              }
        
          // Format the date string to 'YYYY-MM-DD'
          const formattedDate = new Date(row.date_of_expiry).toISOString().split('T')[0];
          return formattedDate;
        },
      },
    
     {
        name: 'Action',
        selector: row => row.email,
         cell: row => {  return (
        <div>
            <div className="btn-group btn-group-sm" style={{minWidth:"170px"}} role="group" aria-label="Basic example">
                <button type="button" style={{backgroundColor:"#FA778E",border:"0px", color: '#fff'}} className="btn btn-warning"  onClick={(e)=>handleEdit(e,row.id)} > <FontAwesomeIcon icon={faEdit} />
              
              
                </button>

                <button type="button" style={{backgroundColor:"#30B1FF", border:"0px"}}   className="btn btn-primary"  onClick={(e)=>handleView(e,row.id)} ><FontAwesomeIcon icon={faFileAlt} />
                </button>

                <button type="button" className="btn btn-danger" onClick={()=>handleDeleteUser(row.id)} ><FontAwesomeIcon icon={faTrash}/></button>
            </div>
        </div> )    },
    },
];

function Items({ currentItems }) {
  return (
    <>
      {currentItems &&
        currentItems.map((item) => (
          <div>
            <h3>Item #{item}</h3>
          </div>
        ))}
    </>
  );
}

const handlePageClick = (event) => {
    console.log(event.selected+1);
    const newOffset = (event.selected * pageSize) % items.length;
    console.log(
      `User requested page number ${event.selected}, which is offset ${newOffset}`
    );
     setItemOffset(newOffset);
    fetchProducts(event.selected+1);
     setcurrentPage(event.selected)
     
}

const fetchProducts = async (pageNumber) => {
    var token = localStorage.getItem('token')
    await axios.get(`http://localhost:8081/api/products/list`,{
        headers: {
       Authorization: `${token}`
     },params: {
        page: pageNumber,
        size: pageSize,
      },
  
    }).then(({data})=>{
        setProducts(data.data)
        setdata(data.message['data']);
        setTotalRecords(data.message['total_records'])
        pushtoitems(data.message['total_records']);
        setTotalPage(Math.ceil(data.message['total_records']/pageSize)) 
    }).catch(({response})=>{
    if(response.status===422){
       // navigate("/login")
    }else if(response.status===403){
       // navigate("/login")
    }else{
       // navigate("/login")
    }
  })

}

    useEffect(() => {
        setLoading(false);
        setloaderdisplay('none')
       // get_user_list(1);
       fetchProducts(1) 
    }, []);
       
         
  return (
    <>
    <div className="sidebar__">
    <CustomSidebar/>
    </div>
 
        <div>
    
        <div className="spinner-loader" style={{display:loaderdisplay}}>
            <RotateLoader
            color={color}
            loading={loading}
            size={15}
            aria-label="Loading Spinner"
            data-testid="loader"
            />
        </div>
         
        <div className="content">
        <h6>Product List</h6>
        <DataTable
                columns={columns}
                data={data}
        />
     
    <div className="reacts-pagination">
      <ReactPaginate
        breakLabel="..."
        nextLabel=">"
        pageRangeDisplayed={2}
        onPageChange={handlePageClick}
        pageCount={pageCount}
        previousLabel="<"
        renderOnZeroPageCount={null}
      />
     
      </div>
        </div>
     
       </div>
      
       </>
        )
}

	
