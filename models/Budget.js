const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: String,
        required: [true, 'Please add a category'],
    },
    limit: {
        type: Number,
        required: [true, 'Please add a budget limit']
    },
    period: {
        type: String,
        default: 'monthly' // monthly, weekly
    }
});

// Prevent multiple budgets for same category per user
BudgetSchema.index({ user: 1, category: 1 }, { unique: true });

module.exports = mongoose.model('Budget', BudgetSchema);
