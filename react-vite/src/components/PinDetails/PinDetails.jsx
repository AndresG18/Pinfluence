import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { thunkGetPin, thunkCreateComment, thunkDeleteComment, thunkDeletePin, thunkToggleLike } from "../../redux/pin";
import { thunkGetUser, thunkToggleFollow } from "../../redux/session";
import { FaPinterest, FaTrash,FaEdit} from 'react-icons/fa';
import { IoSend } from "react-icons/io5";
import { thunkGetUserBoards } from "../../redux/boards";
import { thunkAddPinToBoard } from '../../redux/board';
import './PinDetails.css';

export default function PinDetails() {
  const [loaded, setLoaded] = useState(false);
  const [commentors, setCommentors] = useState([]);
  const [pinOwner, setPinOwner] = useState(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const { pinId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const pin = useSelector(state => state.pin.pin);
  const user = useSelector(state => state.session.user);
  const userBoards = useSelector(state => state.boards.myBoards);
  const [following, setFollowing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState('');

  useEffect(() => {
    dispatch(thunkGetPin(pinId)).then((data) => {
      setComments(data.comments);
      getUsers(data.comments);
      thunkGetUser(data.user_id).then((data) => {
        setPinOwner(data);
        if (user) {
          setFollowing(data.followers.includes(user.id));
          setSaved(user.likes.some(pin => pin.pin_id == pinId));
          dispatch(thunkGetUserBoards(data.id));
        }
      }).then(() => setLoaded(true));
    });
  }, [dispatch, pinId, user]);

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
    if (comment.length > 200) {
      setErrors('comment must be between 3-200 characters');
      return;
    }
    dispatch(thunkCreateComment(pinId, commentObj)).then(() => {
      dispatch(thunkGetPin(pinId)).then((data) => {
        setComments(data.comments);
        setComment('');
      });
    });
  };

  const handleCommentDelete = (id) => {
    dispatch(thunkDeleteComment(pinId, id)).then(() => {
      dispatch(thunkGetPin(pinId)).then((data) => {
        setComments(data.comments);
        setComment('');
      });
    });
  };

  const handleFollowToggle = async () => {
    const result = await dispatch(thunkToggleFollow(pinOwner.id));
    if (result.message === "User followed") {
      setFollowing(true);
      setPinOwner(prev => ({
        ...prev,
        followers: [...prev.followers, user.id]
      }));
    } else {
      setFollowing(false);
      setPinOwner(prev => ({
        ...prev,
        followers: prev.followers.filter(followerId => followerId !== user.id)
      }));
    }
  };

  const handleSaveToggle = async () => {
    const result = await thunkToggleLike(pinId);
    if (result.message === "Pin liked") {
      setSaved(true);
    } else {
      setSaved(false);
    }
  };

  const handleEditClick = () => {
    navigate(`/pins/${pinId}/edit`);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    dispatch(thunkDeletePin(pinId)).then(() => {
      navigate('/');
    });
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleAddToBoard = (boardId) => {
    setShowDropdown(false)
    dispatch(thunkAddPinToBoard(boardId, pinId)).then(() => {
      setShowDropdown(false);
      setShowNotification(true);
      setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => {
          setShowNotification(false);
          setFadeOut(false);
        }, 1000);
      }, 2000);
    });
  };

  return loaded ? (
    <div className="pin-box">
      <div className="pin-img-container">
        <img className="pin-img" src={pin?.content_url} alt={pin?.title} />
      </div>
      <div className="pin-inner-right">
        {showDeleteModal && (
          <div className="modal">
            <div className="modal-content">
              <h2>Are you sure you want to delete this pin?</h2>
              <button className="login" onClick={confirmDelete}>Yes, delete</button>
              <button className="signup" onClick={cancelDelete}>No, cancel</button>
            </div>
          </div>
        )}
        {showNotification && (
          <div className={`notification ${fadeOut ? 'fade-out' : ''}`}>
            Added to board successfully
          </div>
        )}
        <div className="pin-header">
          <button onClick={() => window.history.back()} className="back-button">← Back</button>
          <div className="pin-action-buttons">
            {user && user.id === pinOwner?.id && (
              <>
                <button className="signup" style={{ cursor: 'pointer' }} onClick={handleDeleteClick}><FaTrash /> </button>
                <button className="signup edit-button" type="edit" onClick={handleEditClick}> <FaEdit /> Edit</button>
              </>
            )}
            {user && (<>
              <button className="login" onClick={handleSaveToggle}> {saved ? 'Saved' : 'Save'}</button>
              <button className="login" style={{ fontSize: '1rem', padding: '9px' }} onClick={() => setShowDropdown(prev => !prev)}>+ Add to Board</button>
            </>
            )}
            {showDropdown && (
              <div className="dropdown">
                {userBoards.length > 0 ? userBoards.map(board => (
                  <div key={board.id} onClick={() => handleAddToBoard(board.id)} className="dropdown-item">
                    {board.name}
                  </div>
                )) : 'You have no boards'}
              </div>
            )}
          </div>
        </div>
        <div className="pin-info">
          <span className="pin-name">{pin?.title}</span>
          <span className="pin-description">{pin?.description}</span>
          <div className="pin-user">
            <img className="pfp-in" style={{ cursor: 'pointer'}} onClick={() => navigate(`/users/${pinOwner.id}`)} src={pinOwner?.profile_image ??'https://pinfluence-2024.s3.us-east-2.amazonaws.com/pinfluence_pfp.webp'} alt={pinOwner?.name} />
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
            <h3 style={{width:'100%',margin:'0px'}}>Comments ({comments.length})</h3>
            <div className="pin-comments">
          {/* <h4 style={{margin:'0px'}}>Comments</h4> */}
          {comments.length > 0 ? comments.slice(0).reverse().map((comment, index) => {
            const commentUser = commentors.find(ele => ele.id === comment.user_id);
            const isLastComment = index === comments.length - 1;
            return (
              <div key={comment.id} className={`comment ${isLastComment ? 'last-comment' : ''}`}>
                <img className="pfp" style={{alignSelf:'start'}} onClick={() => navigate(`/users/${comment.user_id}`)} src={commentUser?.profile_image ?? 'https://pinfluence-2024.s3.us-east-2.amazonaws.com/pinfluence_pfp.webp'} alt={commentUser?.name} />
                <div className="username" style={{alignSelf:'start'}}>{commentUser?.username}</div>
                <div className="comment-text" style={{alignSelf:'start'}}>{comment.content}</div>
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
          <div className="com">
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <img className="pfp-in" style={{ marginRight: '10px' }} src={user?.profile_image ?? 'https://pinfluence-2024.s3.us-east-2.amazonaws.com/pinfluence_pfp.webp'} alt={user?.username} />
            <div className="comment-bar">
              <input
                className="comment-input"
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment"
              />
              {comment.length > 3 && (
                <button type="submit" className="comment-submit-button">
                  <IoSend />
                </button>
              )}
            </div>
          </form>
          </div>
        )}
        {errors.length > 10 && <p className="error"> {errors}</p>}
      </div>
    </div>
  ) : (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <FaPinterest style={{ color: '#E60023', fontSize: '2rem' }} />
    </div>
  );
}
