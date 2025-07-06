import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EventItem from './EventItem';
import './EventFeed.css';

const EventFeed = () => {
  // State for events, loading, and error
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch events from the backend API
  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/events');
      setEvents(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to fetch events. Please check if the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch events immediately on mount
    fetchEvents();

    // Set up polling every 15 seconds
    const interval = setInterval(fetchEvents, 15000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // Show loading spinner while fetching
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading events...</p>
      </div>
    );
  }

  // Show error message if fetch fails
  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <p className="error-message">{error}</p>
        <button onClick={fetchEvents} className="retry-button">
          Retry
        </button>
      </div>
    );
  }

  // Render the event feed
  return (
    <div className="event-feed">
      <div className="feed-header">
        <h2>GitHub Webhook Events</h2>
        <div className="feed-info">
          <span className="event-count">{events.length} events</span>
          <span className="auto-refresh">Auto-refreshing every 15 seconds</span>
        </div>
      </div>
      
      <div className="events-container">
        {events.length === 0 ? (
          <div className="no-events">
            <div className="no-events-icon">📝</div>
            <p>No events yet. Trigger some GitHub webhook events to see them here!</p>
          </div>
        ) : (
          // Render each event using EventItem
          events.map((event) => (
            <EventItem key={event._id} event={event} />
          ))
        )}
      </div>
    </div>
  );
};

export default EventFeed; 