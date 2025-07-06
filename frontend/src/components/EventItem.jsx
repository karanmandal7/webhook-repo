import React from 'react';
import './EventItem.css';

const EventItem = ({ event }) => {
  // Defensive check for missing or malformed event data
  if (!event || typeof event.action !== 'string') {
    return <div className="event-item error">Invalid event data</div>;
  }

  // Format the timestamp to a human-readable string
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const options = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    };
    return date.toLocaleDateString('en-US', options);
  };

  // Generate the event message based on type
  const getEventMessage = (event) => {
    const author = event.author || 'Unknown';
    const timestamp = formatTimestamp(event.timestamp);

    switch (event.action) {
      case 'PUSH':
        return `${author} pushed to "${event.to_branch || 'unknown'}" on ${timestamp}`;
      case 'PULL_REQUEST':
        return `${author} submitted a pull request from "${event.from_branch || 'unknown'}" to "${event.to_branch || 'unknown'}" on ${timestamp}`;
      case 'MERGE':
        return `${author} merged branch "${event.from_branch || 'unknown'}" to "${event.to_branch || 'unknown'}" on ${timestamp}`;
      default:
        return `${author} performed ${event.action} on ${timestamp}`;
    }
  };

  // Get an icon for the event type
  const getEventIcon = (type) => {
    switch (type) {
      case 'PUSH':
        return '📤';
      case 'PULL_REQUEST':
        return '🔀';
      case 'MERGE':
        return '✅';
      default:
        return '📝';
    }
  };

  // Get a color for the event type
  const getEventColor = (type) => {
    switch (type) {
      case 'PUSH':
        return '#4CAF50';
      case 'PULL_REQUEST':
        return '#2196F3';
      case 'MERGE':
        return '#FF9800';
      default:
        return '#9E9E9E';
    }
  };

  // Render the event item
  return (
    <div className="event-item" style={{ borderLeftColor: getEventColor(event.action) }}>
      <div className="event-icon">
        {getEventIcon(event.action)}
      </div>
      <div className="event-content">
        <div className="event-message">
          {getEventMessage(event)}
        </div>
        <div className="event-type">
          {event.action ? event.action.toUpperCase().replace('_', ' ') : 'UNKNOWN'}
        </div>
      </div>
    </div>
  );
};

export default EventItem; 