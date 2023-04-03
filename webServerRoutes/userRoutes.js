const express = require('express');

const router = express.Router();
const userController = require('../controllers/userController');

router.post('/signUp', (req, res) => new userController(req, res).addUser());
router.get('/signIn', (req, res) => new userController(req, res).validateUser());
router.get('/validate', (req, res) => new userController(req, res).validateUserSession());

module.exports = router;
