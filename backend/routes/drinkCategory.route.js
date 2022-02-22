const { Router } = require('express');
const { requireUserAuth, requireAdminAuth } = require('../middleware/requireAuth');
const drinkCategoryController = require('../controllers/drinkCategory.controller');

const router = Router();

router.get('/', [requireUserAuth], drinkCategoryController.get);

router.post('/', [requireAdminAuth], drinkCategoryController.add);

router.put('/:id', [requireAdminAuth], drinkCategoryController.update);

router.delete('/:id', [requireAdminAuth], drinkCategoryController.delete);

module.exports = router;