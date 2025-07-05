const axios = require('axios');

// Sample GitHub webhook payloads
const pushPayload = {
  ref: "refs/heads/main",
  pusher: {
    name: "testuser"
  },
  head_commit: {
    timestamp: new Date().toISOString()
  }
};

const pullRequestPayload = {
  action: "opened",
  pull_request: {
    user: {
      login: "testuser"
    },
    head: {
      ref: "feature-branch"
    },
    base: {
      ref: "main"
    },
    created_at: new Date().toISOString()
  }
};

const mergePayload = {
  action: "closed",
  pull_request: {
    user: {
      login: "testuser"
    },
    head: {
      ref: "feature-branch"
    },
    base: {
      ref: "main"
    },
    merged: true,
    merged_at: new Date().toISOString()
  }
};

async function testWebhook() {
  const baseURL = 'http://localhost:5000';
  
  try {
    console.log('Testing push event...');
    await axios.post(`${baseURL}/github-webhook`, pushPayload, {
      headers: {
        'Content-Type': 'application/json',
        'x-github-event': 'push'
      }
    });
    console.log('✅ Push event sent successfully');

    console.log('Testing pull request event...');
    await axios.post(`${baseURL}/github-webhook`, pullRequestPayload, {
      headers: {
        'Content-Type': 'application/json',
        'x-github-event': 'pull_request'
      }
    });
    console.log('✅ Pull request event sent successfully');

    console.log('Testing merge event...');
    await axios.post(`${baseURL}/github-webhook`, mergePayload, {
      headers: {
        'Content-Type': 'application/json',
        'x-github-event': 'pull_request'
      }
    });
    console.log('✅ Merge event sent successfully');

    console.log('\nFetching events...');
    const response = await axios.get(`${baseURL}/events`);
    console.log('✅ Events retrieved:', response.data);

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testWebhook(); 