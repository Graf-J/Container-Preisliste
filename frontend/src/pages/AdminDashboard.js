import { useRef, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, Legend, BarElement, LinearScale, CategoryScale, Tooltip } from 'chart.js';
import { Pie, Doughnut, Bar } from 'react-chartjs-2';
import CircularProgress from '@mui/material/CircularProgress';
import Header from './components/Header';
import { getPopularCategoriesAsAdmin, getPopularDrinksAsAdmin, getPaymentPerWeekdayAsAdmin } from '../services/plotService';
import './Dashboard.css';

ChartJS.register(ArcElement, Legend, CategoryScale, LinearScale, BarElement);

const colors = ['#e6194B', '#f58231', '#ffe119', '#bfef45', '#3cb44b', '#42d4f4', '#4363d8', '#911eb4', '#f032e6'];

const weekDayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const AdminDashboard = () => {

    const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
    const [isDrinksLoading, setIsDrinksLoading] = useState(true);
    const [isPaymentPerWeekdayLoading, setIsPaymentPerWeekdayLoading] = useState(true);

    const [categoryData, setCategoryData] = useState();
    const [drinkData, setDrinkData] = useState();
    const [paymentPerWeekdayData, setPaymentPerWeekdayData] = useState();

    const [dashboardSectionWidth, setDashboardSectionWidth] = useState(0);

    const dashboardWrapperRef = useRef();

    const { userId } = useParams();

    useEffect(() => {
        const width = dashboardWrapperRef.current.offsetWidth;
        setDashboardSectionWidth(Math.round(width * 0.85));
        fetchData();
    }, [])

    const fetchData = async () => {
        await fetchDrinkData();
        setIsDrinksLoading(false);
        await fetchPaymentPerWeekdayData();
        setIsPaymentPerWeekdayLoading(false);
        await fetchCategoryData();
        setIsCategoriesLoading(false);
    }

    const fetchCategoryData = async () => {
        const categories = await getPopularCategoriesAsAdmin(userId);
        let data = { labels: [], datasets: [{ data: [], backgroundColor: [], borderColor: [], borderWidth: 1 }] }
        categories.forEach((category, idx) => {
            data.labels.push(category.name);
            data.datasets[0].data.push(category.total);
            data.datasets[0].backgroundColor.push(colors[idx % 9]);
            data.datasets[0].borderColor.push(colors[idx % 9]);
        })
        setCategoryData(data);
    }

    const fetchDrinkData = async () => {
        const drinks = await getPopularDrinksAsAdmin(userId);
        let data = { labels: [], datasets: [{ data: [], backgroundColor: [], borderColor: [], borderWidth: 1 }] }
        drinks.forEach((drink, idx) => {
            data.labels.push(drink.name);
            data.datasets[0].data.push(drink.total);
            data.datasets[0].backgroundColor.push(colors[idx % 9]);
            data.datasets[0].borderColor.push(colors[idx % 9]);
        })
        setDrinkData(data);
    }

    const fetchPaymentPerWeekdayData = async () => {
        const paymentsPerWeekday = await getPaymentPerWeekdayAsAdmin(userId);
        let data = { labels: weekDayLabels, datasets: [{ label: 'Payment per Weekday', backgroundColor: [colors[0], colors[1], colors[2], colors[3], colors[4], colors[5], colors[6]] }]}
        let barDataSet = [0, 0, 0, 0, 0, 0, 0];
        paymentsPerWeekday.forEach(payment => {
            barDataSet[payment.weekday - 1] = payment.total;
        })
        data.datasets[0].data = barDataSet;
        setPaymentPerWeekdayData(data);
    }

    const dashboardCircularSectionStyle = {
        background: '#e3e3e3',
        width: dashboardSectionWidth,
        height: dashboardSectionWidth,
        border: '1px solid #e7e7e7',
        borderRadius: '8px',
        marginTop: '10px',
        boxShadow: 'rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '10px'
    }

    const dashboardBarSectionStyle = {
        background: '#e3e3e3',
        width: dashboardSectionWidth,
        height: dashboardSectionWidth / 1.7,
        border: '1px solid #e7e7e7',
        borderRadius: '8px',
        marginTop: '10px',
        boxShadow: 'rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '10px'
    }

    return (
            <div className='admin-dashboard'>
                <Header />
                <div className='dashboard-body'>
                    <div ref={dashboardWrapperRef} className='dashboard-wrapper'>
                        <div style={dashboardCircularSectionStyle}>
                            { isDrinksLoading && <CircularProgress size={70} /> }
                            { drinkData && <Pie data={drinkData}/> }
                        </div>
                        <div style={dashboardBarSectionStyle}>
                            { isPaymentPerWeekdayLoading && <CircularProgress size={70} /> }
                            { paymentPerWeekdayData && <Bar data={paymentPerWeekdayData} /> }
                        </div>
                        <div style={dashboardCircularSectionStyle}>
                            { isCategoriesLoading && <CircularProgress size={70} /> }
                            { categoryData && <Doughnut data={categoryData}/> }
                        </div>
                    </div>
                </div>
            </div>
    )
}

export default AdminDashboard;