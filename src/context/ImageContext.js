import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const ImageContext = createContext();

export const ImageProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [images, setImages] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);

    const fetchImages = async () => {
        setLoading(true);
        try {
            if (user && user.token) {
                const response = await axios.get("https://wp3b7oru7quatr53oo4vj6h4sy0vwmkq.lambda-url.us-east-1.on.aws/", {
                    headers: {
                        "Authorization": `Bearer ${user.token}`,
                        "Content-Type": "application/json"
                    }
                });
                if (response.status === 200) {
                    setImages(response.data);
                }
            }
        } catch (error) {
            setError('Error fetching images');
            console.error('Error fetching images:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchImages();
    }, [user]);

    const uploadImage = async (file) => {
        try {
            setLoading(true);
            const fileName = `${file.name}`;
            const response = await axios.post("https://zra2svo5xtrkmjwwerct6uacie0lzhrk.lambda-url.us-east-1.on.aws/", {
                fileName: fileName,
                fileType: file.type
            }, {
                headers: {
                    "Authorization": `Bearer ${user.token}`,
                    "Content-Type": "application/json"
                }
            });

            const { url } = response.data;
            await axios.put(url, file, {
                headers: {
                    "Content-Type": file.type,
                    "x-amz-meta-email": user.username
                }
            });

            setSuccessMessage('Image uploaded successfully ! Check Gallery to view generated caption. ');
            setTimeout(() => setSuccessMessage(null), 3000);
            fetchImages();
        } catch (error) {
            console.error('Error uploading image:', error);
            setError('Error uploading image');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ImageContext.Provider value={{ images, error, loading, successMessage, uploadImage, fetchImages }}>
            {children}
        </ImageContext.Provider>
    );
};
