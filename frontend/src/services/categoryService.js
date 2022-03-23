import axios from 'axios';
import URL from './serverURL';

export async function getCategories() {
    try {
        const categories = await axios.get(`${URL}/category`, { withCredentials: true });
        return categories.data;
    } catch (err) {
        throw new Error('GET DrinkCategory failed');
    }
}

export async function addCategory(category) {
    try {
        const newCategory = await axios.post(`${URL}/category`, { name: category.name }, { withCredentials: true });
        return newCategory.data;
    } catch (err) {
        throw new Error('Add Drink failed');
    }
}

export async function updateCategory(categoryId, category) {
    try {
        const newCategory = await axios.put(`${URL}/category/${categoryId}`, { name: category.name }, { withCredentials: true });
        return newCategory.data;
    } catch (err) {
        throw new Error('Update Drink failed');
    }
}

export async function deleteCategory(categoryId) {
    try {
        await axios.delete(`${URL}/category/${categoryId}`, { withCredentials: true });
    } catch {
        throw new Error('Delete Drink failed');
    }
}