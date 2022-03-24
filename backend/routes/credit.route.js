const { Router } = require('express');
const { requireUserAuth, requireAdminAuth } = require('../middleware/requireAuth');
const creditController = require('../controllers/credit.controller');

const router = Router();

router.get('/self', [requireUserAuth], creditController.getOwnCredits);

router.get('/user/:id', [requireAdminAuth], creditController.getUserCredits);

router.get('/entries', [requireUserAuth], creditController.getEntries);

router.post('/', [requireAdminAuth], creditController.add);

router.delete('/:id', [requireAdminAuth], creditController.delete);

module.exports = router;