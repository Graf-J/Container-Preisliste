import { useState, useEffect } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PaymentTab from './PaymentTab';
import CreditTab from './CreditTab';
import './MoneyTabsWrapper.css';

const MoneyTabsWrapper = () => {

    const [tab, setTab] = useState(0);

    return (
        <div className='moneytabswrapper'>
            <Tabs value={tab} onChange={ (_, value) => setTab(value) }>
                <Tab label='Payment' style={{ color: 'white' }} />
                <Tab label='Credit' style={{ color: 'white' }} />
            </Tabs>
            <div role="tabpanel" hidden={tab !== 0} className='tabpanel'>
                <PaymentTab />
            </div>
            <div role="tabpanel" hidden={tab !== 1} className='tabpanel'>
                <CreditTab />
            </div>
        </div>
    )
}

export default MoneyTabsWrapper;