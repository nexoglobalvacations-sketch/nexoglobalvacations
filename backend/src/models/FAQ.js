const mongoose = require('mongoose');

const FAQSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Please add a question']
  },
  answer: {
    type: String,
    required: [true, 'Please add an answer']
  },
  category: {
    type: String,
    default: 'General'
  },
  order: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('FAQ', FAQSchema);
