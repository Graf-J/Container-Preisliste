import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { set } from '../../redux/user';
import { Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import IconButton from '@mui/material/IconButton';
import CachedIcon from '@mui/icons-material/Cached';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Pagination from '@mui/material/Pagination';
import Modal from '@mui/material/Modal';
import jwt_decode from 'jwt-decode';
import { getEntriesCount, getPayments, addPayment, deletePayment } from '../../services/paymentService';
import { getPopularDrinks } from '../../services/drinkService';
import './PaymentTab.css';

const PaymentTab = () => {

    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isCollectingDrinks, setIsCollectingDrinks] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [isAddPaymentModalOpen, setIsAddPaymentModalOpen] = useState(false);
    const [isDeletePaymentModalOpen, setIsDeletePaymentModalOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState();
    const [payments, setPayments] = useState();
    const [payment, setPayment] = useState({
        amount: 0,
        category: 'Unknown',
        created_at: 'Unknown',
        creator: 'Unknown',
        drink: 'Unknown',
        price: 0,
        sumprice: 0
    });
    const [drinks, setDrinks] = useState([]);
    const [drinkId, setDrinkId] = useState();
    const [drinkAmount, setDrinkAmount] = useState(1);
    const [isPlusDisabled, setIsPlusDisabled] = useState(true);
    const [isMinusDisabled, setIsMinusDisabled] = useState(true);

    const ref = useRef();
    const toDeletePaymentId = useRef(null);

    const { user } = useSelector(state => state.user);

    const dispatch = useDispatch();

    useEffect(() => {
        if (jwt_decode(user.jwt).role === 'admin') setIsAdmin(true);
        fetchPayments(1)
    }, [])

    const fetchPayments = async (page) => {
        setIsLoading(true);

        const height = ref.current.offsetHeight;
        const entriesCount = await getEntriesCount();
        const stepsize = Math.floor(height / 60);
        const payments = await getPayments(stepsize, page);
        setPageCount(Math.ceil(entriesCount / stepsize));
        setPayments(payments);

        setIsLoading(false);
    }

    const handlePaginationChange = async(_, value) => {
        setPage(value);
        await fetchPayments(value);
    }

    const handleRefresh = async() => {
        setPage(1);
        await fetchPayments(1);
    }

    const handleDeleteClick = (id) => {
        setIsDeletePaymentModalOpen(true);
        toDeletePaymentId.current = id;
    }

    const handleDelete = async() => {
        setIsDeletePaymentModalOpen(false);
        const id = toDeletePaymentId.current;
        setIsDeleting(id);

        const money = await deletePayment(id);
        dispatch(set({ name: user.name, money: money, jwt: user.jwt }));
        let paymentsCopy = [...payments];
        paymentsCopy = paymentsCopy.filter((value) => {
            return value.id !== id;
        })
        setPayments(paymentsCopy);

        setIsDeleting(false);
    }

    const handlePaymentInfoClick = (payment) => {
        setIsInfoModalOpen(true);
        setPayment(payment);
    }

    const handleAddPaymentClick = async () => {
        setIsAddPaymentModalOpen(true)
        setIsCollectingDrinks(true);

        const drinks = await getPopularDrinks();
        setDrinks(drinks);

        setIsCollectingDrinks(false);
    }

    const getLabeledDrinks = () => {
        let labeledDrinks = [];
		drinks.forEach(drink => {
			labeledDrinks.push({ label: drink.name, id: drink.id });
		})
		return labeledDrinks;
    }

    const handleAutocmopleteChange = (_, value) => {
        if (value) {
            setDrinkId(value.id);
            setIsPlusDisabled(false);
            if (drinkAmount > 1) setIsMinusDisabled(false);
        } else {
            setDrinkId(null);
            setIsPlusDisabled(true);
            setIsMinusDisabled(true);
        }
    }

    const handlePlusClick = () => {
        setIsMinusDisabled(false);
        setDrinkAmount(drinkAmount + 1);
    }

    const handleMinusClick = () => {
        if (drinkAmount <= 2) setIsMinusDisabled(true);
        setDrinkAmount(drinkAmount - 1);
    }

    const onAddPaymentModalClose = () => {
        setDrinkAmount(1);
        setDrinkId(null);
        setIsPlusDisabled(true);
        setIsMinusDisabled(true);
        setIsAddPaymentModalOpen(false);
    }

    const handleCreatePaymentClick = async () => {
        try {
            const uid = jwt_decode(user.jwt).id;
            const did = drinkId;
            const damount = drinkAmount;

            onAddPaymentModalClose()
            setIsLoading(true);

            const money = await addPayment({ amount: damount, userId: uid, drinkId: did });
            dispatch(set({ name: user.name, money: money, jwt: user.jwt }));

            await fetchPayments(page);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div ref={ref} className='paymenttab'>
            { isLoading ?
            <CircularProgress size={ 100 } style={{ marginTop: '100px' }} /> :
            <>
                <div className='payment-list'>
                    { payments.map(payment => (
                        <div key={ payment.id } className='payment-entry'>
                            { isAdmin && <div className='payment-entry-delete-wrapper'>
                                { isDeleting && isDeleting === payment.id ? 
                                <CircularProgress /> :
                                <IconButton color="error" onClick={ () => handleDeleteClick(payment.id) }>
                                    <DeleteIcon />
                                </IconButton> }
                            </div> }
                            <div className='payment-entry-info-wrapper' onClick={ () => handlePaymentInfoClick(payment) }>
                                <Typography color='white' fontSize={ 20 } style={{ maxWidth: '180px', marginLeft: '8px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{ payment.amount }x { payment.drink }</Typography>
                                <div className='payment-label'>
                                    <Typography fontSize={ 20 }>{ Math.round(payment.sumprice * 100) / 100 } €</Typography>
                                </div>
                            </div>
                        </div>
                    )) }
                </div>
                { isCollectingDrinks ? 
                <CircularProgress size={30} style={{ position: 'absolute', bottom: '10%', right: '12%' }}/> :
                <IconButton color="primary" size='large' style={{ position: 'absolute', bottom: '8%', right: '7%' }} onClick={ handleAddPaymentClick }>
                    <AddIcon fontSize='large'/>
                </IconButton> }
                <IconButton color="primary" size='large' style={{ position: 'absolute', bottom: '8%', left: '7%' }} onClick={ handleRefresh }>
                    <CachedIcon fontSize='large'/>
                </IconButton>
                <Pagination className='paginator' onChange={ handlePaginationChange } page={ page } count={ pageCount } size='small' color="error" />
            </> }
            <Modal
                    open={ isInfoModalOpen }
                    onClose={ () => setIsInfoModalOpen(false) }
                    className='payment-info-modal'
			>
				{ payment && <div className='payment-info-modal-box'>
                    <Typography fontSize={ 27 } style={{ marginBottom: '20px' }} color='black'>Info:</Typography>
                    <div className='payment-info-model-key-value-wrapper'>
                        <div>
                            <Typography fontSize={18}>Drink:</Typography>
                            { payment.category && <Typography fontSize={18}>Category:</Typography> }
                            <Typography fontSize={18}>Creator:</Typography>
                            <Typography fontSize={18}>Created at:</Typography>
                            <Typography fontSize={18}>Amount:</Typography>
                            <Typography fontSize={18}>Price:</Typography>
                            <Typography fontSize={18}>Total Price:</Typography>
                        </div>
                        <div style={{ paddingLeft: '10px', borderLeft: '2px solid black', maxWidth: '200px' }}>
                            <Typography fontSize={18} style={{ maxWidth: '190px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}><b>{ payment.drink }</b></Typography>
                            { payment.category && <Typography fontSize={18}><b>{ payment.category }</b></Typography> }
                            <Typography fontSize={18}><b>{ payment.creator }</b></Typography>
                            <Typography fontSize={18}><b>{ payment.created_at.substring(0, 10) }</b></Typography>
                            <Typography fontSize={18}><b>{ payment.amount }</b></Typography>
                            <Typography fontSize={18}><b>{ payment.price } €</b></Typography>
                            <Typography fontSize={18}><b>{ Math.round(payment.sumprice * 100) / 100 } €</b></Typography>
                        </div>
                    </div>
                    <Button variant='outlined' style={{ width: '100%', marginTop: '20px' }} color='error' onClick={ () => setIsInfoModalOpen(false) }>go back</Button>
				</div> }
			</Modal>
            <Modal
                    open={ isAddPaymentModalOpen }
                    onClose={ onAddPaymentModalClose }
                    className='add-payment-modal'
			>
				{ isCollectingDrinks ? <></> :
                <div className='add-payment-modal-box'>
                    <Typography fontSize={ 27 } style={{ marginBottom: '20px' }} color='black'>Add Payment:</Typography>
                    <Autocomplete 
						disablePortal
						options={ getLabeledDrinks() }
						sx={{ width: '100%' }}
						isOptionEqualToValue={(option, value) => option.id === value.id}
						onChange={ handleAutocmopleteChange }
						renderInput={ params => <TextField error={ false } {...params} label='Drink'/>}
				    />
                    <div className='add-payment-modal-amount-wrapper'>
                        <IconButton disabled={ isMinusDisabled } color="error" size='large' onClick={ handleMinusClick }>
                            <RemoveIcon fontSize='large'/>
                        </IconButton>
                        <Typography fontSize={ 45 }><b>{ drinkAmount }</b></Typography>
                        <IconButton disabled={ isPlusDisabled } color="primary" size='large' onClick={ handlePlusClick }>
                            <AddIcon fontSize='large'/>
                        </IconButton>
                    </div>
					<div className='modal-button-wrapper'>
						<Button color='error' variant='outlined' onClick={ onAddPaymentModalClose }>cancel</Button>
						<Button disabled={ isPlusDisabled } variant='contained' onClick={ handleCreatePaymentClick }>create</Button>
					</div>
				</div> }
			</Modal>
            <Modal
                    open={ isDeletePaymentModalOpen }
                    onClose={ () => setIsDeletePaymentModalOpen(false) }
                    className='delete-payment-modal'
			>
				<div className='delete-payment-modal-box'>
                    <Typography fontSize={20} style={{ marginBottom: '20px' }}>You are about to delete this payment.</Typography>
                    <div className='modal-button-wrapper'>
						<Button color='error' variant='outlined' onClick={ () => setIsDeletePaymentModalOpen(false) }>cancel</Button>
						<Button variant='contained' onClick={ handleDelete }>delete</Button>
					</div>
				</div>
			</Modal>
        </div>
    )
}

export default PaymentTab;