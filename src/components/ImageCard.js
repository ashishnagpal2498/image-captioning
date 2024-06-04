// Image Card component to display the list
import React from 'react';
import '../stylesheets/image-card.css';

const ImageCard = ({ image }) => {
  return (
    <div className="image-card">
      <img src={image.imageURL} alt={image.caption} />
      <div className="image-info">
        <p><b>Hashtags: </b> {image.caption}</p>
      </div>
    </div>
  );
};

export default ImageCard;
