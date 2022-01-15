import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { set } from '../redux/user';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { signup } from '../services/authService';
import './Login.css';

const Signup = () => {
    const [name, setName] = useState();
    const [password, setPassword] = useState();
    const [secondaryPassword, setSecondaryPassword] = useState();
    const [signupStatus, setSignupStatus] = useState({
        unknownUser: false,
        wrongPassword: false,
        wrongSecondaryPassword: false,
        userMessage: '',
        secondaryPasswordMessage: ''
    });

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const onLogin = () => {
        navigate('../login');
    }

    const onSignup = async () => {
        try {
            if (!(password === secondaryPassword)) {
                setSignupStatus({ unknownUser: false, wrongPassword: true, wrongSecondaryPassword: true, userMessage: '', secondaryPasswordMessage: 'Passwords are different'});
                return;
            }
            const user = await signup(name, password);
            dispatch(set(user));
            navigate('../');
        } catch (err) {
            if (err.message === 'User doesnt exist') {
                setSignupStatus({ unknownUser: true, wrongPassword: false, wrongSecondaryPassword: false, userMessage: 'User does not exist. Contact Admin.', secondaryPasswordMessage: ''});
            } else if (err.message === 'User already signed up') {
                setSignupStatus({ unknownUser: true, wrongPassword: false, wrongSecondaryPassword: false, userMessage: 'User already signed up.', secondaryPasswordMessage: ''});
            } else {
                setSignupStatus({ unknownUser: true, wrongPassword: true, wrongSecondaryPassword: true, userMessage: '', secondaryPasswordMessage: 'Signup failed'});
            }
        }
    }

    return (
        <div className='login'>
            <form className='login-form'>
                <Typography variant="h5">Signup</Typography>
                <TextField
                    onChange={ e => setName(e.target.value) }
                    className="login-form-input"
                    error={ signupStatus.unknownUser }
                    label="Name"
                    helperText={ signupStatus.userMessage }
                />
                <TextField
                    onChange={ e => setPassword(e.target.value) }
                    autoComplete='on'
                    type='password'
                    className="login-form-input"
                    error={ signupStatus.wrongPassword }
                    label="Password"
                    helperText={ signupStatus.passwordMessage }
                />
                <TextField
                    onChange={ e => setSecondaryPassword(e.target.value) }
                    autoComplete='on'
                    type='password'
                    className="login-form-input"
                    error={ signupStatus.wrongSecondaryPassword }
                    label="Password*"
                    helperText={ signupStatus.secondaryPasswordMessage }
                />
                <div className="login-button-wrapper">
                    <Button variant="outlined" className="login-form-button" onClick={ onLogin }>Log in</Button>
                    <Button variant="contained" className="login-form-button" onClick={ onSignup }>Sign up</Button>
                </div>
            </form>
        </div>
    )
}

export default Signup