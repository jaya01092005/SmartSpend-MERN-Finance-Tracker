const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bank: {
    type: String,
    required: [true, 'Please add a bank name']
  },
  type: {
    type: String,
    required: [true, 'Please add a card type (Visa, Mastercard, etc.)']
  },
  last4: {
    type: String,
    required: [true, 'Please add last 4 digits'],
    maxlength: 4,
    minlength: 4
  },
  expiry: {
    type: String,
    required: [true, 'Please add expiry date (MM/YY)']
  },
  balance: {
    type: Number,
    default: 0
  },
  color: {
    type: String,
    default: 'blue' // blue, black, purple
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Card', CardSchema);
