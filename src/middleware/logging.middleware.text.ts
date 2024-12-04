import { renderHook, act } from '@testing-library/react';
import { create } from 'zustand';
import loggingMiddleware from './logging.middleware';

interface TestState {
  count: number;
  increment: () => void;
  reset: () => void;
}

describe('loggingMiddleware', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {   
    consoleSpy.mockRestore();
  });

  it('should initialize with the correct initial state without logging', () => {
    const useTestStore = create<TestState>()(
      loggingMiddleware((set) => ({
        count: 0,
        increment: () => set((state) => ({ count: state.count + 1 })),
        reset: () => set({ count: 0 }),
      }))
    );    
    const { result } = renderHook(() => useTestStore());

    expect(result.current.count).toBe(0);
    expect(consoleSpy).not.toHaveBeenCalled();
  });

  it('should log previous and next state on increment action', () => {
    const useTestStore = create<TestState>()(
      loggingMiddleware((set) => ({
        count: 0,
        increment: () => set((state) => ({ count: state.count + 1 })),
        reset: () => set({ count: 0 }),
      }))
    );

    const { result } = renderHook(() => useTestStore());
    act(() => {
      result.current.increment();
    });
    expect(consoleSpy).toHaveBeenNthCalledWith(1, 'Previous state:', { count: 0, increment: expect.any(Function), reset: expect.any(Function) });
    expect(consoleSpy).toHaveBeenNthCalledWith(2, 'Next state:', { count: 1, increment: expect.any(Function), reset: expect.any(Function) });
  });

  it('should log previous and next state on reset action', () => {
    const useTestStore = create<TestState>()(
      loggingMiddleware((set) => ({
        count: 5,
        increment: () => set((state) => ({ count: state.count + 1 })),
        reset: () => set({ count: 0 }),
      }))
    );

    const { result } = renderHook(() => useTestStore());
    act(() => {
      result.current.reset();
    });
    expect(consoleSpy).toHaveBeenNthCalledWith(1, 'Previous state:', { count: 5, increment: expect.any(Function), reset: expect.any(Function) });
    expect(consoleSpy).toHaveBeenNthCalledWith(2, 'Next state:', { count: 0, increment: expect.any(Function), reset: expect.any(Function) });
  });

  it('should log multiple state changes correctly', () => {
    const useTestStore = create<TestState>()(
      loggingMiddleware((set) => ({
        count: 0,
        increment: () => set((state) => ({ count: state.count + 1 })),
        reset: () => set({ count: 0 }),
      }))
    );

    const { result } = renderHook(() => useTestStore());
    act(() => {
      result.current.increment(); // count: 1
      result.current.increment(); // count: 2
      result.current.reset();     // count: 0
    });


    expect(consoleSpy).toHaveBeenCalledTimes(6);
    expect(consoleSpy).toHaveBeenNthCalledWith(1, 'Previous state:', { count: 0, increment: expect.any(Function), reset: expect.any(Function) });
    expect(consoleSpy).toHaveBeenNthCalledWith(2, 'Next state:', { count: 1, increment: expect.any(Function), reset: expect.any(Function) });
    expect(consoleSpy).toHaveBeenNthCalledWith(3, 'Previous state:', { count: 1, increment: expect.any(Function), reset: expect.any(Function) });
    expect(consoleSpy).toHaveBeenNthCalledWith(4, 'Next state:', { count: 2, increment: expect.any(Function), reset: expect.any(Function) });
    expect(consoleSpy).toHaveBeenNthCalledWith(5, 'Previous state:', { count: 2, increment: expect.any(Function), reset: expect.any(Function) });
    expect(consoleSpy).toHaveBeenNthCalledWith(6, 'Next state:', { count: 0, increment: expect.any(Function), reset: expect.any(Function) });
  });

  it('should not log if state remains unchanged', () => {
    const useTestStore = create<TestState>()(
      loggingMiddleware((set) => ({
        count: 0,
        increment: () => set((state) => ({ count: state.count })),
        reset: () => set({ count: 0 }),
      }))
    );
    const { result } = renderHook(() => useTestStore());
    act(() => {
      result.current.increment();
    });
    expect(consoleSpy).toHaveBeenNthCalledWith(1, 'Previous state:', { count: 0, increment: expect.any(Function), reset: expect.any(Function) });
    expect(consoleSpy).toHaveBeenNthCalledWith(2, 'Next state:', { count: 0, increment: expect.any(Function), reset: expect.any(Function) });
  });
});
