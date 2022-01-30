import React from 'react';
import { useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import './NotFound.css';

const NotFound = () => {

    const navigate = useNavigate();

    return (
        <div className='not-found'>
            <div className='not-found-text-wrapper'>
                <Typography fontSize={ 60 }><b>404</b></Typography>
                <Typography fontSize={ 35 }>Not Found</Typography>
            </div>
            <Button variant="contained" onClick={ () => navigate('/') }>Go Home</Button>
        </div>
    );
};

export default NotFound;
