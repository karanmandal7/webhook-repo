# GitHub Webhook Event Tracker (MERN Stack)

## 🚀 Overview
This project is a full-stack MERN application that listens for GitHub webhook events (Push, Pull Request, Merge) from a connected repository (action-repo). It stores event details in MongoDB and displays a real-time, auto-updating event feed in a React UI.

- **Backend:** Node.js + Express.js + MongoDB (Mongoose)
- **Frontend:** React.js (Vite)
- **Webhook Integration:** Receives GitHub webhook events via a public endpoint (ngrok/localtunnel)
- **Polling:** Frontend polls backend every 15 seconds for the latest events

---

## 🛠️ Tech Stack
- **Frontend:** React.js (Vite, Axios, CSS)
- **Backend:** Node.js, Express.js, Mongoose, MongoDB
- **API Client:** Axios
- **Webhook Tunnel:** ngrok (or localtunnel)
- **Database:** MongoDB

---

## 📦 Folder Structure
```
webhook-repo/
  backend/
    models/
      Event.js
    server.js
    .env
    package.json
  frontend/
    src/
      components/
        EventFeed.jsx
        EventItem.jsx
      App.jsx
      App.css
    package.json
  README.md
```

---

## ⚙️ Setup Instructions

### 1. **Clone the Repo**
```sh
git clone https://github.com/karanmandal7/webhook-repo.git
cd webhook-repo
```

### 2. **Backend Setup**
```sh
cd backend
npm install
```
- Create a `.env` file in `/backend`:
  ```
  PORT=5000
  MONGODB_URI=mongodb://localhost:27017/github_webhook
  ```
- Start MongoDB locally (or use a cloud URI).
- Start the backend server:
  ```sh
  node server.js
  ```

### 3. **Frontend Setup**
```sh
cd ../frontend
npm install
npm run dev
```
- The frontend will be available at [http://localhost:5173](http://localhost:5173).

---

## 🌐 Expose Backend for Webhooks
- In a new terminal, run:
  ```sh
  npx ngrok http 5000
  ```
- Copy the HTTPS forwarding URL (e.g., `https://abcd1234.ngrok-free.app`).

---

## 🔗 Connect Your action-repo
1. Go to your action-repo on GitHub.
2. **Settings → Webhooks → Add webhook**
3. **Payload URL:**  
   `https://<ngrok-id>.ngrok-free.app/github-webhook`
4. **Content type:** `application/json`
5. **Events:** Select "Push" and "Pull requests"
6. **Save** the webhook.

---

## 🧪 Testing

### **Push Event**
- Make a change in your action-repo, commit, and push.
- The event should appear in your UI within 15 seconds.

### **Pull Request Event**
- Create a new branch, push it, and open a pull request on GitHub.
- The event should appear in your UI.

### **Merge Event**
- Merge a pull request on GitHub.
- The event should appear in your UI.

### **UI Format**
- Push: `"Alice" pushed to "main" on 5th July 2025 - 12:00 PM UTC`
- Pull Request: `"Alice" submitted a pull request from "feature" to "main" on ..."`
- Merge: `"Alice" merged branch "feature" to "main" on ..."`

---

## 🗃️ MongoDB Schema
```js
{
  request_id: String, // commit hash or PR ID
  author: String,
  action: String, // "PUSH", "PULL_REQUEST", "MERGE"
  from_branch: String,
  to_branch: String,
  timestamp: String // ISO date string
}
```

---

## 📝 Notes
- The frontend polls the backend every 15 seconds for new events.
- The backend must be accessible from the internet for GitHub to deliver webhooks (use ngrok/localtunnel).
- All code is in this repo; your action-repo is a separate GitHub repository.

---

## 📸 Screenshots
*(Add screenshots of your UI here if possible!)*

---

## 👤 Author
- [Karan Mandal](https://github.com/karanmandal7)

---

## 📄 License
MIT 