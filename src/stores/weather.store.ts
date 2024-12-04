import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import loggingMiddleware from '../middleware/logging.middleware';
import { fetchWeather } from '../api/fetchWeather.api';

interface WeatherState {
  temperature: number | null;
  isLoading: boolean;
  error: string | null;
  fetchWeather: () => Promise<void>;
  clearState: () => void;
}

export const useWeatherStore = create<WeatherState>()(
  devtools(
    persist(
      loggingMiddleware(
        (set, get, api) => ({
          temperature: null,
          isLoading: false,
          error: null,

          fetchWeather: async () => {
            set({ isLoading: true, error: null });
            try {
              const temperature = await fetchWeather();
              set({ temperature, isLoading: false });
            } catch (error) {
              set({ error: (error as Error).message, isLoading: false });
            }
          },

          clearState: () => {
            set({ temperature: null, error: null, isLoading: false });
          },
        })
      ),
      {
        name: 'WeatherStore', // Unique name for storage
        // Optionally, specify a custom storage:
        // getStorage: () => sessionStorage,
      }
    ),
    { name: 'WeatherStore' } // Options for devtools
  )
);