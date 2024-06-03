import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";
import { FaPinterest } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { AiOutlineMessage } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { IoIosArrowDown } from "react-icons/io";
function Navigation() {
  const navigate = useNavigate()
  const user = useSelector(state => state.session.user)
  const header = user ? (
    <div className="header">
      <FaPinterest className="logo"  />
      <NavLink to='/' className="header-link"> Home </NavLink>
      <NavLink to='/explore'className="header-link"> Feed </NavLink>
      <NavLink to='/pins/new'className="header-link"> Create </NavLink>
      <div className="searchBar" > <FaSearch/> <input className='search' placeholder="Search" type="search"/> </div>
      <AiOutlineMessage className="message-icon" />
      <ProfileButton />
    </div>
  ) : (<>
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
  </>)
  return header
}

export default Navigation;
