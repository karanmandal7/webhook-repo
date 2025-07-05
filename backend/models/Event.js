const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  request_id: { type: String, required: true },
  author: { type: String, required: true },
  action: { type: String, enum: ['PUSH', 'PULL_REQUEST', 'MERGE'], required: true },
  from_branch: { type: String },
  to_branch: { type: String },
  timestamp: { type: String, required: true }
});

module.exports = mongoose.model('Event', EventSchema); 