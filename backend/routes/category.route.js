const { Router } = require('express');
const { requireAdminAuthSession, requireUserAuthSession } = require('../middleware/requireAuthSession');
const { requireUserAuth, requireAdminAuth } = require('../middleware/requireAuth');
const categoryController = require('../controllers/category.controller');

const router = Router();

router.get('/', [requireUserAuthSession], categoryController.get);

router.post('/', [requireAdminAuthSession], categoryController.add);

router.put('/:id', [requireAdminAuthSession], categoryController.update);

router.delete('/:id', [requireAdminAuthSession], categoryController.delete);

module.exports = router;