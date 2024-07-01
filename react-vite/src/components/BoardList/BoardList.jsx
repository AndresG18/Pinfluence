// import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { getAllBoardPins } from '../../redux/pins';
const BoardList = ({ boards }) => {
  const navigate = useNavigate();
  const handleBoardClick = (boardId) => {
    navigate(`/boards/${boardId}`);
  };


  return (
    <div className="board-list">
      {boards.map((board) => {
        const boardPins = board.pins
        console.log(boardPins)
        return (
          <div key={board.id} className="board" onClick={() => handleBoardClick(board.id)}>
            <div className="board-preview">
              {boardPins.length === 1 ? (
                <img src={boardPins[0].content_url} alt={boardPins[0].title} className="single-image" />
              ) : (
                <div className="collage">
                  {boardPins.slice(0).reverse().map((pin, index) => (
                    <img
                      key={pin.id}
                      src={pin.content_url}
                      alt={pin.title}
                      className={`collage-image collage-image-${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
            <h4>{board.name}</h4>
            {/* <p>{board.description}</p> */}
          </div>
        );
      })}
    </div>
  ) 
};

export default BoardList;
