import { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import { FaPinterest, FaSearch } from 'react-icons/fa';
import { AiOutlineMessage } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
// import { IoIosArrowDown } from 'react-icons/io';
// import { thunkLogin } from '../../redux/session';
import { SearchContext } from '../../context/SearchContext';

function Navigation() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(state => state.session.user);
  const { query, setQuery } = useContext(SearchContext);

  // const login = () => {
  //   const loginObj = {
  //     "email": "demoUser@gmail.com",
  //     "password": 'password123'
  //   };
  //   dispatch(thunkLogin(loginObj));
  // };

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
    navigate('/search');
  };

  const header = user ? (
    <div className="header">
      <FaPinterest className="logo"  onClick={() => navigate('/home')} />
      <NavLink to='/home' className="header-link">Home</NavLink>
      <NavLink to='/explore' className="header-link">Feed</NavLink>
      <NavLink to='/pins/new' className="header-link">Create</NavLink>
      <div className="searchBar">
        <FaSearch />
        <input
          className='search'
          placeholder="Search"
          type="search"
          value={query}
          onChange={handleSearchChange}
        />
      </div>
      <AiOutlineMessage onClick={() => navigate('/messages')} className="message-icon" />
      <ProfileButton />
    </div>
  ) : (
    <div className="nav-logged-out">
      <div className="header-out">
        <div className="home-logo" onClick={() => navigate('/')}>
          <FaPinterest className="logo" />
          <h2 className="nav-header">Influence</h2>
        </div>
        
        <div>
          <ProfileButton />
        </div>
      </div>
      
      {/* <button className="login demo" style={{marginTop:'5px'}} onClick={login}>Login as DemoUser</button> */}
    </div>
  );

  return header;
}

export default Navigation;
