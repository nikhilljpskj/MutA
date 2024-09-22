// src/pages/HomeBannerScroll.jsx
import React, { useEffect, useState } from 'react';
import './HomeBannerScroll.scss';

const HomeBannerScroll = () => {
    const [currentImage, setCurrentImage] = useState(0);
    const images = ['https://placehold.co/600x400', 'https://placehold.co/600x400', 'https://placehold.co/600x400'];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage((prevImage) => (prevImage + 1) % images.length);
        }, 3000); // Change every 3 seconds

        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div className="home-banner-scroll">
            <img src={images[currentImage]} alt={`Banner ${currentImage + 1}`} />
        </div>
    );
};

export default HomeBannerScroll;