import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { set } from '../redux/user';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { login } from '../services/authService';
import './Login.css';

const Login = () => {
    const [name, setName] = useState();
    const [password, setPassword] = useState();
    const [loginStatus, setLoginStatus] = useState({
        wrongPassword: false,
        unknownUser: false,
        passwordMessage: '',
        userMessage: ''
    });

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const onLogin = async () => {
        try {
            const user = await login(name, password);
            dispatch(set(user));
            navigate('../');
        } catch (err) {
            if (err.message === 'User doesnt exist') {
                setLoginStatus({ wrongPassword: false, unknownUser: true, passwordMessage: '', userMessage: 'User does not exist. Contact Admin.' });
            } else {
                setLoginStatus({ wrongPassword: true, unknownUser: true, passwordMessage: 'Authentcation failed', useMessage: '' });
            }
        }
    }

    const onSignup = () => {
        navigate('../signup');
    }

    return (
        <div className='login'>
            <form className='login-form'>
                <Typography variant="h5">Login</Typography>
                <TextField
                    onChange={ e => setName(e.target.value) }
                    className="login-form-input"
                    error={ loginStatus.unknownUser }
                    label="Name"
                    helperText={ loginStatus.userMessage }
                />
                <TextField
                    onChange={ e => setPassword(e.target.value) }
                    autoComplete='on'
                    type='password'
                    className="login-form-input"
                    error={ loginStatus.wrongPassword }
                    label="Password"
                    helperText={ loginStatus.passwordMessage }
                />
                <div className="login-button-wrapper">
                    <Button variant="outlined" className="login-form-button" onClick={ onSignup }>Sign up</Button>
                    <Button variant="contained" className="login-form-button" onClick={ onLogin }>Log in</Button>
                </div>
            </form>
        </div>
    )
}

export default Login
