export type ErrorType = 'abort' | 'timeout' | 'http' | 'network';

export interface ClassifiedError {
  type: ErrorType;
  message: string;
}

export class HttpError extends Error {
  public readonly status: number;

  constructor(status: number, message?: string) {
    super(message);
    this.status = status;
  }
}

export function classifyError(error: unknown): ClassifiedError {
  void error;
  return { type: 'network', message: '' };
}
