import axios from 'axios';
import URL from './serverURL';

export async function getDrinkCategories() {
    try {
        const drinkCategories = await axios.get(`${URL}/drinkCategory`, { withCredentials: true });
        return drinkCategories.data;
    } catch (err) {
        throw new Error('GET DrinkCategory failed');
    }
}

export async function addDrinkCategory(drinkCategory) {
    try {
        const newDrinkCategory = await axios.post(`${URL}/drinkCategory`, { name: drinkCategory.name }, { withCredentials: true });
        return newDrinkCategory.data;
    } catch (err) {
        throw new Error('Add Drink failed');
    }
}

export async function updateDrinkCategory(drinkCategoryId, drinkCategory) {
    try {
        const newDrinkCategory = await axios.put(`${URL}/drinkCategory/${drinkCategoryId}`, { name: drinkCategory.name }, { withCredentials: true });
        return newDrinkCategory.data;
    } catch (err) {
        throw new Error('Update Drink failed');
    }
}

export async function deleteDrinkCategory(drinkCategoryId) {
    try {
        await axios.delete(`${URL}/drinkCategory/${drinkCategoryId}`, { withCredentials: true });
    } catch {
        throw new Error('Delete Drink failed');
    }
}