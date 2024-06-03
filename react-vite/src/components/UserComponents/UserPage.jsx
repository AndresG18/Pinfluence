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
  const navigate = useNavigate(); // Use useNavigate hook
  const user = useSelector((state) => state.session.user);
  const createdPins = useSelector((state) => state.pins.myPins);
  const allPins = useSelector((state) => state.pins.allPins);

  const [savedPins, setSavedPins] = useState([]); 
  const [boards, setBoards] = useState([]); // Add state for boards
  const [loaded, setLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState("created");
  const [currUser, setCurrUser] = useState("");
  
  useEffect(() => {
    thunkGetUser(userId).then((data) => {
      dispatch(thunkGetUserPins(userId));
      dispatch(thunkGetAllPins());
      setCurrUser(data);
      setSavedPins(data.saved);
      setBoards(data.boards); // Set boards data
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
              src={currUser.profile_image}
              alt={`${currUser.username}'s profile`}
              className="profile-image"
            />
            <h2>{currUser.username}</h2>
            <p>{currUser.about}</p>
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
              +
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
                <BoardList boards={boards} pins={allPins} /> {/* Add BoardList component */}
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
