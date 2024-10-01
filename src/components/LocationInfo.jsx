// LocationInfo.js
import React from 'react';

const LocationInfo = ({ latitude, longitude, timestamp }) => {
  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Current Location</h3>
      <p><strong>Latitude:</strong> {latitude || 'N/A'}</p>
      <p><strong>Longitude:</strong> {longitude || 'N/A'}</p>
      <p><strong>Time:</strong> {timestamp ? new Date(timestamp).toLocaleString() : new Date().toLocaleString()}</p>
    </div>
  );
};

const styles = {
  container: {
    background: '#fff',
    padding: '10px',
    borderRadius: '5px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
    position: 'absolute',
    top: '4vh',
    left: '4vw',
    zIndex: 1000,
  },
  title: {
    margin: '0 0 10px',
  },
};

export default LocationInfo;
