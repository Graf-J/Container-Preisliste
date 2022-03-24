import axios from 'axios';
import URL from './serverURL';

export async function getPayments(stepsize, page) {
    try {
        const payments = await axios.get(`${URL}/payment?stepsize=${stepsize}&page=${page}`, { withCredentials: true });
        return payments.data;
    } catch (err) {
        throw new Error('GET Payments failed');
    }
}

export async function getPaymentsAsAdmin(userId, stepsize, page) {
    try {
        const payments = await axios.get(`${URL}/payment/user/${userId}?stepsize=${stepsize}&page=${page}`, { withCredentials: true });
        return payments.data;
    } catch (err) {
        throw new Error('GET Payments failed');
    }
}

export async function getEntriesCount() {
    try {
        const entriesCount = await axios.get(`${URL}/payment/entries`, { withCredentials: true });
        return entriesCount.data.count;
    } catch (err) {
        throw new Error('GET EntriesCount failed');
    }
}

export async function getEntriesCountAsAdmin(userId) {
    try {
        const entriesCount = await axios.get(`${URL}/payment/entries/${userId}`, { withCredentials: true });
        return entriesCount.data.count;
    } catch (err) {
        throw new Error('GET EntriesCount failed');
    }
}

export async function addPayment(payment) {
    try {
        const result = await axios.post(`${URL}/payment`, { amount: payment.amount, drinkId: payment.drinkId }, { withCredentials: true });
        return result.data.money;
    } catch (err) {
        throw new Error('Add Drink failed');
    }
}

export async function addPaymentAsAdmin(userId, payment) {
    try {
        const result = await axios.post(`${URL}/payment/${userId}`, { amount: payment.amount, drinkId: payment.drinkId }, { withCredentials: true });
        return result.data.money;
    } catch (err) {
        throw new Error('Add Drink failed');
    }
}

export async function deletePayment(id) {
    try {
        const result = await axios.delete(`${URL}/payment/${id}`, { withCredentials: true });
        return result.data.money;
    } catch (err) {
        throw new Error('GET EntriesCount failed');
    }
}