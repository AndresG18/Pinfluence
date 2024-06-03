import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { thunkGetUserPins } from "../../redux/pins";
import { thunkGetUser } from "../../redux/session";
import "./UserPage.css";

export default function UserPage() {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const user = useSelector(state => state.session.user);
  const createdPins = useSelector(state => state.pins.myPins);
  const savedPins = useSelector(state => state.pins.allPins); 
  const [loaded, setLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('created');
  const [currUser , setCurrUser]= useState('')
  useEffect(() => {
    thunkGetUser(userId).then((data) => setCurrUser(data))
    dispatch(thunkGetUserPins(userId)).then(() => setLoaded(true));

  }, [dispatch, userId]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="user-page">
      {loaded ? (
        <>
          <div className="user-info">
            <img src={currUser.profile_image} alt={`${currUser.username}'s profile`} className="profile-image" />
            <h2>{user.username}</h2>
            <p>{user.about}</p>
          </div>
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'created' ? 'active' : ''}`}
              onClick={() => handleTabChange('created')}
            >
              Created
            </button>
            <button
              className={`tab ${activeTab === 'saved' ? 'active' : ''}`}
              onClick={() => handleTabChange('saved')}
            >
              Saved
            </button>
          </div>
          <div className="pin-container">
            {activeTab === 'created' && createdPins.length > 0 ? (
              createdPins.map(pin => (
                <div key={pin.id} className="pin">
                  <img src={pin.content_url} alt={pin.title} className="pin-image" />
                  <div className="pin-title">{pin.title}</div>
                </div>
              ))
            ) : activeTab === 'saved' && my.length > 0 ? (
              savedPins.map(pin => (
                <div key={pin.id} className="pin">
                  <img src={pin.content_url} alt={pin.title} className="pin-image" />
                  <div className="pin-title">{pin.title}</div>
                </div>
              ))
            ) : (
              <div className="loading">No Pins Found</div>
            )}
          </div>
        </>
      ) : (
        <div className="loading">Loading...</div>
      )}
    </div>
  );
}
