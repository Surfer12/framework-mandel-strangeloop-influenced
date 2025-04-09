import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
  // Get from local storage then
  // parse stored json or return initialValue
  const readValue = () => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState(readValue);

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have same API as useState
      const newValue = value instanceof Function ? value(storedValue) : value;

      // Save to local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(newValue));
      }

      // Save state
      setStoredValue(newValue);
    } catch (error) {
      // Sanitize key before logging to prevent log injection
      const sanitizedKey = encodeURIComponent(key);
      console.warn(`Error setting localStorage key "${sanitizedKey}":`, error);
    }
  };

  useEffect(() => {
    setStoredValue(readValue());
  }, []);

  return [storedValue, setValue];
} 