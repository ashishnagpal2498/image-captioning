import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ImageContext } from '../context/ImageContext';
import ImageCard from './ImageCard';
import { Link, useNavigate } from 'react-router-dom';
import "../stylesheets/dashboard.css"

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const { images, error, loading, fetchImages } = useContext(ImageContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    useEffect(()=>{
        fetchImages()
    },[])
    return (
        <div>
            <h2>Dashboard</h2>
            <div className='title-box'>
                <p>Welcome, {user?.username}</p>
                <button onClick={logout}>Logout</button>
            </div>
            <Link to={"/addImage"}>Add Image</Link>
            {error && <p className='error'>{error}</p>}
            {loading && <p>Loading...</p>}
            <div className="images-container">
                {images.length > 0 ? images.map(image => (
                    <ImageCard key={image.imageId} image={image} />
                )) : !loading && <p>No Images !!</p>}
            </div>
            
        </div>
    );
};

export default Dashboard;
