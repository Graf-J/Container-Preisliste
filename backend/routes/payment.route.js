const { Router } = require('express');
const { requireUserAuth, requireAdminAuth } = require('../middleware/requireAuth');
const paymentController = require('../controllers/payment.controller');

const router = Router();

router.get('/', [requireUserAuth], paymentController.get);

router.get('/entries', [requireUserAuth], paymentController.getEntries)

router.post('/', [requireUserAuth], paymentController.add);

router.delete('/:id', [requireAdminAuth], paymentController.delete);

module.exports = router;