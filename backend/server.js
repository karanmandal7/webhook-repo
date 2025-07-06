// Load environment variables from .env file
require('dotenv').config();

// Import dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const Event = require('./models/Event');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to enable CORS and parse JSON bodies
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB using Mongoose
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// POST /github-webhook: Receives GitHub webhook events
app.post('/github-webhook', async (req, res) => {
  // Get the event type from GitHub headers
  const eventType = req.headers['x-github-event'];
  const payload = req.body;
  let eventData = {};

  try {
    // Handle push events
    if (eventType === 'push') {
      eventData = {
        request_id: payload.head_commit?.id || 'unknown', // Commit hash
        author: payload.pusher?.name || 'Unknown',
        action: 'PUSH',
        from_branch: null,
        to_branch: payload.ref?.split('/').pop() || 'unknown', // Branch name
        timestamp: payload.head_commit?.timestamp || new Date().toISOString()
      };
    // Handle pull request and merge events
    } else if (eventType === 'pull_request') {
      const pr = payload.pull_request;
      const isMerged = payload.action === 'closed' && pr?.merged;
      eventData = {
        request_id: pr?.id ? pr.id.toString() : 'unknown', // PR ID
        author: pr?.user?.login || 'Unknown',
        action: isMerged ? 'MERGE' : 'PULL_REQUEST',
        from_branch: pr?.head?.ref || 'unknown',
        to_branch: pr?.base?.ref || 'unknown',
        timestamp: pr?.merged_at || pr?.created_at || new Date().toISOString()
      };
    } else {
      // Ignore other event types
      return res.status(200).json({ message: 'Event ignored.' });
    }

    // Prevent duplicate events (same request_id and action)
    const exists = await Event.findOne({ request_id: eventData.request_id, action: eventData.action });
    if (!exists) {
      // Save the event to MongoDB
      const event = new Event(eventData);
      await event.save();
      res.status(201).json({ message: 'Event stored.' });
    } else {
      // Ignore duplicate events
      res.status(200).json({ message: 'Duplicate event ignored.' });
    }
  } catch (err) {
    // Handle errors
    console.error('Error processing webhook:', err);
    res.status(500).json({ error: 'Failed to process event.' });
  }
});

// GET /events: Returns the latest 50 events, sorted by timestamp (descending)
app.get('/events', async (req, res) => {
  try {
    const events = await Event.find().sort({ timestamp: -1 }).limit(50);
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch events.' });
  }
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
