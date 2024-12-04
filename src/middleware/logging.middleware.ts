import { StateCreator } from 'zustand';

const loggingMiddleware = <T extends object>(
  config: StateCreator<T>
): StateCreator<T> => (set, get, api) => {
  api.subscribe((newState, previousState) => {
    console.log('Previous state:', previousState);
    console.log('Next state:', newState);
  });

  return config(set, get, api);
};

export default loggingMiddleware;