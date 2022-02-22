import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import jwt_decode from 'jwt-decode';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import LiquorIcon from '@mui/icons-material/Liquor';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { clear } from '../../redux/user';
import { logout } from '../../services/authService';
import './Header.css'

const Header = () => {

    const [isOpen, setIsOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    
    const { user } = useSelector(state => state.user);

    useEffect(() => {
        const decodedToken = jwt_decode(user.jwt);
        if (decodedToken.role === 'admin') {
            setIsAdmin(true);
        }
    }, [])

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const onLogout = async () => {
        await logout();
        dispatch(clear());
        navigate('../../login');
    }

    const onDashboardClick = () => {
        const decodedToken = jwt_decode(user.jwt);
        navigate(`../../dashboard/${ decodedToken.id }`)
    }

    return (
        <div className='header'>
            <IconButton size="medium" color='primary' onClick={ () => setIsOpen(true) }>
                <MenuIcon fontSize="large" />
            </IconButton>
            <Button variant="outlined" color='error' onClick={ onLogout }>Logout</Button>
            <Drawer
                anchor='left'
                open={ isOpen }
                onClose={ () => setIsOpen(false) }
            >
                <div className='drawer'>
                    <Button variant="outlined" onClick={ () => navigate('../../') } startIcon={<HomeIcon />}>Home</Button>
                    <Button variant="outlined" onClick={ onDashboardClick } startIcon={<DashboardIcon />} style={{ marginTop: '10px' }}>Dashboard</Button>
                    { isAdmin && <Button variant="outlined" color='secondary' onClick={ () => navigate('../../overall') } startIcon={<RemoveRedEyeIcon />} style={{ marginTop: '10px' }}>Overall</Button> }
                    { isAdmin && <Button variant="outlined" color='secondary' onClick={ () => navigate('../../users') } startIcon={<ManageAccountsIcon />} style={{ marginTop: '10px' }}>Users</Button> }
                    { isAdmin && <Button variant="outlined" color='secondary' onClick={ () => navigate('../../drinks') } startIcon={<LiquorIcon />} style={{ marginTop: '10px' }}>Drinks</Button> }
                </div>
            </Drawer>
        </div>
    );
};

export default Header;
