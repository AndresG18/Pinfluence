import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { thunkGetPin, thunkCreateComment, thunkDeleteComment,thunkToggleSave } from "../../redux/pin";
import { thunkGetUser, thunkToggleFollow } from "../../redux/session";
import { FaPinterest, FaArrowRight, FaTrash } from 'react-icons/fa';
import './PinDetails.css';

export default function PinDetails() {
  const [loaded, setLoaded] = useState(false);
  const [commentors, setCommentors] = useState([]);
  const [pinOwner, setPinOwner] = useState(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const { pinId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const pin = useSelector(state => state.pin.pin);
  const user = useSelector(state => state.session.user);
  const [following, setFollowing] = useState(pinOwner?.followers.includes(user.id));
  const [saved,setSaved] = useState('')

  useEffect(() => {
    dispatch(thunkGetPin(pinId)).then((data) => {
      setComments(data.comments);
      getUsers(data.comments);
      thunkGetUser(data.user_id).then((data) => {
        setPinOwner(data);
      }).then(() => setLoaded(true));
    });
  }, [dispatch, pinId, following,saved]);

  const getUsers = (comments) => {
    if (comments && comments.length > 0) {
      comments.forEach(comment => {
        thunkGetUser(comment.user_id).then((data) => {
          setCommentors(prevCommentors => [...prevCommentors, data]);
        });
      });
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const commentObj = { 'content': comment };
    dispatch(thunkCreateComment(pinId, commentObj)).then(() => {
      dispatch(thunkGetPin(pinId)).then((data) => {
        setComments(data.comments);
      });
      setComment('');
    });
  };

  const handleCommentDelete = (id) => {
    dispatch(thunkDeleteComment(pinId, id)).then(() => {
      dispatch(thunkGetPin(pinId)).then((data) => {
        setComments(data.comments);
      });
      setComment('');
    });
  };

  const handleFollowToggle = async () => {
    dispatch(thunkToggleFollow(pinOwner.id));
    setFollowing(prev => !prev);
  };

  const handleSaveClick = () => {
    dispatch(thunkToggleSave(pin.id))
    setSaved(prev => !prev)
  };

  const handleProfileClick = () => {
    alert('Profile feature coming soon!');
  };

  const handleEditClick = () => {
   navigate(`/pins/${pinId}/edit`)
  };

  return loaded ? (
    <div className="pin-box">
      <div className="pin-img-container">
        <img className="pin-img" src={pin?.content_url} alt={pin?.title} />
      </div>
      <div className="pin-inner-right">
        <div className="pin-header">
          <button onClick={() => window.history.back()} className="back-button">← Back</button>
          <div className="pin-action-buttons">
            {user && user.id === pinOwner?.id && (
              <button className="save-button edit-button"  type="edit"   onClick={handleEditClick}>Edit</button>
            )}
            <button className="save-button" style={saved ? {backgroundColor:' #E60023'} : {backgroundColor:'black'}} onClick={handleSaveClick}>{saved ? 'Save' : 'Saved'}</button>
            <div className="profile-menu">
              {/* <button className="profile-button" onClick={handleProfileClick}>Profile</button> */}
            </div>
          </div>
        </div>
        <div className="pin-info">
          <span className="pin-name">{pin?.title}</span>
          <span className="pin-description">{pin?.description}</span>
          <div className="pin-user">
            <img className="pfp-in" style={{cursor:'pointer'}} onClick={()=> navigate(`/users/${pinOwner.id}`)} src={pinOwner?.profile_image} alt={pinOwner?.name} />
            <div className="nameAndFollowers">
              <span className="pin-owner-name">{pinOwner?.username}</span>
              <span>{pinOwner?.followers?.length} followers</span>
            </div>
            {user && user.id !== pinOwner?.id && (
              <button className="signup" onClick={handleFollowToggle}>
                {following ? "Unfollow" : "Follow"}
              </button>
            )}
          </div>
        </div>
        <div className="pin-comments">
          <h3>Comments ({comments.length})</h3>
          {comments.length > 0 ? comments.map((comment) => {
            const commentUser = commentors.find(ele => ele.id === comment.user_id);
            return (
              <div key={comment.id} className="comment">
                <img className="pfp"  onClick={()=> navigate(`/users/${comment.user_id}`)} src={commentUser?.profile_image} alt={commentUser?.name} />
                <div className="comment-text">{comment.content}</div>
                {user && user.id === comment.user_id && (
                  <FaTrash className='trash' onClick={() => handleCommentDelete(comment.id)} />
                )}
              </div>
            );
          }) : (
            <h1>Be the first to comment!</h1>
          )}
        </div>
        {user && (
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <img className="pfp-in" src={user.profile_image} alt={user?.username} />
            <input
              className="comment-input"
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment"
            />
            {comment.length > 3 && (
              <button type="submit" className="comment-submit-button">
                <FaArrowRight />
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  ) : (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <FaPinterest style={{ color: '#E60023', fontSize: '2rem' }} />
    </div>
  );
}
