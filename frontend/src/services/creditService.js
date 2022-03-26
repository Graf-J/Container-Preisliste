import axios from 'axios';
import URL from './serverURL';

export async function getOwnCredits(stepsize, page) {
    try {
        const token = sessionStorage.getItem('jwt');
        const credits = await axios.get(`${URL}/credit/self?stepsize=${stepsize}&page=${page}`, { withCredentials: true, headers: {
            Authorization: 'Bearer ' + token
        } });
        return credits.data;
    } catch (err) {
        throw new Error('GET Credits failed');
    }
}

export async function getUserCredits(userId, stepsize, page) {
    try {
        const token = sessionStorage.getItem('jwt');
        const credits = await axios.get(`${URL}/credit/user/${ userId }?stepsize=${stepsize}&page=${page}`, { withCredentials: true, headers: {
            Authorization: 'Bearer ' + token
        } });
        return credits.data;
    } catch (err) {
        throw new Error('GET Credits failed');
    }
}

export async function getEntriesCount() {
    try {
        const token = sessionStorage.getItem('jwt');
        const entriesCount = await axios.get(`${URL}/credit/entries`, { withCredentials: true, headers: {
            Authorization: 'Bearer ' + token
        } });
        return entriesCount.data.count;
    } catch (err) {
        throw new Error('GET EntriesCount failed');
    }
}

export async function getEntriesCountAsAdmin(userId) {
    try {
        const token = sessionStorage.getItem('jwt');
        const entriesCount = await axios.get(`${URL}/credit/entries/${userId}`, { withCredentials: true, headers: {
            Authorization: 'Bearer ' + token
        } });
        return entriesCount.data.count;
    } catch (err) {
        throw new Error('GET EntriesCount failed');
    }
}

export async function addCredit(credit) {
    try {
        const token = sessionStorage.getItem('jwt');
        const result = await axios.post(`${URL}/credit`, { money: credit.money, userId: credit.userId }, { withCredentials: true, headers: {
            Authorization: 'Bearer ' + token
        } });
        return result.data.money;
    } catch (err) {
        throw new Error('Add Credit failed');
    }
}

export async function deleteCredit(id) {
    try {
        const token = sessionStorage.getItem('jwt');
        const result = await axios.delete(`${URL}/credit/${ id }`, { withCredentials: true, headers: {
            Authorization: 'Bearer ' + token
        } });
        return result.data.money;
    } catch (err) {
        throw new Error('DELETE Credit failed');
    }
}