import axios from 'axios';
import URL from './serverURL';

export async function login(name, password) {
    try {
        const response = await axios.post(`${URL}/auth/login`, { name, password }, { withCredentials: true });
        return response.data;
    } catch (err) {
        const error = String(err);
        if (error.includes('404')) {
            throw new Error('User doesnt exist');
        } else {
            throw new Error('Login failed');
        }
    }
}

export async function logout() {
    await axios.get(`${URL}/auth/logout`, { withCredentials: true });
}

export async function signup(name, password) {
    try {
        const response = await axios.post(`${URL}/auth/signup`, { name, password }, { withCredentials: true });
        return response.data;
    } catch (err) {
        const error = String(err);
        if (error.includes('404')) {
            throw new Error('User doesnt exist');
        } else if (error.includes('406')) {
            throw new Error('User already signed up');
        } else {
            throw new Error('Signup failed');
        }
    }
}