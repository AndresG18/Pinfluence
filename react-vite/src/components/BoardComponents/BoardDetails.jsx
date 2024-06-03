import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { thunkGetBoard } from '../../redux/board';
import './BoardDetails.css';

const BoardDetails = () => {
  const { boardId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const board = useSelector((state) => state.board.board);
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    dispatch(thunkGetBoard(boardId)).then(()=>setLoaded(true))
  }, [dispatch, boardId]);

  const handleEditBoard = () => {
    navigate(`/boards/${boardId}/edit`);
  };

  return (
    <div className="board-details">
      {board && loaded ? (
        <>
          <div className="board-header">
            <h2>{board.name}</h2>
            <button onClick={handleEditBoard} className="edit-board-button">
              Edit
            </button>
          </div>
          <p>{board.description}</p>
          <div className="pin-container">
            {board.pins.length > 0 ? (
              board.pins.map((pin) => (
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
};

export default BoardDetails;
