import React from 'react';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';

import IMG1 from '../assets/images/destinations/img.png';
import IMG2 from '../assets/images/destinations/img_1.png';
import IMG3 from '../assets/images/destinations/img_2.png';
import IMG4 from '../assets/images/destinations/img_3.png';
import IMG5 from '../assets/images/destinations/img_4.png';
import IMG6 from '../assets/images/destinations/img_5.png';
import IMG7 from '../assets/images/destinations/img_6.png';
import IMG8 from '../assets/images/destinations/img_7.png';
import IMG9 from '../assets/images/destinations/img_8.png';
import IMG10 from '../assets/images/destinations/img_9.png';

const DestinationGallery = () => {
    const images = [
        { original: IMG1, thumbnail: IMG1 },
        { original: IMG2, thumbnail: IMG2 },
        { original: IMG3, thumbnail: IMG3 },
        { original: IMG4, thumbnail: IMG4 },
        { original: IMG5, thumbnail: IMG5 },
        { original: IMG6, thumbnail: IMG6 },
        { original: IMG7, thumbnail: IMG7 },
        { original: IMG8, thumbnail: IMG8 },
        { original: IMG9, thumbnail: IMG9 },
        { original: IMG10, thumbnail: IMG10 }
    ];

    const renderItem = (item) => (
        <img
            src={item.original}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
    );

    return (
        <ImageGallery
            items={images}
            showThumbnails={false}
            autoPlay={true}
            slideInterval={5000}
            showNav={false}
            showPlayButton={false}
            showFullscreenButton={true}
            renderItem={renderItem}
        />
    );
};

export default DestinationGallery;