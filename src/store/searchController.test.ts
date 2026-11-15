import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import { CountrySearchController } from './searchController.js';

interface DeferredResponse {
  resolve: (response: Response) => void;
  signal?: AbortSignal;
}

describe('CountrySearchController', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('отменяет устаревший запрос', async () => {
    const requests: DeferredResponse[] = [];

    jest.spyOn(globalThis, 'fetch').mockImplementation((_input, init) => {
      const signal = init?.signal ?? undefined;
      return new Promise<Response>((resolve, reject) => {
        if (signal?.aborted) {
          reject(new DOMException('The operation was aborted', 'AbortError'));
          return;
        }
        signal?.addEventListener('abort', () => {
          reject(new DOMException('The operation was aborted', 'AbortError'));
        });
        requests.push({ resolve, signal });
      });
    });

    const controller = new CountrySearchController(() => {}, 300);

    controller.handleInput('sp');
    jest.advanceTimersByTime(300);
    expect(requests).toHaveLength(1);

    controller.handleInput('spain');
    expect(requests[0].signal?.aborted).toBe(true);

    jest.advanceTimersByTime(300);
    expect(requests).toHaveLength(2);

    requests[1].resolve(
      new Response(JSON.stringify([{ name: 'Spain', capital: 'Madrid' }]), {
        status: 200,
      })
    );
    await jest.advanceTimersByTimeAsync(0);

    requests[0].resolve(
      new Response(
        JSON.stringify([{ name: 'Old Stale Country', capital: 'Old' }]),
        { status: 200 }
      )
    );
    await jest.advanceTimersByTimeAsync(0);

    const finalState = controller.getState();
    expect(finalState.status).toBe('success');
    expect(finalState.countries).toHaveLength(1);
    expect(finalState.countries[0].name).toBe('Spain');
    expect(finalState.errorMessage).toBeNull();
  });

  it('при очистке поля отменяет запрос и сбрасывает состояние в idle', () => {
    let capturedSignal: AbortSignal | undefined;

    jest.spyOn(globalThis, 'fetch').mockImplementation((_input, init) => {
      capturedSignal = init?.signal ?? undefined;
      return new Promise<Response>(() => {});
    });

    const controller = new CountrySearchController(() => {}, 300);
    controller.handleInput('spain');
    jest.advanceTimersByTime(300);

    controller.handleInput('   ');

    expect(capturedSignal?.aborted).toBe(true);
    expect(controller.getState()).toEqual({
      status: 'idle',
      countries: [],
      errorMessage: null,
    });
  });

  it('повторяет последний запрос', async () => {
    const fetchSpy = jest
      .spyOn(globalThis, 'fetch')
      .mockRejectedValueOnce(new TypeError('Failed to fetch'))
      .mockResolvedValueOnce(
        new Response(JSON.stringify([{ name: 'Spain', capital: 'Madrid' }]), {
          status: 200,
        })
      );

    const controller = new CountrySearchController(() => {}, 300);
    controller.handleInput('spain');
    jest.advanceTimersByTime(300);

    await Promise.resolve();
    await Promise.resolve();
    expect(controller.getState().status).toBe('error');

    await controller.retry();

    expect(fetchSpy).toHaveBeenCalledTimes(2);
    expect(controller.getState().status).toBe('success');
    expect(controller.getState().countries[0].name).toBe('Spain');
  });
});
