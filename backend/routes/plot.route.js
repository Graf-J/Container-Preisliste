const { Router } = require('express');
const { requireAdminAuth, requireUserAuth } = require('../middleware/requireAuth');
const plotController = require('../controllers/plot.controller');

const router = Router();

router.get('/categories', [requireUserAuth], plotController.getOwnCategories);

router.get('/categories/:id', [requireAdminAuth], plotController.getUsersCategories);

router.get('/drinks', [requireUserAuth], plotController.getOwnDrinks);

router.get('/drinks/:id', [requireAdminAuth], plotController.getUsersDrinks);

router.get('/weekdaypayment', [requireUserAuth], plotController.getOwnPaymentPerWeekday);

router.get('/weekdaypayment/:id', [requireAdminAuth], plotController.getUsersPaymentPerWeekday);



module.exports = router;