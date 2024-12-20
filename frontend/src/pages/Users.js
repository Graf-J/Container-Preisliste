import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';
import Accordion from '@mui/material/Accordion';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StarsIcon from '@mui/icons-material/Stars';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import UndoIcon from '@mui/icons-material/Undo';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CachedIcon from '@mui/icons-material/Cached';
import jwt_decode from 'jwt-decode';
import { getUsers, toggleUserRole, resetPassword, deleteUser, addUser } from '../services/userService';
import Header from './components/Header';
import './Users.css'

const Users = () => {

    const [userId, setUserId] = useState();
    const [users, setUsers] = useState();
    const [addUserModal, setAddUserModal] = useState(false);
    const [addUserStatus, setAddUserStatus] = useState({ error: false, errorMessage: '' });
    const [resetUserModal, setResetUserModal] = useState(false);
    const [deleteUserModal, setDeleteUserModal] = useState(false);
    const selectedUserId = useRef(null);
    const [userName, setUserName] = useState('');
    const [isAdminLoading, setIsAdminLoading] = useState(false);
    const [isAddUserLoading, setIsAddUserLoading] = useState(false);
    const [isResetUserLoading, setIsResetUserLoading] = useState(false);
    const [isDeleteUserLoading, setIsDeleteUserLoading] = useState(false);
    
    const { user } = useSelector(state => state.user);

    useEffect(() => {
        const decodedToken = jwt_decode(user.jwt);
        setUserId(decodedToken.id);

        async function getData() {
            const data = await getUsers();
            setUsers(data);
        }

        getData();
    }, [user.jwt])

    const navigate = useNavigate();

    const getMoneyStyle = (money) => {
        let color = ''
        if (money < 0) {
            color = '#eb4034';
        } else {
            color = '#34eb5f';
        }

        return {
            background: color,
            padding: '0 5px',
            borderRadius: '5px'
        }
    }

    const handleDrinksRefreshClick = async () => {
		setUsers();
		const users = await getUsers();
		setUsers(users);
	}

    const onSwitchChange = async (userId) => {
        setIsAdminLoading(true);
        const user = await toggleUserRole(userId)
        let usersCopy = [...users];
        const index = usersCopy.findIndex(element => element.id === user.id)
        usersCopy[index] = user;
        setUsers(usersCopy);
        setIsAdminLoading(false);
    }

    const onResetUserClick = (userId) => {
        selectedUserId.current = userId;
        setResetUserModal(true);
    }

    const resetUser = async () => {
        setIsResetUserLoading(true);
        const user = await resetPassword(selectedUserId.current);
        let usersCopy = [...users];
        const index = usersCopy.findIndex(element => element.id === user.id)
        usersCopy[index] = user;
        setUsers(usersCopy);
        setResetUserModal(false);
        setIsResetUserLoading(false);
    }

    const onDeleteUserClick = (userId) => {
        selectedUserId.current = userId;
        setDeleteUserModal(true);
    }

    const _deleteUser = async () => {
        setIsDeleteUserLoading(true);
        await deleteUser(selectedUserId.current);
        let usersCopy = [...users];
        usersCopy = usersCopy.filter((value) => {
            return value.id !== selectedUserId.current;
        })
        setUsers(usersCopy);
        setDeleteUserModal(false);
        setIsDeleteUserLoading(false);
    }

    const onViewHomeClick = (userId) => {
        navigate(`/admin/home/${ userId }`);
    }

    const onViewDashboardClick = (userId) => {
        navigate(`/admin/dashboard/${ userId }`);
    }

    const onCreateUserCancleClick = async () => {
        setUserName('');
        setAddUserStatus({ error: false, errorMessage: '' });
        setAddUserModal(false);
    }

    const onCreateUserClick = async () => {
        setIsAddUserLoading(true);
        try {
            if (userName === '') {
                setAddUserStatus({ error: true, errorMessage: 'Textfield is empty' });
                throw new Error('Textfield is empty');
            }
            setAddUserStatus({ error: false, errorMessage: '' });
            const user = await addUser(userName);
            setUserName('');
            setUsers([...users, user]);
            setAddUserModal(false);
        } catch (err) {
            if (err.message === 'Add User failed') {
                setAddUserStatus({ error: true, errorMessage: 'Add User failed' });
            }
        }
        setIsAddUserLoading(false);
    }

    return (
        <div className='users'>
            <Header />
            <div style={{ position: 'relative' }}>
                <div className='users-table-wrapper'>
                    { !users ? 
                    <CircularProgress size={ 100 } style={{ marginLeft: 'calc(50% - 50px)', marginTop: '100px' }} /> :
                    <>
                        { users.map(user => (
                            <Accordion key={ user.id } disabled={ userId === user.id }>
                                <AccordionSummary expandIcon={ <ExpandMoreIcon /> } sx={{ backgroundColor: '#282828' }}>
                                    <Typography color='white' style={{ width: '40%', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{ user.name }</Typography>
                                    <div className='user-icons-wrapper'>
                                        { user.role === 'admin' ? <StarsIcon color='primary' /> : <AccountCircleIcon color='warning' /> }
                                        { user.active ? <CheckCircleIcon color='success' /> : <CancelIcon color='error' /> }
                                        <div style={ getMoneyStyle(user.money) }>
                                            { Math.round(user.money * 100) / 100 } €
                                        </div>
                                    </div>
                                </AccordionSummary>
                                <AccordionDetails sx={{ backgroundColor: '#383838' }}>
                                    <div className='user-settings'>
                                        <Typography color='#CCC'>Admin: </Typography>
                                        <Switch checked={ user.role === 'admin' ? true : false } onChange={ () => onSwitchChange(user.id) }/>
                                    </div>
                                    { user.active ?
                                    <div className='user-settings'>
                                        <Typography color='#CCC'>Password: </Typography>
                                        <Button variant="outlined" color='error' startIcon={<UndoIcon />} onClick={ () => onResetUserClick(user.id) }>Reset</Button>
                                    </div> : null }
                                    <div className="user-settings">
                                        <Typography color='#CCC'>User: </Typography>
                                        <Button variant="contained" color='error' startIcon={<DeleteIcon />} onClick={ () => onDeleteUserClick(user.id) }>Delete</Button>
                                    </div>
                                    <div className='user-sites-button-wrapper'>
                                        <Button variant="outlined" style={{ width: '46%' }} onClick={ () => onViewHomeClick(user.id) }>Home</Button>    
                                        <Button variant="outlined" color='warning' style={{ width: '46%' }} onClick={ () => onViewDashboardClick(user.id) }>Dashboard</Button>          
                                    </div>
                                    { isAdminLoading && <LinearProgress style={{ marginTop: '7px' }} /> }
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </> }
                </div>
                <IconButton color="primary" size='large' style={{ position: 'absolute', bottom: 3, right: 13 }} onClick={ () => setAddUserModal(true) }>
                    <AddIcon fontSize='large'/>
                </IconButton>
                <IconButton color="primary" size='large' style={{ position: 'absolute', bottom: 3, left: 13 }} onClick={ handleDrinksRefreshClick }>
                    <CachedIcon fontSize='large'/>
                </IconButton>
                <Modal
                    open={ addUserModal }
                    onClose={ () => setAddUserModal(false) }
                    className='add-user-modal'
                >
                    <div className='add-user-modal-box'>
                        <Typography fontSize={ 27 } style={{ marginBottom: '20px' }} color='black'>Add User:</Typography>
                        <TextField
                            onChange={ e => setUserName(e.target.value) }
                            className="username-input"
                            error={ addUserStatus.error }
                            label="Name"
                            helperText={ addUserStatus.errorMessage }
                        />
                        <div className='modal-button-wrapper'>
                            <Button color='error' variant='outlined' onClick={ onCreateUserCancleClick }>cancel</Button>
                            <Button variant='contained' onClick={ onCreateUserClick }>create</Button>
                        </div>
                        { isAddUserLoading && <LinearProgress style={{ marginTop: '7px' }}/> }
                    </div>
                </Modal>
                <Modal
                    open={ resetUserModal }
                    onClose={ () => setResetUserModal(false) }
                    className='reset-user-modal'
                >
                    <div className='reset-user-modal-box'>
                        <Typography fontSize={ 20 } style={{ marginBottom: '20px' }} color='black'>Are you sure you want to reset the selected users password?</Typography>
                        <div className='modal-button-wrapper'>
                            <Button color='error' variant='outlined' onClick={ () => setResetUserModal(false) }>cancel</Button>
                            <Button variant='contained' onClick={ resetUser }>reset</Button>
                        </div>
                        { isResetUserLoading && <LinearProgress style={{ marginTop: '7px' }}/> }
                    </div>
                </Modal>
                <Modal
                    open={ deleteUserModal }
                    onClose={ () => setDeleteUserModal(false) }
                    className='delete-user-modal'
                >
                    <div className='delete-user-modal-box'>
                        <Typography fontSize={ 20 } style={{ marginBottom: '20px' }} color='black'>Are you sure you want to delete the selected user? All Payments and Credits of this User will be gone afterwards!</Typography>
                        <div className='modal-button-wrapper'>
                            <Button color='error' variant='outlined' onClick={ () => setDeleteUserModal(false) }>cancel</Button>
                            <Button variant='contained' onClick={ _deleteUser }>delete</Button>
                        </div>
                        { isDeleteUserLoading && <LinearProgress style={{ marginTop: '7px' }}/> }
                    </div>
                </Modal>
            </div>
        </div>
    )
}

export default Users
