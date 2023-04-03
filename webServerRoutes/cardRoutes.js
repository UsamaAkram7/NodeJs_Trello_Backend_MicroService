const express = require('express');

const router = express.Router();
const cardController = require('../controllers/cardController');

router.get('/get', (req, res) => new cardController(req, res).getCards());
router.post('/add', (req, res) => new cardController(req, res).createCard());
router.post('/delete', (req, res) => new cardController(req, res).deleteCard());
router.put('/update', (req, res) => new cardController(req, res).updatedCard());
router.put('/update/all', (req, res) => new cardController(req, res).updatedAllCardsDetails());

module.exports = router;
