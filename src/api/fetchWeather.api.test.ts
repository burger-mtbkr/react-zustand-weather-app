import { fetchWeather } from './fetchWeather.api';

// Mock the global `fetch` function
global.fetch = jest.fn();

describe('fetchWeather', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear previous mock data between tests
  });

  it('should return the temperature when the API call is successful', async () => {
    // Mock a successful response
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        current_weather: { temperature: 22.5 },
      }),
    });

    const temperature = await fetchWeather();

    expect(fetch).toHaveBeenCalledWith(
      'https://api.open-meteo.com/v1/forecast?latitude=-36.8485&longitude=174.7633&current_weather=true'
    );
    expect(temperature).toBe(22.5);
  });

  it('should throw an error when the API returns a non-OK status', async () => {
    // Mock a failed response
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });

    await expect(fetchWeather()).rejects.toThrow('API Error: 500 Internal Server Error');

    expect(fetch).toHaveBeenCalledWith(
      'https://api.open-meteo.com/v1/forecast?latitude=-36.8485&longitude=174.7633&current_weather=true'
    );
  });

  it('should throw an error when the fetch call fails', async () => {
    // Mock a fetch failure
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network Error'));

    await expect(fetchWeather()).rejects.toThrow('Network Error');

    expect(fetch).toHaveBeenCalledWith(
      'https://api.open-meteo.com/v1/forecast?latitude=-36.8485&longitude=174.7633&current_weather=true'
    );
  });
});