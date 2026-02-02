const express = require('express');
const router = express.Router();
const { getCards, addCard, deleteCard } = require('../controllers/cards');
const { protect } = require('../middleware/auth');

router.route('/')
    .get(protect, getCards)
    .post(protect, addCard);

router.route('/:id')
    .delete(protect, deleteCard);

module.exports = router;
