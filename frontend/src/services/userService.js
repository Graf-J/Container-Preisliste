import axios from 'axios';
import URL from './serverURL';

export async function getUsers() {
    try {
        const token = sessionStorage.getItem('jwt');
        const users = await axios.get(`${URL}/user`, { withCredentials: true, headers: {
            Authorization: 'Bearer ' + token
        } });
        return users.data;
    } catch (err) {
        throw new Error('GET Users failed');
    }
}

export async function getSelf() {
    try {
        const token = sessionStorage.getItem('jwt');
        const user = await axios.get(`${URL}/user/self`, { withCredentials: true, headers: {
            Authorization: 'Bearer ' + token
        } });
        return { name: user.data.name, money: user.data.money };
    } catch (err) {
        throw new Error('GET Self failed');
    }
}

export async function getUser(userId) {
    try {
        const token = sessionStorage.getItem('jwt');
        const user = await axios.get(`${URL}/user/user/${userId}`, { withCredentials: true, headers: {
            Authorization: 'Bearer ' + token
        } });
        return { name: user.data.name, money: user.data.money };
    } catch (err) {
        throw new Error('GET User failed');
    }
}

export async function toggleUserRole(userId) {
    try {
        const token = sessionStorage.getItem('jwt');
        const user = await axios.get(`${URL}/user/toggleRole/${userId}`, { withCredentials: true, headers: {
            Authorization: 'Bearer ' + token
        } });
        return user.data;
    } catch (err) {
        throw new Error('Toggle User Role failed');
    }
}

export async function resetPassword(userId) {
    try {
        const token = sessionStorage.getItem('jwt');
        const user = await axios.get(`${URL}/user/resetPassword/${userId}`, { withCredentials: true, headers: {
            Authorization: 'Bearer ' + token
        } });
        return user.data;
    } catch (err) {
        throw new Error('Reset Password failed');
    }
}

export async function deleteUser(userId) {
    try {
        const token = sessionStorage.getItem('jwt');
        await axios.delete(`${URL}/user/${userId}`, { withCredentials: true, headers: {
            Authorization: 'Bearer ' + token
        } });
    } catch (err) {
        throw new Error('Delete User failed');
    }
}

export async function addUser(userName) {
    try {
        const token = sessionStorage.getItem('jwt');
        const user = await axios.post(`${URL}/user`, { name: userName }, { withCredentials: true, headers: {
            Authorization: 'Bearer ' + token
        } });
        return user.data;
    } catch (err) {
        throw new Error('Add User failed');
    }
}