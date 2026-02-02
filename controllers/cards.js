const Card = require('../models/Card');

// @desc    Get all cards
// @route   GET /api/cards
// @access  Private
exports.getCards = async (req, res) => {
    try {
        const cards = await Card.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: cards.length, data: cards });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Add a card
// @route   POST /api/cards
// @access  Private
exports.addCard = async (req, res) => {
    try {
        req.body.user = req.user.id;
        const card = await Card.create(req.body);
        res.status(201).json({ success: true, data: card });
    } catch (err) {
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ success: false, error: messages });
        }
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Delete a card
// @route   DELETE /api/cards/:id
// @access  Private
exports.deleteCard = async (req, res) => {
    try {
        const card = await Card.findById(req.params.id);
        if (!card) return res.status(404).json({ success: false, error: 'Card not found' });
        if (card.user.toString() !== req.user.id) return res.status(401).json({ success: false, error: 'Not authorized' });

        await card.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
