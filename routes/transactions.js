const express = require('express');
const router = express.Router();
const { getTransactions, addTransaction, deleteTransaction, updateTransaction } = require('../controllers/transactions');
const { protect } = require('../middleware/auth');

router.route('/')
    .get(protect, getTransactions)
    .post(protect, addTransaction);

router.route('/:id')
    .put(protect, updateTransaction)
    .delete(protect, deleteTransaction);

module.exports = router;
