import { useContext } from 'react'
import Search from './Search'
import { useNavigate, NavLink } from "react-router-dom";
import { Context } from "../context/context"
import logo from "../assets/logo.png";

const Navbar = () => {
  const navigate = useNavigate();
  const { userId, token } = useContext(Context);

  return (
    <div className='py-[3vh] flex items-center justify-between font-medium navbarColor w-full sticky top-0 z-50'>
      <div className='w-[50%] px-[2.5%] flex items-center'>
        <img onClick={() => navigate("/")} src={logo} alt="logo" className='w-45 h-9 pr-10 cursor-pointer' />
        <Search />
      </div>
      <ul className='w-[50%] justify-evenly flex text-lg text-white'>
        <NavLink to="/" className={({ isActive }) => `transition:all hover:scale-105 hover:text-indigo-500 ${isActive ? "text-indigo-500 font-bold" : ""}`}>
          <p>Home</p>
        </NavLink>

        {!(token && userId) ? (
          <NavLink to='/sign-in' className={({ isActive }) => `transition:all hover:scale-105 hover:text-indigo-500 ${isActive ? "text-indigo-500 font-bold" : ""}`}>
            <p>Login</p>
          </NavLink>
        ) : (
          <NavLink to='/edit' className={({ isActive }) => `transition:all hover:scale-105 hover:text-indigo-500 ${isActive ? "text-indigo-500 font-bold" : ""}`}>
            <p>Edit</p>
          </NavLink>
        )}

        <NavLink to={`/profile/${userId}`} className={({ isActive }) => `transition:all hover:scale-105 hover:text-indigo-500 ${isActive ? "text-indigo-500 font-bold" : ""}`}>
          <p>Profile</p>
        </NavLink>

        <NavLink to='/favorites' className={({ isActive }) => `transition:all hover:scale-105 hover:text-indigo-500 ${isActive ? "text-indigo-500 font-bold" : ""}`}>
          <p>Favorites</p>
        </NavLink>


        <NavLink to='/inbox' className={({ isActive }) => `transition:all hover:scale-105 hover:text-indigo-500 ${isActive ? "text-indigo-500 font-bold" : ""}`}>
          <p>Inbox</p>
        </NavLink>
      </ul>
    </div>
  )
}

export default Navbar