import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import { debounce } from './debounce.js';

describe('debounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('не вызывает функцию сразу при вызове', () => {
    const mockFn = jest.fn();
    const debounced = debounce(mockFn, 300);

    debounced('rus');

    expect(mockFn).not.toHaveBeenCalled();
  });

  it('вызывает после 300мс', () => {
    const mockFn = jest.fn();
    const debounced = debounce(mockFn, 300);

    debounced('rus');
    jest.advanceTimersByTime(300);

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('rus');
  });

  it('повторный вызов', () => {
    const mockFn = jest.fn();
    const debounced = debounce(mockFn, 300);

    debounced('r');
    jest.advanceTimersByTime(200);
    debounced('ru');
    jest.advanceTimersByTime(200);
    expect(mockFn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(100);
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('ru');
  });
});
