import React,{useState,useEffect} from 'react'
import './ListProduct.css'
import cross_icon from '../../assets/cross_icon.png'
const ListProduct = () => {

  const [allproducts,setAllproducts]=useState([]);

  const fetchinfo=async()=>{
  await fetch('https://ecommerce-evaj.onrender.com/allproducts').then((res)=>res.json()).then((data)=>{
    setAllproducts(data)})
  }

  useEffect(()=>{
    fetchinfo();
  },[])

  const remove_product=async(id)=>{
    await fetch('https://ecommerce-evaj.onrender.com/removeproduct',{
      method:"POST",
      headers:{
        Accept:"application/json",
        'Content-Type':"application/json"
      },
      body:JSON.stringify({id:id})
    })

    await fetchinfo()
  }

  return (
    <div className='list_product'>
      <h1>All Products List</h1>
      <div className='list_product_formatmain'>
        <p>Products</p>
        <p>Tite</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Remove</p>
      </div>
      <div className='listproduct_allproducts'>
        <hr />
        {allproducts.map((product,index)=>{
          return <>
             <div key={index}className='list_product_formatmain list_product_format'>
            <img className='list_product_product_icon' src={product.image} alt="" />
            <p>{product.name}</p>
            <p>${product.old_price}</p>
            <p>${product.new_price}</p>
            <p>{product.category}</p>
            <img onClick={()=>{remove_product(product.id)}} className='remove_icon' src={cross_icon} alt="" />
            </div>
            <hr />
          </>
        })}
      </div>
    </div>
  )
}

export default ListProduct