import { useContext } from 'react'
import Search from './Search'
import { useNavigate, NavLink } from "react-router-dom";
import { Context } from "../context/context"

const Navbar = () => {
  const navigate = useNavigate();
  const { userId } = useContext(Context);

  return (
    <div className='py-[3vh] flex items-center justify-between font-medium navbarColor w-full sticky top-0 z-50'>
      <div className='w-[50%] px-[5%] flex items-center'>
        <img onClick={() => navigate("/")} src="" alt="logo" className='pr-10'/>
        <Search />
      </div>
      <ul className = 'px-[5.5%] justify-center hidden sm:flex gap-30 text-lg text-white'>
            <NavLink to = '/' className = "justify-center flex flex-col items-center hover:scale-105 hover:text-indigo-500">
                <p>Home</p>
                <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden'/>
            </NavLink>

            <NavLink to = '/sign-in' className = "justify-center flex flex-col items-center hover:scale-105 hover:text-indigo-500">
                <p>Login</p>
                <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden'/>
            </NavLink>

            <NavLink to = {`/profile/${userId}`} className = "justify-center flex flex-col items-center hover:scale-105 hover:text-indigo-500">
                <p>Profile</p>
                <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden'/>
            </NavLink>

            <NavLink to = '/favorites' className = "justify-center flex flex-col items-center hover:scale-105 hover:text-indigo-500">
                <p>Favorites</p>
                <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden'/>
            </NavLink>
        </ul>
    </div>
  )
}

export default Navbar