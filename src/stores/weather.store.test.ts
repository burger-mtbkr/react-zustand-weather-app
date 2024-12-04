import { renderHook, act, waitFor } from '@testing-library/react';
import { useWeatherStore } from './weather.store';
import { fetchWeather } from '../api/fetchWeather.api';

jest.mock('../api/fetchWeather.api');

describe('useWeatherStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    act(() => {
      useWeatherStore.getState().clearState();
    });
  });

  it('should have initial state', () => {
    const { result } = renderHook(() => useWeatherStore());
    expect(result.current.temperature).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should set isLoading to true when fetching weather', async () => {
    const { result } = renderHook(() => useWeatherStore());

    act(() => {
      result.current.fetchWeather();
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  it('should fetch weather successfully', async () => {
    (fetchWeather as jest.Mock).mockResolvedValue(25);

    const { result } = renderHook(() => useWeatherStore());

    act(() => {
      result.current.fetchWeather();
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.temperature).toBe(25);
    expect(result.current.error).toBeNull();
  });

  it('should handle fetch weather error', async () => {
    (fetchWeather as jest.Mock).mockRejectedValue(new Error('Network Error'));

    const { result } = renderHook(() => useWeatherStore());

    act(() => {
      result.current.fetchWeather();
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.temperature).toBeNull();
    expect(result.current.error).toBe('Network Error');
  });

  it('should clear the state', () => {
    const { result } = renderHook(() => useWeatherStore());
    act(() => {
      result.current.temperature = 20;
      result.current.error = 'Some error';
      result.current.isLoading = true;
    });

    act(() => {
      result.current.clearState();
    });

    expect(result.current.temperature).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });
});
