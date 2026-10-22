import { useCallback, useState } from "react";

type SetStoredValue<T> = (updatedValue: T | ((previous: T) => T)) => void;

export const useLocalStorage = <T>(
  key: string,
  initialValue: T,
): [T, SetStoredValue<T>] => {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item !== null && item !== undefined && item !== "undefined"
        ? (JSON.parse(item) as T)
        : initialValue;
    } catch (error) {
      console.log("Error accessing localStorage", error);
      return initialValue;
    }
  });

  const setValueWrapper = useCallback(
    (updatedValue: T | ((previous: T) => T)) => {
      try {
        const valueToStore =
          updatedValue instanceof Function ? updatedValue(value) : updatedValue;
        setValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.log("Error adding into localStorage", error);
      }
    },
    [key, value],
  );

  return [value, setValueWrapper];
};
