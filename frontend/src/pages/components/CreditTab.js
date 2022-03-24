import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { set } from '../../redux/user';
import { Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import CachedIcon from '@mui/icons-material/Cached';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Pagination from '@mui/material/Pagination';
import Modal from '@mui/material/Modal';
import jwt_decode from 'jwt-decode';
import { getEntriesCount, getOwnCredits, deleteCredit, addCredit } from '../../services/creditService';
import './CreditTab.css';

const CreditTab = ({ getTabHeight }) => {

    const [isCreditsLoading, setIsCreditsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [isDeleteCreditModalOpen, setIsDeleteCreditModalOpen] = useState(false);
    const [isAddCreditModalOpen, setIsAddCreditModalOpen] = useState(false);

    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState();

    const [addCreditError, setAddCreditError] = useState(false);
    const [addCreditHelperText, setAddCreditHelperText] = useState('');

    const [credits, setCredits] = useState();
    const [credit, setCredit] = useState({
        creator: 'Unknown',
        created_at: '0000-00-00',
        money: 0
    });
    const [money, setMoney] = useState(0);

    const toDeleteCreditId = useRef(null);

    const { user } = useSelector(state => state.user);

    const dispatch = useDispatch();

    useEffect(() => {
        if (jwt_decode(user.jwt).role === 'admin') setIsAdmin(true);
        fetchCredits(1);
    }, [])

    const fetchCredits = async () => {
        setIsCreditsLoading(true);

        const height = getTabHeight();
        const entriesCount = await getEntriesCount();
        const stepsize = Math.floor(height / 60);
        const credits = await getOwnCredits(stepsize, page);
        setPageCount(Math.ceil(entriesCount / stepsize));
        setCredits(credits);

        setIsCreditsLoading(false);
    }

    const handleDeleteClick = (id) => {
        setIsDeleteCreditModalOpen(true);
        toDeleteCreditId.current = id;
    }

    const handleDelete = async () => {
        setIsDeleteCreditModalOpen(false);
        const id = toDeleteCreditId.current;
        setIsDeleting(id);

        const money = await deleteCredit(id);
        dispatch(set({ name: user.name, money: money, jwt: user.jwt }));
        let creditsCopy = [...credits];
        creditsCopy = creditsCopy.filter((value) => {
            return value.id !== id;
        })
        setCredits(creditsCopy);

        setIsDeleting(false);
    }

    const handleCreditInfoClick = (credit) => {
        setCredit(credit);
        setIsInfoModalOpen(true);
    }

    const handleRefresh = async () => {
        setPage(1);
        await fetchCredits(1);
    }

    const handlePaginationChange = async(_, value) => {
        setPage(value);
        await fetchCredits(value);
    }

    const onAddCreditModalClose = () => {
        setMoney(0);
        setAddCreditError(false);
        setAddCreditHelperText('');
        setIsAddCreditModalOpen(false);
    }

    const handleCreateCreditClick = async () => {
        if (money < 0.01) {
            setAddCreditError(true);
            setAddCreditHelperText('Money has to be > 0.01 €');
            setMoney(0);
        } else {
            const uid = jwt_decode(user.jwt).id;

            onAddCreditModalClose();
            setIsCreditsLoading(true);

            const updatedMoney = await addCredit({ money: money, userId: uid });
            dispatch(set({ name: user.name, money: updatedMoney, jwt: user.jwt }));
            await fetchCredits(page);
        }
    }

    return (
        <div className='credittab'>
            { isCreditsLoading ?
            <CircularProgress size={ 100 } style={{ marginTop: '100px' }} /> :
            <>
                <div className='credit-list'>
                    { credits.map(credit => (
                        <div key={ credit.id } className='credit-entry'>
                            { isAdmin && <div className='credit-entry-delete-wrapper'>
                                { isDeleting && isDeleting === credit.id ? 
                                <CircularProgress /> :
                                <IconButton color="error" onClick={ () => handleDeleteClick(credit.id) }>
                                    <DeleteIcon />
                                </IconButton> }
                            </div> }
                            <div className='credit-entry-info-wrapper' onClick={ () => handleCreditInfoClick(credit) }>
                                <Typography color='white' fontSize={ 20 } style={{ maxWidth: '180px', marginLeft: '8px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{ credit.name }</Typography>
                                <div className='credit-label'>
                                    <Typography fontSize={ 20 }>{ Math.round(credit.money * 100) / 100 } €</Typography>
                                </div>
                            </div>
                        </div>
                    )) }
                </div>
                { isAdmin ?
                    <IconButton color="primary" size='large' style={{ position: 'absolute', bottom: '8%', right: '7%' }} onClick={ () => setIsAddCreditModalOpen(true) }>
                        <AddIcon fontSize='large'/>
                    </IconButton> : 
                <></> }
                <IconButton color="primary" size='large' style={{ position: 'absolute', bottom: '8%', left: '7%' }} onClick={ handleRefresh }>
                    <CachedIcon fontSize='large'/>
                </IconButton>
                <Pagination className='paginator' onChange={ handlePaginationChange } page={ page } count={ pageCount } size='small' color="success" />
            </> }
            <Modal
                    open={ isInfoModalOpen }
                    onClose={ () => setIsInfoModalOpen(false) }
                    className='credit-info-modal'
			>
				{ credit && <div className='credit-info-modal-box'>
                    <Typography fontSize={ 27 } style={{ marginBottom: '20px' }} color='black'>Info:</Typography>
                    <div className='credit-info-model-key-value-wrapper'>
                        <div>
                            <Typography fontSize={18}>Creator:</Typography>
                            <Typography fontSize={18}>Created at:</Typography>
                            <Typography fontSize={18}>Money:</Typography>
                        </div>
                        <div style={{ paddingLeft: '10px', borderLeft: '2px solid black', maxWidth: '200px' }}>
                            <Typography fontSize={18} style={{ maxWidth: '190px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}><b>{ credit.name }</b></Typography>
                            <Typography fontSize={18}><b>{ credit.created_at.substring(0, 10) }</b></Typography>
                            <Typography fontSize={18}><b>{ Math.round(credit.money * 100) / 100 } €</b></Typography>
                        </div>
                    </div>
                    <Button variant='outlined' style={{ width: '100%', marginTop: '20px' }} color='error' onClick={ () => setIsInfoModalOpen(false) }>go back</Button>
				</div> }
			</Modal>
            <Modal
                    open={ isDeleteCreditModalOpen }
                    onClose={ () => setIsDeleteCreditModalOpen(false) }
                    className='delete-credit-modal'
			>
				<div className='delete-credit-modal-box'>
                    <Typography fontSize={20} style={{ marginBottom: '20px' }}>You are about to delete this Credit.</Typography>
                    <div className='modal-button-wrapper'>
						<Button color='error' variant='outlined' onClick={ () => setIsDeleteCreditModalOpen(false) }>cancel</Button>
						<Button variant='contained' onClick={ handleDelete }>delete</Button>
					</div>
				</div>
			</Modal>
            <Modal
                    open={ isAddCreditModalOpen }
                    onClose={ onAddCreditModalClose }
                    className='add-credit-modal'
                >
                    <div className='add-credit-modal-box'>
                        <Typography fontSize={ 27 } style={{ marginBottom: '20px' }} color='black'>Add Credit:</Typography>
                        <TextField
                            onChange={ e => setMoney(e.target.value) }
                            className="add-credit-input"
                            error={ addCreditError }
                            helperText={ addCreditHelperText }
                            type='number'
                            label="Money in €"
                        />
                        <div className='modal-button-wrapper'>
                            <Button color='error' variant='outlined' onClick={ onAddCreditModalClose }>cancel</Button>
                            <Button variant='contained' onClick={ handleCreateCreditClick }>create</Button>
                        </div>
                    </div>
                </Modal>
        </div>
    )
}

export default CreditTab;