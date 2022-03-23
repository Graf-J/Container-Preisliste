import React from 'react';
import Header from './components/Header';
import MoneyBar from './components/MoneyBar';
import MoneyTabsWrapper from './components/MoneyTabsWrapper';
import './Home.css';

const Home = () => {

    return (
        <div className='home'>
            <Header />
            <MoneyBar />
            <MoneyTabsWrapper />
        </div>
    )
}

export default Home
