import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { thunkGetBoard, thunkCreateBoard, thunkEditBoard } from '../../redux/board';


const BoardForm = ({ isEditing }) => {
  const { boardId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});
  const user = useSelector(state => state.session.user)

  useEffect(() => {
    if(!user)navigate('/')
    if (isEditing && boardId) {
      dispatch(thunkGetBoard(boardId)).then((data) => {
        setName(data.name);
        setDescription(data.description);
      });
    }
  }, [dispatch, boardId, isEditing]);

  const validateForm = () => {
    const newErrors = {};

    if (name.trim().length > 30 || name.trim().length < 4) {
      newErrors.name = "Title must be between 4-30 characters";
    }
    if (description.trim().length > 60) {
      newErrors.description = "Description can't be more than 60 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

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
    <div className="board-form-container">
      <h2>{isEditing ? 'Edit Board' : 'Create Board'}</h2>
      <form className='board-form' onSubmit={handleSubmit}>
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
