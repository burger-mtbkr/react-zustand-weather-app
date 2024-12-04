// src/components/WeatherComponent.tsx
import React from 'react';
import { useWeatherStore } from '../stores/weather.store';

const WeatherComponent: React.FC = () => {
  const { temperature, isLoading, error, fetchWeather, clearState } = useWeatherStore();

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Auckland Weather</h1>

      {/* Fetch Weather Button */}
      <button
        onClick={fetchWeather}
        disabled={isLoading}
        style={{
          margin: '20px',
          padding: '10px 20px',
          fontSize: '1rem',
          cursor: isLoading ? 'not-allowed' : 'pointer',
        }}
      >
        {isLoading ? 'Fetching...' : 'Get Weather'}
      </button>

      {isLoading && <p style={{ fontSize: '1.2rem', color: '#007bff' }}>Loading...</p>}

      {error && <p style={{ color: 'red', marginTop: '20px' }}>Error: {error}</p>}

      {temperature !== null && (
        <>
          {/* Display Weather */}
          <p style={{ fontSize: '1.5rem', marginTop: '20px' }}>
            Current Temperature: {temperature}°C
          </p>

          {/* Clear State Button */}
          <button
            onClick={clearState}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              fontSize: '1rem',
              backgroundColor: '#ff4d4f',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Clear State
          </button>
        </>
      )}
    </div>
  );
};

export default WeatherComponent;
