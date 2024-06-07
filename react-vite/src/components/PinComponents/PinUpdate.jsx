import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDropzone } from 'react-dropzone';
import { useNavigate, useParams } from "react-router-dom";
import { thunkGetPin, thunkEditPin } from "../../redux/pin";
import { FaPinterest, FaTrash } from "react-icons/fa";
import './PinForm.css';

const PinUpdate = () => {
  const { pinId } = useParams();
  const dispatch = useDispatch();
  const pin = useSelector(state => state.pin.pin);
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState(pin ? pin.link : '');
  const [media, setMedia] = useState(null);
  const [errors, setErrors] = useState({});
  const [fileError, setFileError] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    dispatch(thunkGetPin(pinId)).then((data) => {
      setTitle(data.title);
      setDescription(data.description); 
      setMedia(data.content_url);
      setLoaded(true);
    });
  }, [dispatch, pinId]);

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
    if (title.length < 3) {
      validationErrors.title = 'Title must be at least 3 characters.';
    }
    if (description.length < 3) {
      validationErrors.description = 'Description must be at least 3 characters.';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('link', link);
    if (media instanceof File) {
      formData.append('content_url', media);
    }

    const response = await dispatch(thunkEditPin(pinId, formData));
    if (response.errors) {
      setErrors(response.errors);
    } else {
      navigate(`/pins/${response.id}`);
    }
  };

  return loaded ? (
    <div className="pin-form-container">
      <div className="pin-form-header">
        <h2>Update Pin</h2>
        <button onClick={handleSubmit} className="publish-button">Update</button>
      </div>
      <form onSubmit={handleSubmit} className="pin-form">
        <div className="pin-content">
          {media ? (
            <div className="media-preview-container">
              {typeof media === 'string' ? (
                media.endsWith('.mp4') ? (
                  <video src={media} className="pin-preview" controls />
                ) : (
                  <img src={media} alt="Pin Content" className="pin-preview" />
                )
              ) : (
                media.type.startsWith('image/') ? (
                  <img src={URL.createObjectURL(media)} alt="Pin Content" className="pin-preview" />
                ) : (
                  <video src={URL.createObjectURL(media)} className="pin-preview" controls />
                )
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
          <div className="form-group">
            <label htmlFor="link">Link (optional)</label>
            <input 
              id="link" 
              type="text" 
              value={link} 
              onChange={(e) => setLink(e.target.value)} 
            />
          </div>
        </div>
      </form>
    </div>
  ) : (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <FaPinterest style={{ color: '#E60023', fontSize: '2rem' }} />
    </div>
  );
};

export default PinUpdate;
