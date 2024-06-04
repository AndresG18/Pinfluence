import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { thunkGetUserPins, thunkGetAllPins } from "../../redux/pins";
import { thunkGetUser } from "../../redux/session";
import BoardList from "../BoardComponents/BoardList";
import "./UserPage.css";

export default function UserPage() {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  const user = useSelector((state) => state.session.user);
  const createdPins = useSelector((state) => state.pins.myPins);
  const allPins = useSelector((state) => state.pins.allPins);

  const [savedPins, setSavedPins] = useState([]); 
  const [boards, setBoards] = useState([]); 
  const [loaded, setLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState("created");
  const [currUser, setCurrUser] = useState("");
  
  useEffect(() => {
    thunkGetUser(userId).then((data) => {
      dispatch(thunkGetUserPins(userId));
      dispatch(thunkGetAllPins());
      setCurrUser(data);
      setSavedPins(data.saved);
      setBoards(data.boards); 
    }).then(() => setLoaded(true));
  }, [dispatch, userId]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handlePinClick = (pinId) => {
    navigate(`/pins/${pinId}`);
  };

  const handleCreateBoard = () => {
    navigate(`/boards/new`);
  };

  return (
    <div className="user-page">
      {loaded ? (
        <>
          <div className="user-info">
            <img
            style={{height:'7rem',width:'7rem'}}
              src={currUser.profile_image}
              alt={`${currUser.username}'s profile`}
              className="profile-image"
            />
            <h2 className="profile-name">{currUser.username}</h2>
            <p >{currUser.about}</p>
            <div className="following">
              <span>{currUser?.followers?.length} Followers</span> •
              <span>{currUser?.following?.length} Following</span>
            </div>
          </div>
          <div className="tabs">
            <button
              className={`tab ${activeTab === "created" ? "active" : ""}`}
              onClick={() => handleTabChange("created")}
            >
              Created
            </button>
            <button
              className={`tab ${activeTab === "saved" ? "active" : ""}`}
              onClick={() => handleTabChange("saved")}
            >
              Saved
            </button>
          </div>
          {activeTab === "saved" && (
            <button className="create-board-button" onClick={handleCreateBoard}>
              Add Board +
            </button>
          )}
          <div className="pin-container">
            {activeTab === "created" && createdPins.length > 0 ? (
              createdPins.map((pin) => (
                <div key={pin.id} className="pin" onClick={() => handlePinClick(pin.id)}>
                  <img src={pin.content_url} alt={pin.title} className="pin-image" />
                  <div className="pin-title">{pin.title}</div>
                </div>
              ))
            ) : activeTab === "saved" ? (
              <>
                <BoardList boards={boards} pins={allPins} />
              </>
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
