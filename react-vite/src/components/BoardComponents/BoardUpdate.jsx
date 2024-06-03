import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import BoardForm from './BoardForm';
import { thunkGetBoard } from '../../redux/board';

const BoardUpdate = () => {
  const { boardId } = useParams();
  const dispatch = useDispatch();
  const board = useSelector(state => state.board.board);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    dispatch(thunkGetBoard(boardId)).then(() => setLoaded(true));
  }, [dispatch, boardId]);

  return (
    <>
      {loaded && <BoardForm isEditing={true} board={board} />}
    </>
  );
};

export default BoardUpdate;
