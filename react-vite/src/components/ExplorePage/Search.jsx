import { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SearchContext } from '../../context/SearchContext';
import { thunkGetAllPins } from '../../redux/pins';
import { thunkToggleFollow } from '../../redux/session'; // Import your thunk
import { useNavigate } from 'react-router-dom';
import { FaPinterest } from 'react-icons/fa';
import '../HomePage/HomePage.css';

const Search = () => {
  const { query } = useContext(SearchContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [filteredPins, setFilteredPins] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const pins = useSelector(state => state.pins.allPins);
  const [loaded, setLoaded] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [usersTab, setUsersTab] = useState(false);
  const [pinsTab, setPinsTab] = useState(true);
  const [following, setFollowing] = useState(new Set());
  const user = useSelector(state => state.session.user);

  const getAllUsers = async () => {
    const response = await fetch('/api/users');
    const data = await response.json();
    return data.users; // Assuming the API returns a 'users' key with the array of users
  };

  useEffect(() => {
    dispatch(thunkGetAllPins());
    getAllUsers().then((data) => {
      setAllUsers(data);
      setLoaded(true);
    });
  }, [dispatch]);

  useEffect(() => {
    if (query) {
      const lowercasedQuery = query.toLowerCase();
      const filtered = pins.filter(pin =>
        pin.title?.toLowerCase().includes(lowercasedQuery) ||
        pin.description?.toLowerCase().includes(lowercasedQuery)
      );
      const filteredUsers = allUsers.filter(person =>
        person.username?.toLowerCase().includes(lowercasedQuery) ||
        person.about?.toLowerCase().includes(lowercasedQuery)
      );
      setFilteredPins(filtered);
      setFilteredUsers(filteredUsers);
    } else {
      setFilteredPins(pins);
      setFilteredUsers(allUsers);
    }
  }, [query, pins, allUsers]);

  useEffect(() => {
    if (user) {
      const userFollowingIds = new Set(user.following.map(f => f.followed_id));
      setFollowing(userFollowingIds);
    }
  }, [user]);

  const handleFollowToggle = async (personId) => {
    const result = await dispatch(thunkToggleFollow(personId));
    if (result.message === "User followed") {
      setFollowing(prev => new Set(prev).add(personId));
    } else {
      setFollowing(prev => {
        const updated = new Set(prev);
        updated.delete(personId);
        return updated;
      });
    }
  };

  return loaded ? (
    <>
      <div className="tabs" style={{ marginTop: '100px' }}>
      <button className={pinsTab ? 'login' : 'signup'} onClick={() => { setPinsTab(true); setUsersTab(false); }}>Pins</button>
        <button className={usersTab ? 'login' : 'signup'} onClick={() => { setPinsTab(false); setUsersTab(true); }}>Users</button>
      </div>
      {pinsTab && (
        <div className="homepage" style={{ marginTop: '0px' }}>
          <div className="pin-container">
            {filteredPins.length > 0 ? (
              filteredPins.slice(0).reverse().map((pin) => (
                <div onClick={() => navigate(`/pins/${pin.id}`)} key={pin.id} className="pin">
                  <img src={pin.content_url} alt={pin.title} className="pin-image" />
                  <div className="pin-title">{pin.title}</div>
                </div>
              ))
            ) : (
              <div>No pins found.</div>
            )}
          </div>
        </div>
      )}
      {usersTab && (
        <div className="users-container">
          {filteredUsers.length > 0 ? (
            filteredUsers.map(person => (
              <div key={person.id} className="pin-user" style={{
                width:'40%',
                display:'flex',
                flexDirection:'column',
                textAlign:'center',
                margin:'1.1rem'
                }}>
                <img
                  className="pfp-in"
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/users/${person.id}`)}
                  src={person.profile_image ?? 'https://pinfluence-2024.s3.us-east-2.amazonaws.com/pinfluence_pfp.webp'}
                  alt={person.name}
                />
                <div className="nameAndFollowers" style={{width:'100%'}}>
                  <span className="pin-owner-name">{person.username}</span>
                  <div  className='following'style={{display:'flex',justifyContent:'center'}}>
                  <span>{person.followers?.length} followers</span> •
                  <span>{person.following?.length} following</span>

                  </div>
                </div>
                {user && user.id !== person.id && (
                  <button style={{marginTop:'-15px'}} className="signup" onClick={() => handleFollowToggle(person.id)}>
                    {following.has(person.id) ? "Unfollow" : "Follow"}
                  </button>
                )}
              </div>
            ))
          ) : (
            <div>No users found.</div>
          )}
        </div>
      )}
    </>
  ) : (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <FaPinterest style={{ color: '#E60023', fontSize: '2rem' }} />
    </div>
  );
};

export default Search;


// (
//     <div className="homepage">
//     <div className="pin-container">
//       {filteredPins.slice(0).reverse().map((pin) => (
//         <div onClick={()=>navigate(`/pins/${pin.id}`)} key={pin.id} className="pin">
//           <img src={pin.content_url} alt={pin.title} className="pin-image" />
//           <div className="pin-title">{pin.title}</div>
//         </div>
//       ))}
//     </div>
//     </div>
//   )