import React from 'react';
import home_page_background from '../assets/home_page_background.jpg'; 

const Home = () => {
    return (
        <div 
            className='home-container' 
            style={{ backgroundImage: `url(${home_page_background})` }}
        >
            <h1 className='home-heading'>Find Your Perfect Dog Match!</h1>
        </div>
    );
}

export default Home;
