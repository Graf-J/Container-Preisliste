const { Router } = require('express');
const { requireUserAuth, requireAdminAuth } = require('../middleware/requireAuth');
const paymentController = require('../controllers/payment.controller');

const router = Router();

router.get('/', [requireUserAuth], paymentController.get);

router.get('/user/:id', [requireAdminAuth], paymentController.getAsAdmin);

router.get('/entries', [requireUserAuth], paymentController.getEntries);

router.get('/entries/:id', [requireAdminAuth], paymentController.getEntriesAsAdmin);

router.post('/', [requireUserAuth], paymentController.add);

router.post('/:id', [requireAdminAuth], paymentController.addAsAdmin);

router.delete('/:id', [requireAdminAuth], paymentController.delete);

module.exports = router;