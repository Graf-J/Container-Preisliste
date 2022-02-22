const { Router } = require('express');
const { requireAdminAuth } = require('../middleware/requireAuth');
const userController = require('../controllers/user.controller');

const router = Router();

router.get('/', [requireAdminAuth], userController.get)

router.post('/', [requireAdminAuth], userController.add);

router.get('/toggleRole/:id', [requireAdminAuth], userController.toggleRole);

router.get('/resetPassword/:id', [requireAdminAuth], userController.resetPassword);

router.delete('/:id', [requireAdminAuth], userController.delete);

module.exports = router;