import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";
import { FaPinterest } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { AiOutlineMessage } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IoIosArrowDown } from "react-icons/io";
import { thunkLogin } from "../../redux/session";
function Navigation() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(state => state.session.user)
  const login = ()=>{
    const loginObj = {
      "email":"demoUser@gmail.com",
      "password":'password123'
    }
  dispatch(thunkLogin(loginObj))
  }
  const header = user ? (
    <div className="header">
      <FaPinterest className="logo"  />
      <NavLink to='/' className="header-link"> Home </NavLink>
      <NavLink to='/explore'className="header-link"> Feed </NavLink>
      <NavLink to='/pins/new'className="header-link"> Create </NavLink>
      <div className="searchBar" > <FaSearch/> <input className='search' placeholder="Search" type="search"/> </div>
      <AiOutlineMessage onClick={(e)=>window.alert('Feature Coming Soon!')} className="message-icon" />
      <ProfileButton />
    </div>
  ) : (<div className="nav-logged-out">
   <div className="header-out">
    <div className="home-logo">
      <FaPinterest className="logo"  />
      <h2 className="nav-header">influence</h2>
    </div>
    <div>

      {/* <button></button> */}
      <ProfileButton />
    </div>
    </div>
    <button className="login demo"  onClick={login}>Login as DemoUser</button>
  </div>)
  return header
}

export default Navigation;
