import axios from 'axios';
import URL from './serverURL';

export async function getDrinks() {
    try {
        const drinks = await axios.get(`${URL}/drink`, { withCredentials: true });
        return drinks.data;
    } catch (err) {
        throw new Error('GET Drinks failed');
    }
}

export async function addDrink(drink) {
    try {
        const newDrink = await axios.post(`${URL}/drink`, { name: drink.name, price: drink.price, drinkCategoryId: drink.drinkCategoryId }, { withCredentials: true });
        return newDrink.data;
    } catch (err) {
        throw new Error('Add Drink failed');
    }
}

export async function updateDrink(drinkId, drink) {
    console.log(drink);
    try {
        const newDrink = await axios.put(`${URL}/drink/${drinkId}`, { name: drink.name, price: drink.price, drinkCategoryId: drink.drinkCategoryId }, { withCredentials: true });
        return newDrink.data;
    } catch (err) {
        throw new Error('Update Drink failed');
    }
}

export async function deleteDrink(drinkId) {
    try {
        await axios.delete(`${URL}/drink/${drinkId}`, { withCredentials: true });
    } catch {
        throw new Error('Delete Drink failed');
    }
}