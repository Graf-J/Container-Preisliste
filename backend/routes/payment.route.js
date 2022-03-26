const { Router } = require('express');
const { requireAdminAuthSession, requireUserAuthSession } = require('../middleware/requireAuthSession');
const { requireUserAuth, requireAdminAuth } = require('../middleware/requireAuth');
const paymentController = require('../controllers/payment.controller');

const router = Router();

router.get('/', [requireUserAuthSession], paymentController.get);

router.get('/user/:id', [requireAdminAuthSession], paymentController.getAsAdmin);

router.get('/entries', [requireUserAuthSession], paymentController.getEntries);

router.get('/entries/:id', [requireAdminAuthSession], paymentController.getEntriesAsAdmin);

router.post('/', [requireUserAuthSession], paymentController.add);

router.post('/:id', [requireAdminAuthSession], paymentController.addAsAdmin);

router.delete('/:id', [requireAdminAuthSession], paymentController.delete);

module.exports = router;