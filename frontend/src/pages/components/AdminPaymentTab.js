import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
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
import { getEntriesCountAsAdmin, getPaymentsAsAdmin, addPaymentAsAdmin, deletePayment } from '../../services/paymentService';
import { getPopularDrinks } from '../../services/drinkService';
import './PaymentTab.css';

const AdminPaymentTab = ({ getTabHeight, user, setUser }) => {

    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isCollectingDrinks, setIsCollectingDrinks] = useState(false);
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
    const [totalPrice, setTotalPrice] = useState(0);
    const [isPlusDisabled, setIsPlusDisabled] = useState(true);
    const [isMinusDisabled, setIsMinusDisabled] = useState(true);

    const { userId } = useParams();

    const toDeletePaymentId = useRef(null);

    useEffect(() => {
        fetchPayments(1)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const fetchPayments = async (page) => {
        setIsLoading(true);

        const height = getTabHeight();
        const entriesCount = await getEntriesCountAsAdmin(userId);
        const stepsize = Math.floor(height / 60);
        const payments = await getPaymentsAsAdmin(userId, stepsize, page);
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
        setUser({ name: user.name, money: money });
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
            const selectedDrink = drinks.filter(drink => drink.id === value.id);
            setTotalPrice(Math.round(drinkAmount * selectedDrink[0].price * 100) / 100);
        } else {
            setDrinkId(null);
            setTotalPrice(0);
            setIsPlusDisabled(true);
            setIsMinusDisabled(true);
        }
    }

    const handlePlusClick = () => {
        setIsMinusDisabled(false);
        const newAmount = drinkAmount + 1
        setDrinkAmount(newAmount);
        const selectedDrink = drinks.filter(drink => drink.id === drinkId);
        setTotalPrice(Math.round(newAmount * selectedDrink[0].price * 100) / 100);
    }

    const handleMinusClick = () => {
        if (drinkAmount <= 2) setIsMinusDisabled(true);
        const newAmount = drinkAmount - 1;
        setDrinkAmount(newAmount);
        const selectedDrink = drinks.filter(drink => drink.id === drinkId);
        setTotalPrice(Math.round(newAmount * selectedDrink[0].price * 100) / 100)
    }

    const onAddPaymentModalClose = () => {
        setDrinkAmount(1);
        setDrinkId(null);
        setIsPlusDisabled(true);
        setIsMinusDisabled(true);
        setIsAddPaymentModalOpen(false);
        setTotalPrice(0);
    }

    const handleCreatePaymentClick = async () => {
        try {
            const did = drinkId;
            const damount = drinkAmount;

            onAddPaymentModalClose()
            setIsLoading(true);

            const money = await addPaymentAsAdmin(userId, { amount: damount, drinkId: did });
            setUser({ name: user.name, money: money });

            await fetchPayments(page);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className='paymenttab'>
            { isLoading ?
            <CircularProgress size={ 100 } style={{ marginTop: '100px' }} /> :
            <>
                <div className='payment-list'>
                    { payments.map(payment => (
                        <div key={ payment.id } className='payment-entry'>
                            <div className='payment-entry-delete-wrapper'>
                                { isDeleting && isDeleting === payment.id ? 
                                <CircularProgress /> :
                                <IconButton color="error" onClick={ () => handleDeleteClick(payment.id) }>
                                    <DeleteIcon />
                                </IconButton> }
                            </div>
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
                <IconButton color="primary" size='large' style={{ position: 'absolute', bottom: '10%', right: '7%' }} onClick={ handleAddPaymentClick }>
                    <AddIcon fontSize='large'/>
                </IconButton> }
                <IconButton color="primary" size='large' style={{ position: 'absolute', bottom: '10%', left: '7%' }} onClick={ handleRefresh }>
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
						renderInput={ params => <TextField error={ false } {...params} label='Drink'/> }
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
                    <Typography fontSize={ 25 } style={{ marginTop: '20px' }}>Total Price: { totalPrice } €</Typography>
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
                    <Typography fontSize={20} style={{ marginBottom: '20px' }}>You are about to delete this Payment.</Typography>
                    <div className='modal-button-wrapper'>
						<Button color='error' variant='outlined' onClick={ () => setIsDeletePaymentModalOpen(false) }>cancel</Button>
						<Button variant='contained' onClick={ handleDelete }>delete</Button>
					</div>
				</div>
			</Modal>
        </div>
    )
}

export default AdminPaymentTab;