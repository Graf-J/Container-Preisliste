import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedPage = ({ element }) => {
    const { user } = useSelector(state => state.user);

    return (
        <>
            { user ? element : <Navigate to='login' /> }
        </>
    )
}

export default ProtectedPage
