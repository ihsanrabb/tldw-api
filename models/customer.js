const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CustomerSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  phone_number: {
    type: String,
    required: true
  },
  avatar_url: {
    type: String,
    required: false
  },
  queue_list: {
    type: Array,
    required: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamp: true });

module.exports = mongoose.model('Customer', CustomerSchema);
