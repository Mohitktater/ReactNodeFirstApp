import { Fragment } from 'react';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import {Link} from 'react-router-dom';


export const CustomSidebar = () => {
     

  return (
  <Fragment>
  <div className="sidebar__">
        <Sidebar>
        <Menu>
          <SubMenu label="Product">
           <MenuItem component={<Link to="/product/create"/>}> Add Product</MenuItem>
            <MenuItem component={<Link to="/"/>}> View Product </MenuItem>
          </SubMenu>
          <SubMenu label="Product">
            <MenuItem component={<Link to="/product/create"/>}> Add Product</MenuItem>
            <MenuItem> View Product </MenuItem>
          </SubMenu>
          
        </Menu>
      </Sidebar>
      </div>
  
    </Fragment>
  )
}
 
