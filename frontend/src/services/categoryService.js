import axios from 'axios';
import URL from './serverURL';

export async function getCategories() {
    try {
        const token = sessionStorage.getItem('jwt');
        const categories = await axios.get(`${URL}/category`, { withCredentials: true, headers: {
            Authorization: 'Bearer ' + token
        } });
        return categories.data;
    } catch (err) {
        throw new Error('GET DrinkCategory failed');
    }
}

export async function addCategory(category) {
    try {
        const token = sessionStorage.getItem('jwt');
        const newCategory = await axios.post(`${URL}/category`, { name: category.name }, { withCredentials: true, headers: {
            Authorization: 'Bearer ' + token
        } });
        return newCategory.data;
    } catch (err) {
        throw new Error('Add Drink failed');
    }
}

export async function updateCategory(categoryId, category) {
    try {
        const token = sessionStorage.getItem('jwt');
        const newCategory = await axios.put(`${URL}/category/${categoryId}`, { name: category.name }, { withCredentials: true, headers: {
            Authorization: 'Bearer ' + token
        } });
        return newCategory.data;
    } catch (err) {
        throw new Error('Update Drink failed');
    }
}

export async function deleteCategory(categoryId) {
    try {
        const token = sessionStorage.getItem('jwt');
        await axios.delete(`${URL}/category/${categoryId}`, { withCredentials: true, headers: {
            Authorization: 'Bearer ' + token
        } });
    } catch {
        throw new Error('Delete Drink failed');
    }
}