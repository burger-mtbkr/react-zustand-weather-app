import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import WeatherComponent from './WeatherComponent';
import { mockUseWeatherStore } from '../utils/test.util'; // Import the utility function

jest.mock('../stores/weather.store');

describe('WeatherComponent', () => {
  let mockStore: any;

  beforeEach(() => {  
    mockStore = {
      temperature: null,
      isLoading: false,
      error: null,
      fetchWeather: jest.fn(),
      clearState: jest.fn(),
    };
  
    mockUseWeatherStore(mockStore);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render initial UI correctly', () => {
    render(<WeatherComponent />);
    expect(screen.getByText(/Auckland Weather/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Get Weather/i })).toBeInTheDocument();
  });

  it('should call fetchWeather when "Get Weather" button is clicked', () => {
    render(<WeatherComponent />);

    const button = screen.getByRole('button', { name: /Get Weather/i });
    fireEvent.click(button);

    expect(mockStore.fetchWeather).toHaveBeenCalled();
  });

  it('should display "Fetching..." and disable the button when isLoading is true', () => {
    mockStore.isLoading = true;
    mockUseWeatherStore(mockStore);

    render(<WeatherComponent />);

    const button = screen.getByRole('button', { name: /Fetching.../i });
    expect(button).toBeDisabled();
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it('should display error message when error occurs', () => {
    mockStore.error = 'Network Error';
    mockUseWeatherStore(mockStore);

    render(<WeatherComponent />);

    expect(screen.getByText(/Error: Network Error/i)).toBeInTheDocument();
  });

  it('should display the current temperature when temperature is available', () => {
    mockStore.temperature = 25;
    mockUseWeatherStore(mockStore);

    render(<WeatherComponent />);

    expect(screen.getByText(/Current Temperature: 25°C/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Clear State/i })).toBeInTheDocument();
  });

  it('should call clearState when "Clear State" button is clicked', () => {
    mockStore.temperature = 25;
    mockUseWeatherStore(mockStore);

    render(<WeatherComponent />);

    const clearButton = screen.getByRole('button', { name: /Clear State/i });
    fireEvent.click(clearButton);

    expect(mockStore.clearState).toHaveBeenCalled();
  });
});
