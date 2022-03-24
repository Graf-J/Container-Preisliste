import { useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import './MoneyBar.css';

const AdminMoneyBar = ({ user, isLoading, fetchUser }) => {

    const [moneyLabelColor, setMoneyLabelColor] = useState('#000');

    useEffect(() => {
        if (user) {
            if (user.money < 0) {
                setMoneyLabelColor('#eb4034');
            } else {
                setMoneyLabelColor('#34eb5f');
            }
        }
    }, [user])


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
                <div style={ moneyLabel } onClick={ fetchUser }>
                    <Typography fontSize={ 20 } color='black'>{ Math.round(user.money * 100) / 100 } €</Typography>
                </div>
            </div> }
        </div>
    )
}

export default AdminMoneyBar;