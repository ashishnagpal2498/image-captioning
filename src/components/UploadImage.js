import React, { useState, useContext, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { ImageContext } from '../context/ImageContext';
import { Button, CircularProgress } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import '../stylesheets/dropbox.css';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const DropBox = ({ onDrop }) => {
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} className="drop-box">
      <input {...getInputProps()} />
      <CloudUploadIcon sx={{ fontSize: 40 }} />
      <p>Drag 'n' drop image to generate caption</p>
    </div>
  );
};

const UploadImage = () => {
  const [image, setImage] = useState(null);
  const { uploadImage, loading, successMessage } = useContext(ImageContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const onDrop = (acceptedFiles) => {
    setImage(acceptedFiles[0]);
  };

  const handleUpload = async () => {
    if (image) {
      await uploadImage(image);
    }
  };

  return (
    <div>
      <h1>Add Picture</h1>
      <Link className='gallery-button' to={"/"}>View Gallery</Link>
      <DropBox onDrop={onDrop} />
      <div className="image-list">
        {image && <h4>Preview Image</h4>}
        {image && (
          <img className='file-item-image' width={"400px"} src={URL.createObjectURL(image)} alt={image.name} />
        )}
      </div>
      <Button onClick={handleUpload} variant="contained" startIcon={<CloudUploadIcon />}>
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Upload Image'}
      </Button>
      {successMessage && <div className="success-message">{successMessage}</div>}
    </div>
  );
};

export default UploadImage;
