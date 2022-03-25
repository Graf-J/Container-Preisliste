const { Router } = require('express');
const { requireUserAuth, requireAdminAuth } = require('../middleware/requireAuth');
const drinkController = require('../controllers/drink.controller');

const router = Router();

router.get('/', [requireUserAuth], drinkController.get);

router.get('/popular', [requireUserAuth], drinkController.getPopularDrinks);

router.post('/', [requireAdminAuth], drinkController.add);

router.put('/:id', [requireAdminAuth], drinkController.update);

router.delete('/:id', [requireAdminAuth], drinkController.delete);

module.exports = router;