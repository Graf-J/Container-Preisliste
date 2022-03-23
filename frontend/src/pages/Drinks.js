import { useState, useEffect, useRef } from 'react';
import IconButton from '@mui/material/IconButton';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import Autocomplete from '@mui/material/Autocomplete';
import { Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CachedIcon from '@mui/icons-material/Cached';
import AddIcon from '@mui/icons-material/Add';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Header from './components/Header';
import { getDrinks, addDrink, updateDrink, deleteDrink } from '../services/drinkService';
import { getCategories, addCategory, updateCategory, deleteCategory } from '../services/categoryService';
import './Drinks.css';

const Drinks = () => {

	const [tab, setTab] = useState(0);

	const [drinks, setDrinks] = useState();
	const [drinkCategories, setDrinkCategories] = useState();

	const selectedDrink = useRef(null);
	const selectedDrinkCategory = useRef(null);

	const [deleteDrinkModalOpen, setDeleteDrinkModalOpen] = useState(false);
	const [isDeleteDrinkLoading, setIsDeleteDrinkLoading] = useState(false);
	const [deleteCategoryModalOpen, setdeleteCategoryModalOpen] = useState(false)
	const [isdeleteCategoryLoading, setIsdeleteCategoryLoading] = useState(false);
	
	const [addDrinkModalOpen, setAddDrinkModalOpen] = useState(false);
	const [isAddDrinkLoading, setIsAddDrinkLoading] = useState(false);
	const [addCategoryModalOpen, setaddCategoryModalOpen] = useState(false)
	const [isaddCategoryLoading, setIsaddCategoryLoading] = useState(false);
	
	const [updateDrinkModalOpen, setUpdateDrinkModalOpen] = useState(false);
	const [isUpdateDrinkLoading, setIsUpdateDrinkLoading] = useState(false);
	const [updateCategoryModalOpen, setupdateCategoryModalOpen] = useState(false)
	const [isupdateCategoryLoading, setIsupdateCategoryLoading] = useState(false);

	const [drinkName, setDrinkName] = useState();
	const [drinkPrice, setDrinkPrice] = useState();
	const [categoryId, setCategoryId] = useState();
	const [drinkCategoryName, setDrinkCategoryName] = useState();
	
	const [addDrinkStatus, setAddDrinkStatus] = useState({ 
		name: { error: false, message: '' },
		price: { error: false, message: '' },
		category: { error: false, message: '' }
	})
	const [updateDrinkStatus, setUpdateDrinkStatus] = useState({
		name: { error: false, message: '' },
		price: { error: false, message: '' },
		category: { error: false, message: '' }
	})
	const [addCategoryStatus, setaddCategoryStatus] = useState({
		name: { error: false, message: '' }
	})
	const [updateCategoryStatus, setupdateCategoryStatus] = useState({
		name: { error: false, message: '' }
	})

	useEffect(() => {
		async function getDrinksData() {
            const data = await getDrinks();
            setDrinks(data);
        }

		async function getCategoriesData() {
			const data = await getCategories();
			setDrinkCategories(data);
		}

        getDrinksData();
		getCategoriesData();
	}, [])

	const getLabeledCategories = () => {
		let labeledCategories = [];
		drinkCategories.forEach(categorie => {
			labeledCategories.push({ label: categorie.name, id: categorie.id });
		})
		return labeledCategories;
	}

	const handleDrinksRefreshClick = async () => {
		setDrinks();
		const drinks = await getDrinks();
		setDrinks(drinks);
	}

	const handleDrinkCategoriesRefreshClick = async () => {
		setDrinkCategories();
		const drinkCategories = await getCategories();
		setDrinkCategories(drinkCategories);
	}

	const handleDeleteDrinkClick = (drink) => {
		selectedDrink.current = drink;
		setDeleteDrinkModalOpen(true);
	}

	const handleUpdateDrinkClick = (drink) => {
		selectedDrink.current = drink;
		setDrinkName(drink.name);
		setDrinkPrice(drink.price);
		setCategoryId(null);
		setDrinkCategoryName(null);
		setUpdateDrinkModalOpen(true);
	}

	const onDeleteDrinkClick = async () => {
		setIsDeleteDrinkLoading(true);

		await deleteDrink(selectedDrink.current.id);
		let drinksCopy = [...drinks];
        drinksCopy = drinksCopy.filter((value) => {
            return value.id !== selectedDrink.current.id;
        })
        setDrinks(drinksCopy);

        setDeleteDrinkModalOpen(false);
		setIsDeleteDrinkLoading(false);
	}

	const closeAddDrinkModal = () => {
		setAddDrinkModalOpen(false);
		setAddDrinkStatus({
			price: { error: false, message: '' },
			name: { error: false, message: '' },
			category: { error: false, message: '' }
		});
	}

	const onAddDrinkClick = async () => {
		setIsAddDrinkLoading(true);
		try {
			if (!drinkName) {
				setAddDrinkStatus({
					name: { error: true, message: 'Name is required' },
					price: { error: false, message: '' },
					category: { error: false, message: '' }
				});
				throw new Error('Required Field is missing');
			} else if (!drinkPrice) {
				setAddDrinkStatus({
					name: { error: false, message: '' },
					price: { error: true, message: 'Price is required' },
					category: { error: false, message: '' }
				});
				throw new Error('Required Field is missing');
			}

			const drink = await addDrink({ name: drinkName, price: drinkPrice, categoryId: categoryId });
			setDrinks([drink, ...drinks]);
	
			setDrinkName(null);
			setDrinkPrice(null);
			setCategoryId(null);
	
			closeAddDrinkModal();
		} catch (err) {
			if (!(err.message === 'Required Field is missing')) {
				setAddDrinkStatus({
					price: { error: true, message: '' },
					name: { error: true, message: '' },
					category: { error: true, message: '' }
				});
			}
		}
		setIsAddDrinkLoading(false);
	}

	const closeUpdateDrinkModal = () => {
		setUpdateDrinkModalOpen(false);
		setUpdateDrinkStatus({
			price: { error: false, message: '' },
			name: { error: false, message: '' },
			category: { error: false, message: '' }
		});
	}

	const handleAutocompleteChange = (value) => {
		if (value) {
			setCategoryId(value.id);
			setDrinkCategoryName(value.label);
		} else {
			setCategoryId(null);
			setDrinkCategoryName(null);
		}
	}

	const onUpdateDrinkClick = async () => {
		setIsUpdateDrinkLoading(true);
		try {
			if (!drinkName) {
				setUpdateDrinkStatus({
					name: { error: true, message: 'Name is required' },
					price: { error: false, message: '' },
					category: { error: false, message: '' }
				});
				throw new Error('Required Field is missing');
			} else if (!drinkPrice) {
				setUpdateDrinkStatus({
					name: { error: false, message: '' },
					price: { error: true, message: 'Price is required' },
					category: { error: false, message: '' }
				});
				throw new Error('Required Field is missing');
			}

			const drink = await updateDrink(selectedDrink.current.id, { name: drinkName, price: drinkPrice, categoryId: categoryId });
			let drinksCopy = [...drinks];
			const index = drinksCopy.findIndex(element => element.id === drink.id);
			drinksCopy[index] = drink;
			setDrinks(drinksCopy);
	
			setDrinkName(null);
			setDrinkPrice(null);
			setCategoryId(null);
	
			closeUpdateDrinkModal();
		} catch (err) {
			if (!(err.message === 'Required Field is missing')) {
				setUpdateDrinkStatus({
					price: { error: true, message: '' },
					name: { error: true, message: '' },
					category: { error: true, message: '' }
				});
			}
		}
		setIsUpdateDrinkLoading(false);
	}

	const handledeleteCategoryClick = (drinkCategory) => {
		selectedDrinkCategory.current = drinkCategory;
		setdeleteCategoryModalOpen(true);
	}

	const handleupdateCategoryClick = (drinkCategory) => {
		selectedDrinkCategory.current = drinkCategory;
		setCategoryId(drinkCategory.id)
		setDrinkCategoryName(drinkCategory.name);
		setupdateCategoryModalOpen(true);
	}

	const closeaddCategoryModal = () => {
		setaddCategoryModalOpen(false);
		setaddCategoryStatus ({
			name: { error: false, message: '' }
		});
	}

	const onaddCategoryClick = async () => {
		setIsaddCategoryLoading(true);
		try {
			if (!drinkCategoryName) {
				setaddCategoryStatus({
					name: { error: true, message: 'Name is required' }
				});
				throw new Error('Required Field is missing');
			}

			const drinkCategory = await addCategory({ name: drinkCategoryName });
			setDrinkCategories([drinkCategory, ...drinkCategories]);
	
			setCategoryId(null);
			setDrinkCategoryName(null);
	
			closeaddCategoryModal();
		} catch (err) {
			if (!(err.message === 'Required Field is missing')) {
				setaddCategoryStatus({
					name: { error: true, message: '' }
				});
			}
		}
		setIsaddCategoryLoading(false);
	}

	const closeupdateCategoryModal = () => {
		setupdateCategoryModalOpen(false);
		setupdateCategoryStatus({
			name: { error: false, message: '' }
		});
	}

	const onupdateCategoryClick = async () => {
		setIsupdateCategoryLoading(true);
		try {
			if (!drinkCategoryName) {
				setupdateCategoryStatus({
					name: { error: true, message: 'Name is required' }
				});
				throw new Error('Required Field is missing');
			}

			const drinkCategory = await updateCategory(selectedDrinkCategory.current.id, { name: drinkCategoryName });
			let drinkCategoriesCopy = [...drinkCategories];
			const index = drinkCategoriesCopy.findIndex(element => element.id === drinkCategory.id);
			drinkCategoriesCopy[index] = drinkCategory;
			setDrinkCategories(drinkCategoriesCopy);
			updateDrinkCategoriesOnUpdate(drinkCategory);
	
			setCategoryId(null);
			setDrinkCategoryName(null);
	
			closeupdateCategoryModal();
		} catch (err) {
			if (!(err.message === 'Required Field is missing')) {
				setupdateCategoryStatus({
					name: { error: true, message: '' }
				});
			}
		}
		setIsupdateCategoryLoading(false);
	}

	const updateDrinkCategoriesOnUpdate = (newDrinkCategory) => {
		let drinksCopy = [...drinks];
		drinksCopy.forEach(drink => {
			if (drink.drinkCategory) {
				if (drink.drinkCategory.id === newDrinkCategory.id) {
					drink.drinkCategory.name = newDrinkCategory.name;
				}
			}
		})
		setDrinks(drinksCopy);
	}

	const ondeleteCategoryClick = async () => {
		setIsdeleteCategoryLoading(true);

		await deleteCategory(selectedDrinkCategory.current.id);
		let drinkCategoriesCopy = [...drinkCategories];
        drinkCategoriesCopy = drinkCategoriesCopy.filter((value) => {
            return value.id !== selectedDrinkCategory.current.id;
        })
        setDrinkCategories(drinkCategoriesCopy);
		deleteDrinkCategoriesOnDelete(selectedDrinkCategory.current);

        setdeleteCategoryModalOpen(false);
		setIsdeleteCategoryLoading(false);
	}

	const deleteDrinkCategoriesOnDelete = (deletedDrinkCategory) => {
		let drinksCopy = [...drinks];
		drinksCopy.forEach(drink => {
			if (drink.drinkCategory) {
				if (drink.drinkCategory.id === deletedDrinkCategory.id) {
					drink.drinkCategory = null;
				}
			}
		})
		setDrinks(drinksCopy);
	}
	
  	return (
		<div className='drinks'>
			<Header />
			<div className="drinks-tabs-wrapper">
				<Tabs value={tab} onChange={ (_, value) => setTab(value) }>
					<Tab label='Drinks' style={{ color: 'white' }} />
					<Tab label='Categories' style={{ color: 'white' }} />
				</Tabs>
				<div role="tabpanel" hidden={tab !== 0} className='tabpanel'>
					<div hidden={ tab !== 0 }>
						{ !drinks ? 
						<CircularProgress size={ 100 } style={{ marginLeft: 'calc(50% - 50px)', marginTop: '100px' }} /> :
						<div>
							{ drinks.map(drink => (
								<Accordion key={ drink.id }>
									<AccordionSummary expandIcon={ <ExpandMoreIcon /> } sx={{ backgroundColor: '#282828' }}>
										<Typography color='white' style={{ width: '60%', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{ drink.name }</Typography>
										{ drink.category && 
										<div className='drink-category-label'>
											<Typography>{ drink.category.name }</Typography>
										</div> }
									</AccordionSummary>
									<AccordionDetails sx={{ backgroundColor: '#383838' }} style={{display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
										<div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginBottom: '5px', marginTop: '10px' }}>
											<Typography color='#CCC'>Price:</Typography>
											<Typography color='#CCC'><b>{ drink.price } €</b></Typography>
										</div>
										{ drink.category && <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between'}}>
											<Typography color='#CCC'>Category:</Typography>
											<Typography color='#CCC'><b>{ drink.category.name }</b></Typography>
										</div> }
										<div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
											<Button variant="outlined" color="secondary" onClick={ () => handleUpdateDrinkClick(drink) }>Update</Button>
											<Button variant="contained" color="error" onClick={ () => handleDeleteDrinkClick(drink) }>Delete</Button>
										</div>
									</AccordionDetails>
								</Accordion>
							))}
						</div> }
						<IconButton color="primary" size='large' style={{ position: 'absolute', bottom: '4%', right: '9%' }} onClick={ () => setAddDrinkModalOpen(true) }>
							<AddIcon fontSize='large'/>
						</IconButton>
						<IconButton color="primary" size='large' style={{ position: 'absolute', bottom: '4%', left: '9%' }} onClick={ handleDrinksRefreshClick }>
							<CachedIcon fontSize='large'/>
						</IconButton>
					</div>
				</div>
				<div role="tabpanel" hidden={tab !== 1} className='tabpanel'>
					<div hidden={ tab !== 1 }>
						{ !drinkCategories ? 
						<CircularProgress size={ 100 } style={{ marginLeft: 'calc(50% - 50px)', marginTop: '100px' }} /> :
						<div>
							{ drinkCategories.map(drinkCategory => (
								<Accordion key={ drinkCategory.id }>
									<AccordionSummary expandIcon={ <ExpandMoreIcon /> } sx={{ backgroundColor: '#282828' }}>
										<Typography color='white' style={{ width: '60%', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{ drinkCategory.name }</Typography>
									</AccordionSummary>
									<AccordionDetails sx={{ backgroundColor: '#383838' }} style={{display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
										<div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
											<Button variant="outlined" color="secondary" onClick={ () => handleupdateCategoryClick(drinkCategory) }>Update</Button>
											<Button variant="contained" color="error" onClick={ () => handledeleteCategoryClick(drinkCategory) }>Delete</Button>
										</div>
									</AccordionDetails>
								</Accordion>
							))}
						</div> }
						<IconButton color="primary" size='large' style={{ position: 'absolute', bottom: '4%', right: '9%' }} onClick={ () => setaddCategoryModalOpen(true) }>
							<AddIcon fontSize='large'/>
						</IconButton>
						<IconButton color="primary" size='large' style={{ position: 'absolute', bottom: '4%', left: '9%' }} onClick={ handleDrinkCategoriesRefreshClick }>
							<CachedIcon fontSize='large'/>
						</IconButton>
					</div>
				</div>
			</div>
			<Modal
                    open={ addDrinkModalOpen }
                    onClose={ closeAddDrinkModal }
                    className='add-drink-modal'
			>
				<div className='add-drink-modal-box'>
					<Typography fontSize={ 27 } style={{ marginBottom: '20px' }} color='black'>Add Drink:</Typography>
					<TextField
						onChange={ e => setDrinkName(e.target.value) }
						style={{ width: '100%', marginBottom: '15px' }}
						error={ addDrinkStatus.name.error }
						label="Name"
						helperText={ addDrinkStatus.name.message }
					/>
					<TextField
						onChange={ e => setDrinkPrice(e.target.value) }
						style={{ width: '100%', marginBottom: '15px' }}
						type='number'
						error={ addDrinkStatus.price.error }
						label="Price"
						helperText={ addDrinkStatus.price.message }
					/>
					{ drinkCategories && <Autocomplete 
						disablePortal
						options={ getLabeledCategories() }
						sx={{ width: '100%' }}
						isOptionEqualToValue={(option, value) => option.id === value.id}
						onChange={ (_, value) => value ? setCategoryId(value.id) : setCategoryId(null) }
						renderInput={ params => <TextField error={ addDrinkStatus.category.error } {...params} label='Category'/>}
					/> }
					<div className='modal-button-wrapper'>
						<Button color='error' variant='outlined' onClick={ closeAddDrinkModal }>cancel</Button>
						<Button variant='contained' onClick={ onAddDrinkClick }>create</Button>
					</div>
					{ isAddDrinkLoading && <LinearProgress style={{ marginTop: '7px' }}/> }
				</div>
			</Modal>
			<Modal
                    open={ updateDrinkModalOpen }
                    onClose={ closeUpdateDrinkModal }
                    className='update-drink-modal'
			>
				<div className='update-drink-modal-box'>
					<Typography fontSize={ 27 } style={{ marginBottom: '20px' }} color='black'>Update Drink:</Typography>
					<TextField
						value={ drinkName ? drinkName : '' }
						onChange={ e => setDrinkName(e.target.value) }
						style={{ width: '100%', marginBottom: '15px' }}
						error={ updateDrinkStatus.name.error }
						label="Name"
						helperText={ updateDrinkStatus.name.message }
					/>
					<TextField
						value={ drinkPrice ? drinkPrice : '' }
						onChange={ e => setDrinkPrice(e.target.value) }
						style={{ width: '100%', marginBottom: '15px' }}
						type='number'
						error={ updateDrinkStatus.price.error }
						label="Price"
						helperText={ updateDrinkStatus.price.message }
					/>
					{ drinkCategories && <Autocomplete 
						disablePortal
						options={ getLabeledCategories() }
						sx={{ width: '100%' }}
						isOptionEqualToValue={(option, value) => (option.id === value.id)}
						onChange={ (_, value) => handleAutocompleteChange(value) }
						renderInput={ params => <TextField error={ updateDrinkStatus.category.error } {...params} label='Category'/> }
					/> }
					<div className='modal-button-wrapper'>
						<Button color='error' variant='outlined' onClick={ closeUpdateDrinkModal }>cancel</Button>
						<Button variant='contained' onClick={ onUpdateDrinkClick }>update</Button>
					</div>
					{ isUpdateDrinkLoading && <LinearProgress style={{ marginTop: '7px' }}/> }
				</div>
			</Modal>
			<Modal
                    open={ deleteDrinkModalOpen }
                    onClose={ () => setDeleteDrinkModalOpen(false) }
                    className='delete-drink-modal'
			>
				<div className='delete-drink-modal-box'>
					<Typography fontSize={ 20 } style={{ marginBottom: '20px' }} color='black'>Are you sure you want to delete the drink { selectedDrink.current && selectedDrink.current.name }?</Typography>
					<div className='modal-button-wrapper'>
						<Button color='error' variant='outlined' onClick={ () => setDeleteDrinkModalOpen(false) }>cancel</Button>
						<Button variant='contained' onClick={ onDeleteDrinkClick }>delete</Button>
					</div>
					{ isDeleteDrinkLoading && <LinearProgress style={{ marginTop: '7px' }}/> }
				</div>
			</Modal>
			<Modal
                    open={ addCategoryModalOpen }
                    onClose={ closeaddCategoryModal }
                    className='add-drink-category-modal'
			>
				<div className='add-drink-category-modal-box'>
					<Typography fontSize={ 27 } style={{ marginBottom: '20px' }} color='black'>Add Category:</Typography>
					<TextField
						onChange={ e => setDrinkCategoryName(e.target.value) }
						style={{ width: '100%', marginBottom: '15px' }}
						error={ addCategoryStatus.name.error }
						label="Name"
						helperText={ addCategoryStatus.name.message }
					/>
					<div className='modal-button-wrapper'>
						<Button color='error' variant='outlined' onClick={ closeaddCategoryModal }>cancel</Button>
						<Button variant='contained' onClick={ onaddCategoryClick }>create</Button>
					</div>
					{ isaddCategoryLoading && <LinearProgress style={{ marginTop: '7px' }}/> }
				</div>
			</Modal>
			<Modal
                    open={ updateCategoryModalOpen }
                    onClose={ closeupdateCategoryModal }
                    className='update-drink-category-modal'
			>
				<div className='update-drink-category-modal-box'>
					<Typography fontSize={ 27 } style={{ marginBottom: '20px' }} color='black'>Update Category:</Typography>
					<TextField
						value={ drinkCategoryName ? drinkCategoryName : '' }
						onChange={ e => setDrinkCategoryName(e.target.value) }
						style={{ width: '100%', marginBottom: '15px' }}
						error={ updateCategoryStatus.name.error }
						label="Name"
						helperText={ updateCategoryStatus.name.message }
					/>
					<div className='modal-button-wrapper'>
						<Button color='error' variant='outlined' onClick={ closeupdateCategoryModal }>cancel</Button>
						<Button variant='contained' onClick={ onupdateCategoryClick }>update</Button>
					</div>
					{ isupdateCategoryLoading && <LinearProgress style={{ marginTop: '7px' }}/> }
				</div>
			</Modal>
			<Modal
                    open={ deleteCategoryModalOpen }
                    onClose={ () => setdeleteCategoryModalOpen(false) }
                    className='delete-drink-category-modal'
			>
				<div className='delete-drink-category-modal-box'>
					<Typography fontSize={ 20 } style={{ marginBottom: '20px' }} color='black'>Are you sure you want to delete the category { selectedDrinkCategory.current && selectedDrinkCategory.current.name }?</Typography>
					<div className='modal-button-wrapper'>
						<Button color='error' variant='outlined' onClick={ () => setdeleteCategoryModalOpen(false) }>cancel</Button>
						<Button variant='contained' onClick={ ondeleteCategoryClick }>delete</Button>
					</div>
					{ isdeleteCategoryLoading && <LinearProgress style={{ marginTop: '7px' }}/> }
				</div>
			</Modal>
		</div>
    );
};

export default Drinks;
