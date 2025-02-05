import {useContext, useState} from 'react'
import Search from './Search'
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <div className='py-[3vh] flex items-center justify-between font-medium navbarColor w-full sticky top-0 z-50'>
      <div className='w-full px-[5%] flex items-center'>
        <img onClick={() => navigate("/")} src="" alt="logo" className='pr-10'/>
        <Search />
      </div>
    </div>
  )
}

export default Navbar