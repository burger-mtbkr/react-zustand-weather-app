export const fetchWeather = async (): Promise<number> => {
    const response = await fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=-36.8485&longitude=174.7633&current_weather=true'
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.current_weather.temperature;
  };
