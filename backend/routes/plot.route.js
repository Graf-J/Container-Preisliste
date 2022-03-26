const { Router } = require('express');
const { requireAdminAuthSession, requireUserAuthSession } = require('../middleware/requireAuthSession');
const { requireAdminAuth, requireUserAuth } = require('../middleware/requireAuth');
const plotController = require('../controllers/plot.controller');

const router = Router();

router.get('/categories', [requireUserAuthSession], plotController.getOwnCategories);

router.get('/categories/:id', [requireAdminAuthSession], plotController.getUsersCategories);

router.get('/drinks', [requireUserAuthSession], plotController.getOwnDrinks);

router.get('/drinks/:id', [requireAdminAuthSession], plotController.getUsersDrinks);

router.get('/weekdaypayment', [requireUserAuthSession], plotController.getOwnPaymentPerWeekday);

router.get('/weekdaypayment/:id', [requireAdminAuthSession], plotController.getUsersPaymentPerWeekday);



module.exports = router;