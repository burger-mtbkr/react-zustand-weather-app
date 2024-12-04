import { useWeatherStore } from '../stores/weather.store';
export const mockUseWeatherStore = (mockStore: any) => {
  (useWeatherStore as unknown as jest.Mock).mockReturnValue(mockStore);
};
