import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import { thunkCreatePin } from '../../redux/pin';
import { thunkAddPinToBoard } from '../../redux/board';
import { thunkGetUserBoards } from '../../redux/boards';
import { FaTrash } from 'react-icons/fa';
import './PinForm.css';
import '../BoardComponents/BoardDetails.css';
import { useNavigate } from 'react-router-dom';
import BoardForm from '../BoardComponents/BoardForm';

const PinForm = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.session.user);
  const boards = useSelector(state => state.boards.myBoards);
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [selectedBoard, setSelectedBoard] = useState('');
  const [media, setMedia] = useState(null);
  const [errors, setErrors] = useState({});
  const [fileError, setFileError] = useState('');
  const [loaded, setLoaded] = useState(false);
  const boardFormRef = useRef(null);

  useEffect(() => {
    if (user) {
      dispatch(thunkGetUserBoards()).then(() => setLoaded(true));
    }
  }, [dispatch, user]);

  const onDrop = (acceptedFiles, rejectedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setMedia(file);
      setFileError('');
    }
    if (rejectedFiles.length > 0) {
      setFileError('File is too large. Max size is 7MB.');
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
    setErrors({});
    setFileError('');

    const validationErrors = {};
    if (title.length < 3 || title.length > 40) {
      validationErrors.title = 'Title must be between 3 and 40 characters.';
    }
    if (description.length < 3 || description.length > 700) {
      validationErrors.description = 'Description must be between 3 and 300 characters.';
    }
    if (!media) {
      validationErrors.media = 'Please upload an image or video.';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('link', link);
    formData.append('content_url', media);

    const response = await dispatch(thunkCreatePin(formData));
    if (response.errors) {
      setErrors(response.errors);
    } else {
      if (selectedBoard) {
        await dispatch(thunkAddPinToBoard(selectedBoard, response.id));
      }
      navigate(`/pins/${response.id}`);
    }
  };

  const scrollToBoardForm = () => {
    if (boardFormRef.current) {
      boardFormRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
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
            {errors.media && <div className="error-messages">{errors.media}</div>}
            {fileError && <div className="error-messages">{fileError}</div>}
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
              {errors.title && <div className="error-messages">{errors.title}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea 
                id="description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                required 
              />
              {errors.description && <div className="error-messages">{errors.description}</div>}
            </div>
            <div className="form-group" style={{marginBottom:'0px'}}>
              <label htmlFor="link">Link (optional)</label>
              <input 
                id="link" 
                type="text" 
                value={link} 
                onChange={(e) => setLink(e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label htmlFor="boardId">Save to a Board (optional)</label>
              <select 
                style={{marginBottom:'0px'}}
                id="boardId" 
                value={selectedBoard} 
                onChange={(e) => setSelectedBoard(e.target.value)} 
              >
                <option value="" disabled>Select Board</option>
                {loaded && boards.map(board => (
                  <option key={board.id} value={board.id}>{board.name}</option>
                ))}
              </select>
            </div>
          </div>
        </form>
        <p style={{margin:'0px'}}>or...</p>
        <button onClick={scrollToBoardForm} className='signup'>Create a board</button>
      </div>
      <div className='board-f' style={{margin:'9rem'}} ref={boardFormRef}>
        <BoardForm />
      </div>
    </>
  );
};

export default PinForm;
