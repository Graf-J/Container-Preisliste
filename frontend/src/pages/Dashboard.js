import { height } from '@mui/system';
import { useRef, useEffect, useState } from 'react';
import Header from './components/Header';
import './Dashboard.css';

const Dashboard = () => {

    const [dashboardSectionWidth, setDashboardSectionWidth] = useState(0);

    const dashboardWrapperRef = useRef();

    useEffect(() => {
        const width = dashboardWrapperRef.current.offsetWidth;
        setDashboardSectionWidth(Math.round((width / 2) * 0.85))
    }, [])

    const dashboardSectionStyle = {
        background: '#e3e3e3',
        width: dashboardSectionWidth,
        height: dashboardSectionWidth,
        border: '1px solid #e7e7e7',
        borderRadius: '8px',
        marginTop: '10px',
        boxShadow: 'rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset',
        display: 'flex',
        justifyItems: 'center',
        alignItems: 'center'
    }

    return (
        <div className='dashboard'>
            <Header />
            <div className='dashboard-body'>
                <div ref={dashboardWrapperRef} className='dashboard-wrapper'>
                    <div style={dashboardSectionStyle}>
                        Categories
                    </div>
                    <div style={dashboardSectionStyle}>
                        Drinks
                    </div>
                    <div style={dashboardSectionStyle}>
                        Weekday
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
