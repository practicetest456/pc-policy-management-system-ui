import axios from 'axios';
import type { ApiError } from '../types';

// The Spring Boot backend. CORS allows http://localhost:5173.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
});

export interface ParsedError {
  message: string;
  fieldErrors?: Record<string, string>;
}

/** Turns any error into a message a user can understand. */
export function parseApiError(error: unknown): ParsedError {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiError | undefined;
    if (data?.message) {
      return { message: data.message, fieldErrors: data.fieldErrors };
    }
    if (!error.response) {
      return { message: 'Cannot reach the server. Please make sure the Spring Boot backend is running on http://localhost:8080.' };
    }
    return { message: `The request failed (status ${error.response.status}).` };
  }
  return { message: error instanceof Error ? error.message : 'Something unexpected happened.' };
}
