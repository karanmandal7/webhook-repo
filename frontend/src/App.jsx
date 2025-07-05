import React from 'react';
import EventFeed from './components/EventFeed';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <h1>GitHub Webhook Event Tracker</h1>
          <p>Real-time monitoring of GitHub repository activity</p>
        </div>
      </header>
      <main className="app-main">
        <EventFeed />
      </main>
      <footer className="app-footer">
        <p>Built with React, Node.js, Express, and MongoDB</p>
      </footer>
    </div>
  );
}

export default App;
