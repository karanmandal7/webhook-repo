require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const Event = require('./models/Event');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

// Webhook endpoint
app.post('/github-webhook', async (req, res) => {
  const eventType = req.headers['x-github-event'];
  const payload = req.body;
  let eventData = {};

  try {
    if (eventType === 'push') {
      eventData = {
        request_id: payload.head_commit?.id || 'unknown',
        author: payload.pusher?.name || 'Unknown',
        action: 'PUSH',
        from_branch: null,
        to_branch: payload.ref?.split('/').pop() || 'unknown',
        timestamp: payload.head_commit?.timestamp || new Date().toISOString()
      };
    } else if (eventType === 'pull_request') {
      const pr = payload.pull_request;
      const isMerged = payload.action === 'closed' && pr?.merged;
      eventData = {
        request_id: pr?.id ? pr.id.toString() : 'unknown',
        author: pr?.user?.login || 'Unknown',
        action: isMerged ? 'MERGE' : 'PULL_REQUEST',
        from_branch: pr?.head?.ref || 'unknown',
        to_branch: pr?.base?.ref || 'unknown',
        timestamp: pr?.merged_at || pr?.created_at || new Date().toISOString()
      };
    } else {
      return res.status(200).json({ message: 'Event ignored.' });
    }

    const event = new Event(eventData);
    await event.save();
    res.status(201).json({ message: 'Event stored.' });
  } catch (err) {
    console.error('Error processing webhook:', err);
    res.status(500).json({ error: 'Failed to process event.' });
  }
});

// Get latest events
app.get('/events', async (req, res) => {
  try {
    const events = await Event.find().sort({ timestamp: -1 }).limit(50);
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch events.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
