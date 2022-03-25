import axios from 'axios';
import URL from './serverURL';

export async function getPopularCategories() {
    try {
        const result = await axios.get(`${URL}/plot/categories`, { withCredentials: true });
        return result.data;
    } catch (err) {
        throw new Error('GET Popular Categories failed');
    }
}

export async function getPopularCategoriesAsAdmin(userId) {
    try {
        const result = await axios.get(`${URL}/plot/categories/${userId}`, { withCredentials: true });
        return result.data;
    } catch (err) {
        throw new Error('GET Popular Categories failed');
    }
}

export async function getPopularDrinks() {
    try {
        const result = await axios.get(`${URL}/plot/drinks`, { withCredentials: true });
        return result.data;
    } catch (err) {
        throw new Error('GET Popular Drinks failed');
    }
}

export async function getPopularDrinksAsAdmin(userId) {
    try {
        const result = await axios.get(`${URL}/plot/drinks/${userId}`, { withCredentials: true });
        return result.data;
    } catch (err) {
        throw new Error('GET Popular Drinks failed');
    }
}

export async function getPopularCategories() {
    try {
        const result = await axios.get(`${URL}/plot/weekdaypayment`, { withCredentials: true });
        return result.data;
    } catch (err) {
        throw new Error('GET WeekdayPayment failed');
    }
}

export async function getPopularCategoriesAsAdmin(userId) {
    try {
        const result = await axios.get(`${URL}/plot/weekdaypayment/${userId}`, { withCredentials: true });
        return result.data;
    } catch (err) {
        throw new Error('GET WeekdayPayment failed');
    }
}