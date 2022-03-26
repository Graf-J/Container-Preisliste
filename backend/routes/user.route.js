const { Router } = require('express');
const { requireAdminAuth, requireUserAuth } = require('../middleware/requireAuth');
const { requireAdminAuthSession, requireUserAuthSession } = require('../middleware/requireAuthSession');
const userController = require('../controllers/user.controller');

const router = Router();

router.get('/', [requireAdminAuthSession], userController.get);

router.get('/self', [requireUserAuthSession], userController.getSelf);

router.get('/user/:id', [requireAdminAuthSession], userController.getUser);

router.post('/', [requireAdminAuthSession], userController.add);

router.get('/toggleRole/:id', [requireAdminAuthSession], userController.toggleRole);

router.get('/resetPassword/:id', [requireAdminAuthSession], userController.resetPassword);

router.delete('/:id', [requireAdminAuthSession], userController.delete);

module.exports = router;