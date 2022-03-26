const { Router } = require('express');
const { requireAdminAuthSession, requireUserAuthSession } = require('../middleware/requireAuthSession');
const { requireUserAuth, requireAdminAuth } = require('../middleware/requireAuth');
const drinkController = require('../controllers/drink.controller');

const router = Router();

router.get('/', [requireUserAuthSession], drinkController.get);

router.get('/popular', [requireUserAuthSession], drinkController.getPopularDrinks);

router.post('/', [requireAdminAuthSession], drinkController.add);

router.put('/:id', [requireAdminAuthSession], drinkController.update);

router.delete('/:id', [requireAdminAuthSession], drinkController.delete);

module.exports = router;