const { Router } = require('express');
const { requireAdminAuth } = require('../middleware/requireAuth');
const userController = require('../controllers/user.controller');

const router = Router();

router.post('/', [requireAdminAuth], userController.add);

module.exports = router;