const { Router } = require('express');
const { requireAdminAuthSession, requireUserAuthSession } = require('../middleware/requireAuthSession');
const { requireUserAuth, requireAdminAuth } = require('../middleware/requireAuth');
const creditController = require('../controllers/credit.controller');

const router = Router();

router.get('/self', [requireUserAuthSession], creditController.getOwnCredits);

router.get('/user/:id', [requireAdminAuthSession], creditController.getUserCredits);

router.get('/entries', [requireUserAuthSession], creditController.getEntries);

router.get('/entries/:id', [requireAdminAuthSession], creditController.getEntriesAsAdmin);

router.post('/', [requireAdminAuthSession], creditController.add);

router.delete('/:id', [requireAdminAuthSession], creditController.delete);

module.exports = router;