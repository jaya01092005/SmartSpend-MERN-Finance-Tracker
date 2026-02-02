const Budget = require('../models/Budget');

// @desc    Get all budgets
// @route   GET /api/budgets
// @access  Private
exports.getBudgets = async (req, res) => {
    try {
        const budgets = await Budget.find({ user: req.user.id });

        res.status(200).json({
            success: true,
            count: budgets.length,
            data: budgets
        });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Add or Update budget
// @route   POST /api/budgets
// @access  Private
exports.addBudget = async (req, res) => {
    try {
        req.body.user = req.user.id;
        const { category, limit } = req.body;

        // Check if budget exists for this category
        let budget = await Budget.findOne({ user: req.user.id, category });

        if (budget) {
            // Update existing
            budget.limit = limit;
            await budget.save();
            return res.status(200).json({ success: true, data: budget });
        }

        // Create new
        budget = await Budget.create(req.body);

        res.status(201).json({
            success: true,
            data: budget
        });
    } catch (err) {
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ success: false, error: messages });
        }
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Delete budget
// @route   DELETE /api/budgets/:id
// @access  Private
exports.deleteBudget = async (req, res) => {
    try {
        const budget = await Budget.findById(req.params.id);

        if (!budget) {
            return res.status(404).json({ success: false, error: 'No budget found' });
        }

        if (budget.user.toString() !== req.user.id) {
            return res.status(401).json({ success: false, error: 'User not authorized' });
        }

        await budget.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
