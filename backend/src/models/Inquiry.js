const mongoose = require('mongoose');

const InquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a contact name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please add a contact email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Please add a contact phone number'],
    trim: true
  },
  travelersCount: {
    type: Number,
    required: [true, 'Please select the number of travelers'],
    min: [1, 'Must have at least 1 traveler']
  },
  travelDate: {
    type: Date,
    required: [true, 'Please select a preferred travel date']
  },
  package: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package',
    required: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: [true, 'Please write a message']
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Inquiry', InquirySchema);
