import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import { thunkCreatePin } from '../../redux/pin';
import { FaTrash } from 'react-icons/fa';
import './PinForm.css';

const PinForm = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.session.user);
  const boards = useSelector(state => state.boards.myBoards);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [boardId, setBoardId] = useState('');
  const [media, setMedia] = useState(null);
  const [errors, setErrors] = useState({});

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setMedia(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*,video/*',
    maxSize: 7485760,
  });

  const handleRemoveMedia = () => {
    setMedia(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('link', link);
    formData.append('board_id', boardId);
    formData.append('content_url', media);

    const response = await dispatch(thunkCreatePin(formData));
    if (response.errors) setErrors(response.errors);
  };

  return (
    <div className="pin-form-container">
      <div className="pin-form-header">
        <h2>Create Pin</h2>
        <button onClick={handleSubmit} className="publish-button">Publish</button>
      </div>
      <form onSubmit={handleSubmit} className="pin-form">
        <div className="pin-content">
          {media ? (
            <div className="media-preview-container">
              {media.type.startsWith('image/') ? (
                <img src={URL.createObjectURL(media)} alt="Pin Content" className="pin-preview" />
              ) : (
                <video src={URL.createObjectURL(media)} className="pin-preview" controls />
              )}
              <button type="button" className="remove-media-button" onClick={handleRemoveMedia}>
                <FaTrash />
              </button>
            </div>
          ) : (
            <div {...getRootProps({ className: 'dropzone' })}>
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop the files here ...</p>
              ) : (
                <p>Drag 'n' drop an image or video here, or click to select one</p>
              )}
            </div>
          )}
        </div>
        <div className="pin-details">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input 
              id="title" 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="link">Destination Link</label>
            <input 
              id="link" 
              type="text" 
              value={link} 
              onChange={(e) => setLink(e.target.value)} 
            />
          </div>
          <div className="form-group">
            <label htmlFor="boardId">Board</label>
            <select 
              id="boardId" 
              value={boardId} 
              onChange={(e) => setBoardId(e.target.value)} 
              required 
            >
              <option value="" disabled>Select Board</option>
              {boards.map(board => (
                <option key={board.id} value={board.id}>{board.name}</option>
              ))}
            </select>
          </div>
        </div>
      </form>
      {errors.length > 0 && (
        <div className="error-messages">
          {errors.map((error, idx) => (
            <p key={idx}>{error}</p>
          ))}
        </div>
      )}
    </div>
  );
};

export default PinForm;
