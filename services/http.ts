'use client';

import axios from 'axios';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/react';
import toast from 'react-hot-toast';

const MAX_CONSECUTIVE_FAILURES = 10;
let consecutiveFailures = 0;
let isShownError = false;

export const ApiClient = (baseURL: string | undefined) => {
  const instance = axios.create({
    baseURL,
  });

  let storagedSession = typeof window !== 'undefined' ? localStorage.getItem('session') : null;
  let lastSession: Session | null = storagedSession ? JSON.parse(storagedSession) : null;

  instance.interceptors.request.use(
    async (request) => {
      if (lastSession == null || Date.now() > Date.parse(lastSession.expires)) {
        const session = await getSession();
        lastSession = session;
        if (typeof window !== 'undefined' && session != null) {
          localStorage.setItem('session', JSON.stringify(session));
        }
      }

      request.headers['accept'] = '*/*';

      if (lastSession) {
        request.headers.Authorization = `Bearer ${lastSession.user.accessToken}`;
      } else {
        request.headers.Authorization = undefined;
      }

      return request;
    },
    (error) => {
      console.error(`API Error: `, error);
      throw error;
    }
  );

  instance.interceptors.response.use(
    (response) => {
      // Reset consecutive failures on a successful response
      consecutiveFailures = 0;
      return response;
    },
    (error) => {
      // Handle request failure
      consecutiveFailures++;
      if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
        // Stop making requests after too many consecutive failures
        if (!isShownError) {
          toast.error('Server is not responding. Please try reload the page and try again.');
          isShownError = true;
        }
        return Promise.reject(
          new Error('Server is not responding. Please try reload the page and try again.')
        );
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export const httpClient = ApiClient(process.env.NEXT_PUBLIC_API_URL);
