const { Router } = require('express');
const authController = require('../controllers/auth.controller');

const router = Router();

router.post('/signup', authController.signup);

router.post('/login', authController.login);

router.get('/logout', authController.logout);

module.exports = router;