import { useState, useRef } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PaymentTab from './PaymentTab';
import CreditTab from './CreditTab';
import './MoneyTabsWrapper.css';

const MoneyTabsWrapper = () => {

    const [tab, setTab] = useState(0);

    const paymentRef = useRef();
    const creditRef = useRef();

    const getTabHeight = () => {
        return tab === 0 ? paymentRef.current.offsetHeight : creditRef.current.offsetHeight;
    }

    return (
        <div className='moneytabswrapper'>
            <Tabs value={tab} onChange={ (_, value) => setTab(value) }>
                <Tab label='Payment' style={{ color: 'white' }} />
                <Tab label='Credit' style={{ color: 'white' }} />
            </Tabs>
            <div ref={ paymentRef } role="tabpanel" hidden={tab !== 0} className='tabpanel'>
                <PaymentTab getTabHeight={ getTabHeight } />
            </div>
            <div ref={ creditRef } role="tabpanel" hidden={tab !== 1} className='tabpanel'>
                <CreditTab getTabHeight={ getTabHeight } />
            </div>
        </div>
    )
}

export default MoneyTabsWrapper;