export type ErrorType = 'abort' | 'timeout' | 'http' | 'network';

export interface ClassifiedError {
  type: ErrorType;
  message: string;
}

export class HttpError extends Error {
  public readonly status: number;

  constructor(status: number, message?: string) {
    super(message ?? `HTTP Error: ${status}`);
    this.name = 'HttpError';
    this.status = status;
  }
}

export function classifyError(error: unknown): ClassifiedError {
  if (error instanceof DOMException) {
    if (error.name === 'AbortError') {
      return { type: 'abort', message: error.message };
    } else if (error.name === 'TimeoutError') {
      return {
        type: 'timeout',
        message:
          'Превышено время ожидания ответа от сервера. Проверьте соединение и попробуйте снова',
      };
    }
  } else if (error instanceof HttpError) {
    return {
      type: 'http',
      message: `Ошибка сервера (код ${error.status}). Попробуйте повторить запрос позже.`,
    };
  }

  return {
    type: 'network',
    message:
      error instanceof Error
        ? 'Превышено время ожидания ответа от сервера. Проверьте соединение и попробуйте снова'
        : 'Неизвестная ошибка сети',
  };
}
