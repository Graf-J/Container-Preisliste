import axios from 'axios';
import URL from './serverURL';

export async function getUsers() {
    try {
        const users = await axios.get(`${URL}/user`, { withCredentials: true });
        return users.data;
    } catch (err) {
        throw new Error('GET Users failed');
    }
}

export async function toggleUserRole(userId) {
    try {
        const user = await axios.get(`${URL}/user/toggleRole/${userId}`, { withCredentials: true });
        return user.data;
    } catch (err) {
        throw new Error('Toggle User Role failed');
    }
}

export async function resetPassword(userId) {
    try {
        const user = await axios.get(`${URL}/user/resetPassword/${userId}`, { withCredentials: true });
        return user.data;
    } catch (err) {
        throw new Error('Reset Password failed');
    }
}

export async function deleteUser(userId) {
    try {
        await axios.delete(`${URL}/user/${userId}`, { withCredentials: true });
    } catch (err) {
        throw new Error('Delete User failed');
    }
}

export async function addUser(userName) {
    try {
        const user = await axios.post(`${URL}/user`, { name: userName }, { withCredentials: true });
        return user.data;
    } catch (err) {
        throw new Error('Add User failed');
    }
}