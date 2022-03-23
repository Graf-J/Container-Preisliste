import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { set } from '../../redux/user'
import { Typography } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import { getSelf } from '../../services/userService';
import './MoneyBar.css';

const MoneyBar = () => {

    const [isLoading, setIsLoading] = useState(true);
    const [moneyLabelColor, setMoneyLabelColor] = useState('#000');

    const { user } = useSelector(state => state.user);

    const dispatch = useDispatch()

    useEffect(() => {
        async function setUserInfo() {
            if (user.name == null || user.money == null) {
                await fetchUserData();
            } else {
                setLabelColor(user.money);
            }
        }
    
        setUserInfo();
        setIsLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user.money])

    const fetchUserData = async () => {
        setIsLoading(true);

        const { name, money } = await getSelf();
        dispatch(set({ name: name, money: money, jwt: user.jwt }));
            
        setLabelColor(money);

        setIsLoading(false);
    }

    const setLabelColor = (money) => {
        if (money < 0) {
            setMoneyLabelColor('#eb4034');
        } else {
            setMoneyLabelColor('#34eb5f');
        }
    }

    let moneyLabel = {
        background: moneyLabelColor,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2px 10px',
        borderRadius: '5px'
    }

    return (
        <div className='moneybar-wrapper'>
            { isLoading ? 
            <div className='moneybar-pg-wrapper'>
                <LinearProgress />
            </div> :
            <div className='moneybar'>
                <Typography fontSize={ 25 }>{ user.name }</Typography>
                <div style={ moneyLabel } onClick={ fetchUserData }>
                    <Typography fontSize={ 20 } color='black'>{ Math.round(user.money * 100) / 100 } €</Typography>
                </div>
            </div> }
        </div>
    )
}

export default MoneyBar;