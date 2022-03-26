import axios from 'axios';
import URL from './serverURL';

export async function getPopularCategories() {
    try {
        const token = sessionStorage.getItem('jwt');
        const result = await axios.get(`${URL}/plot/categories`, { withCredentials: true, headers: {
            Authorization: 'Bearer ' + token
        } });
        return result.data;
    } catch (err) {
        throw new Error('GET Popular Categories failed');
    }
}

export async function getPopularCategoriesAsAdmin(userId) {
    try {
        const token = sessionStorage.getItem('jwt');
        const result = await axios.get(`${URL}/plot/categories/${userId}`, { withCredentials: true, headers: {
            Authorization: 'Bearer ' + token
        } });
        return result.data;
    } catch (err) {
        throw new Error('GET Popular Categories failed');
    }
}

export async function getPopularDrinks() {
    try {
        const token = sessionStorage.getItem('jwt');
        const result = await axios.get(`${URL}/plot/drinks`, { withCredentials: true, headers: {
            Authorization: 'Bearer ' + token
        } });
        return result.data;
    } catch (err) {
        throw new Error('GET Popular Drinks failed');
    }
}

export async function getPopularDrinksAsAdmin(userId) {
    try {
        const token = sessionStorage.getItem('jwt');
        const result = await axios.get(`${URL}/plot/drinks/${userId}`, { withCredentials: true, headers: {
            Authorization: 'Bearer ' + token
        } });
        return result.data;
    } catch (err) {
        throw new Error('GET Popular Drinks failed');
    }
}

export async function getPaymentPerWeekday() {
    try {
        const token = sessionStorage.getItem('jwt');
        const result = await axios.get(`${URL}/plot/weekdaypayment`, { withCredentials: true, headers: {
            Authorization: 'Bearer ' + token
        } });
        return result.data;
    } catch (err) {
        throw new Error('GET WeekdayPayment failed');
    }
}

export async function getPaymentPerWeekdayAsAdmin(userId) {
    try {
        const token = sessionStorage.getItem('jwt');
        const result = await axios.get(`${URL}/plot/weekdaypayment/${userId}`, { withCredentials: true, headers: {
            Authorization: 'Bearer ' + token
        } });
        return result.data;
    } catch (err) {
        throw new Error('GET WeekdayPayment failed');
    }
}