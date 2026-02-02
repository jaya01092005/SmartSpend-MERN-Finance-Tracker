const express = require('express');
const router = express.Router();
const { getBudgets, addBudget, deleteBudget } = require('../controllers/budgets');
const { protect } = require('../middleware/auth');

router.route('/')
    .get(protect, getBudgets)
    .post(protect, addBudget);

router.route('/:id')
    .delete(protect, deleteBudget);

module.exports = router;
