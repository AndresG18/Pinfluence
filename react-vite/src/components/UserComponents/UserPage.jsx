import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { thunkGetAllPins } from "../../redux/pins";
import { thunkGetUser, thunkToggleFollow } from "../../redux/session";
import BoardList from "../BoardComponents/BoardList";
import "./UserPage.css";
import PinList from "../PinComponents/PinList";
import { FaPinterest } from "react-icons/fa";
export default function UserPage() {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const allPins = useSelector((state) => state.pins.allPins);

  const [createdPins, setCreatedPins] = useState([]);
  const [likedPins, setLikedPins] = useState([]);
  const [following, setFollowing] = useState(false);
  const [boards, setBoards] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState("created");
  const [currUser, setCurrUser] = useState(null);
  const user = useSelector((state) => state.session.user);

  useEffect(() => {
    if (!user) navigate('/');

    const fetchData = async () => {
      const userData = await thunkGetUser(userId);
      setCurrUser(userData);
      setCreatedPins(userData.pins);
      setBoards(userData.boards);
      setFollowing(userData.followers.includes(user.id));

      await dispatch(thunkGetAllPins());

      const likedPinsArray = userData.likes.map((like) => like.pin_id);
      const filteredLikedPins = allPins.filter((pin) => likedPinsArray.includes(pin.id));
      setLikedPins(filteredLikedPins);

      setLoaded(true);
    };

    fetchData();
  }, [dispatch, userId, user, navigate]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handlePinClick = (pinId) => {
    navigate(`/pins/${pinId}`);
  };

  const handleCreateBoard = () => {
    navigate(`/boards/new`);
  };

  const handleFollowToggle = async () => {
    await dispatch(thunkToggleFollow(currUser.id));
    setFollowing((prev) => !prev);
  };

  return user ? (
    <div className="user-page">
      {loaded ? (
        <>
          <div className="user-info">
            <img
              style={{ height: '7rem', width: '7rem' }}
              src={currUser?.profile_image ?? 'https://pinfluence-2024.s3.us-east-2.amazonaws.com/pinfluence_pfp.webp'}
              alt={`${currUser?.username}'s profile`}
              className="profile-image"
            />
            <h2 className="profile-name">{currUser?.username}</h2>
            <p>{currUser?.about}</p>
            {user.id !== currUser?.id && (
              <button className="signup" onClick={handleFollowToggle}>
                {following ? "Unfollow" : "Follow"}
              </button>
            )}
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
              className={`tab ${activeTab === "Saved" ? "active" : ""}`}
              onClick={() => handleTabChange("Saved")}
            >
              Saved
            </button>
          </div>
          {activeTab === "Saved" && currUser.id === user.id && (
            <button className="create-board-button" onClick={handleCreateBoard}>
              Add a Board +
            </button>
          )}
          {activeTab === "created" && createdPins.length > 0 ? (
            <>
              <button onClick={() => navigate('/pins/new')} className="create-board-button">
                Create a pin +
              </button>
            <div className="pin-container" style={{margin:'0px'}}>
              {createdPins.map((pin) => (
                <div key={pin.id} className="pin" onClick={() => handlePinClick(pin.id)}>
                  <img src={pin.content_url} alt={pin.title} className="pin-image" />
                  <div className="pin-title">{pin.title}</div>
                </div>
              ))}
            </div>
          </>) : activeTab === "Saved" ? (
            <>
              <BoardList boards={boards} pins={allPins} />
              <div className="saved-pins">
                <h2 >Saved Pins</h2>
                <PinList pins={likedPins} />
              </div>
            </>
          ) : (
            currUser.id === user.id && (
              <button onClick={() => navigate('/pins/new')} className="create-board-button">
                Create a pin +
              </button>
            )
          )}
        </>
      ) : (
        <div className="loading-container">
        <div className="loading-spinner"></div>
        <FaPinterest style={{ color: '#E60023', fontSize: '2rem' }} />
      </div>
      )}
    </div>
  ) : null;
}
