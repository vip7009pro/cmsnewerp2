import { useState, useEffect } from 'react';

const useLocalStorageArray = (key: string): [string[], (newValue: string[]) => void] => {
  const [value, setValue] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const storedValue = localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : ['ALL'];
    }
    return ['ALL'];
  });

  const updateValue = (newValue: string[]) => {
    setValue(newValue);
  };

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, updateValue];
};

export default useLocalStorageArray;