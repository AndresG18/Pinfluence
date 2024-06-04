import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { thunkGetBoard, thunkCreateBoard, thunkEditBoard } from '../../redux/board';

const BoardForm = ({ isEditing }) => {
  const { boardId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const board = useSelector(state => state.board.board);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditing && boardId) {
      dispatch(thunkGetBoard(boardId)).then((data) => {
        setName(data.name);
        setDescription(data.description);
      });
    }
  }, [dispatch, boardId, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const boardData = { name, description };
    
    if (isEditing) {
      const response = await dispatch(thunkEditBoard(boardId, boardData));
      if (response.errors) {
        setErrors(response.errors);
      } else {
        navigate(`/boards/${response.id}`);
      }
    } else {
      const response = await dispatch(thunkCreateBoard(boardData));
      if (response.errors) {
        setErrors(response.errors);
      } else {
        navigate(`/boards/${response.id}`);
      }
    }
  };

  return (
    <div  className="board-form-container">
      <h2>{isEditing ? 'Edit Board' : 'Create Board'}</h2>
      <form  className='board-form' onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input 
            id="name" 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
          {errors.name && <div className="error">{errors.name}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea 
            id="description" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
          />
          {errors.description && <div className="error">{errors.description}</div>}
        </div>
        <button className='login' style={{width:'20%',alignSelf:'flex-end'}} type="submit">{isEditing ? 'Update' : 'Create'}</button>
      </form>
    </div>
  );
};

export default BoardForm;
