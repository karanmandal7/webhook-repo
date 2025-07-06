const mongoose = require('mongoose');

// Mongoose schema for GitHub webhook events
const EventSchema = new mongoose.Schema({
  request_id: { type: String, required: true }, // Commit hash for push, PR ID for pull/merge
  author: { type: String, required: true },     // Name of the GitHub user
  action: { type: String, enum: ['PUSH', 'PULL_REQUEST', 'MERGE'], required: true }, // Event type
  from_branch: { type: String },                // Source branch (for PR/merge)
  to_branch: { type: String },                  // Target branch
  timestamp: { type: String, required: true }   // ISO date string
});

module.exports = mongoose.model('Event', EventSchema); 