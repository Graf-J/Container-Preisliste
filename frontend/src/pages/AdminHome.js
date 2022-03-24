import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from './components/Header';
import AdminMoneyBar from './components/AdminMoneyBar';
import AdminMoneyTabsWrapper from './components/AdminMoneyTabsWrapper';
import { getUser } from '../services/userService';
import './AdminHome.css';

const AdminHome = () => {

    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState();

    const { userId } = useParams();

    useEffect(() => {
        fetchUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchUser = async () => {
        setIsLoading(true);

        const user = await getUser(userId);
        setUser(user);

        setIsLoading(false);
    }

    return (
        <div className='admin-home'>
            <Header />
            <AdminMoneyBar user={ user } isLoading={ isLoading } fetchUser={ fetchUser } />
            <AdminMoneyTabsWrapper user={ user } setUser={ setUser } />
        </div>
    )
}

export default AdminHome;