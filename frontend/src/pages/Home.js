import React from 'react';
import { useDispatch } from 'react-redux';
import { clear } from '../redux/user';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/authService';

const Home = () => {
    const navigate = useNavigate();

    const dispatch = useDispatch();

    const onLogout = async () => {
        await logout();
        dispatch(clear());
        navigate('login');
    }

    return (
        <div>
            <button onClick={ onLogout }>Logout</button>
        </div>
    )
}

export default Home
