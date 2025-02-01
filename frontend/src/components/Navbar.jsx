import {useContext, useState} from 'react'
import { Link, NavLink } from 'react-router-dom'
import Search from './Search'


const Navbar = () => {
  return (
    <div className='py-[3vh] flex items-center justify-between font-medium navbarColor'>
      <div className='w-full px-[5%] flex items-center'>
        <img src="" alt="logo" className='pr-10'/>
        <Search />
      </div>
    </div>
  )
}

export default Navbar