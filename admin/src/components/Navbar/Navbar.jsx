import React from 'react'
import './Navbar.css'
import navlogo from '../../assets/nav-logo.svg'
import navprofile from '../../assets/nav-profile.svg'

const Navbar = () => {
  return (
    <div className='navbar'>
        <img className='nav_log' src={navlogo} alt="" />
        <img className='nav_profile' src={navprofile} alt="" />
    </div>
  )
}

export default Navbar