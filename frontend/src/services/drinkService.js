import axios from 'axios';
import URL from './serverURL';

export async function getDrinks() {
    try {
        const token = sessionStorage.getItem('jwt');
        const drinks = await axios.get(`${URL}/drink`, { withCredentials: true, headers: {
            Authorization: 'Bearer ' + token
        } });
        return drinks.data;
    } catch (err) {
        throw new Error('GET Drinks failed');
    }
}

export async function getPopularDrinks() {
    try {
        const token = sessionStorage.getItem('jwt');
        const drinks = await axios.get(`${URL}/drink/popular`, { withCredentials: true, headers: {
            Authorization: 'Bearer ' + token
        } });
        return drinks.data;
    } catch (err) {
        throw new Error('GET Drinks failed');
    }
}

export async function addDrink(drink) {
    try {
        const token = sessionStorage.getItem('jwt');
        const newDrink = await axios.post(`${URL}/drink`, { name: drink.name, price: drink.price, categoryId: drink.categoryId }, { withCredentials: true, headers: {
            Authorization: 'Bearer ' + token
        } });
        return newDrink.data;
    } catch (err) {
        throw new Error('Add Drink failed');
    }
}

export async function updateDrink(drinkId, drink) {
    try {
        const token = sessionStorage.getItem('jwt');
        const newDrink = await axios.put(`${URL}/drink/${drinkId}`, { name: drink.name, price: drink.price, categoryId: drink.categoryId }, { withCredentials: true, headers: {
            Authorization: 'Bearer ' + token
        } });
        return newDrink.data;
    } catch (err) {
        throw new Error('Update Drink failed');
    }
}

export async function deleteDrink(drinkId) {
    try {
        const token = sessionStorage.getItem('jwt');
        await axios.delete(`${URL}/drink/${drinkId}`, { withCredentials: true, headers: {
            Authorization: 'Bearer ' + token
        } });
    } catch {
        throw new Error('Delete Drink failed');
    }
}