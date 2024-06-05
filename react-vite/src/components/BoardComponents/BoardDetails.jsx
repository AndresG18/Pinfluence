import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { thunkGetBoard, thunkDeleteBoard, thunkRemovePinFromBoard } from '../../redux/board';
import { FaEdit, FaTrash } from 'react-icons/fa';
import './BoardDetails.css';

const BoardDetails = () => {
  const { boardId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const board = useSelector((state) => state.board.board);
  const [loaded, setLoaded] = useState(false);
  const user = useSelector(state => state.session.user);

  useEffect(() => {
    dispatch(thunkGetBoard(boardId)).then(() => setLoaded(true));
  }, [dispatch, boardId]);

  const handleEditBoard = () => {
    navigate(`/boards/${boardId}/edit`);
  };

  const handleDeleteClick = () => {
    dispatch(thunkDeleteBoard(boardId)).then(() => {
      navigate(`/users/${user.id}`);
    });
  };

  const handleRemovePin = (pinId) => {
    dispatch(thunkRemovePinFromBoard(boardId, pinId)).then(() => {
      dispatch(thunkGetBoard(boardId));
    });
  };

  return (
    <div className="board-details">
      {loaded && board ? (
        <>
          <div className="board-header">
            <h2>{board.name}</h2>
            <p>{board.description}</p>
            {user && user.id === board.user_id && (
              <>
                <button className="login" onClick={handleEditBoard}>
                  <FaEdit /> Edit
                </button>
                <button className="signup" onClick={handleDeleteClick}>
                  <FaTrash /> Delete
                </button>
              </>
            )}
          </div>
          <div className="pin-container">
            {board.pins && board.pins.length > 0 ? (
              board.pins.map((pin) => (
                <div key={pin.id} className="pin">
                  <img src={pin.content_url} alt={pin.title} className="pin-image" />
                  <div className="pin-title">
                    {pin.title}
                    {user && user.id === board.user_id && (
                      <FaTrash
                        className="remove-icon"
                        onClick={() => handleRemovePin(pin.id)}
                      />
                    )}
                  </div>
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
};

export default BoardDetails;
