import { describe, expect, it } from '@jest/globals';
import { classifyError, HttpError } from './errors.js';

describe('Error', () => {
  it('Проверяем статус', () => {
    const error = new HttpError(500);

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(HttpError);
    expect(error.status).toBe(500);
    expect(error.name).toBe('HttpError');
    expect(error.message).toBe('HTTP Error: 500');
  });

  it('Проверяем сообщение', () => {
    const error = new HttpError(403, 'Доступ запрещён');

    expect(error.status).toBe(403);
    expect(error.message).toBe('Доступ запрещён');
  });
});

describe('classifyError', () => {
  it('AbortError', () => {
    const abortError = new DOMException(
      'The operation was aborted',
      'AbortError'
    );
    const result = classifyError(abortError);

    expect(result.type).toBe('abort');
  });

  it('AbortError', () => {
    const timeOutError = new DOMException(
      'The operation timed out',
      'TimeoutError'
    );
    const result = classifyError(timeOutError);

    expect(result.type).toBe('timeout');
    expect(result.message).toBeTruthy();
  });

  it('HttpError ', () => {
    const httpError = new HttpError(500);
    const result = classifyError(httpError);

    expect(result.type).toBe('http');
    expect(result.message).toContain('500');
  });

  it('Сетевая ошибка', () => {
    const networkError = new TypeError('Failed to fetch');
    const result = classifyError(networkError);

    expect(result.type).toBe('network');
    expect(result.message).toBeTruthy();
  });
});
