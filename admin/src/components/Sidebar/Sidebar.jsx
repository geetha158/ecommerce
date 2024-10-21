import React from 'react'
import { Link } from 'react-router-dom'
import './Sidebar.css'
import addproduct_icon from '../../assets/Product_Cart.svg'
import list_product_icon from '../../assets/Product_list_icon.svg'

const Sidebar = () => {
  return (
    <div className='sidebar'>
        <Link to={'/addproduct'} style={{textDecoration:"none"}}>
        <div className='sidebar_item'>
            <img src={addproduct_icon} alt="" />
            <p>Add Product</p>
        </div>
        </Link>
        <Link to={'/listproduct'} style={{textDecoration:"none"}}>
        <div className='sidebar_item'>
            <img src={list_product_icon} alt="" />
            <p>List all the Products</p>
        </div>
        </Link>
    </div>
  )
}

export default Sidebar