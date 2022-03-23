const { Router } = require('express');
const { requireUserAuth, requireAdminAuth } = require('../middleware/requireAuth');
const categoryController = require('../controllers/category.controller');

const router = Router();

router.get('/', [requireUserAuth], categoryController.get);

router.post('/', [requireAdminAuth], categoryController.add);

router.put('/:id', [requireAdminAuth], categoryController.update);

router.delete('/:id', [requireAdminAuth], categoryController.delete);

module.exports = router;