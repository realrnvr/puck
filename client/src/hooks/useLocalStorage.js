import { useCallback, useState } from "react";

export const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item !== null && item !== undefined && item !== "undefined"
        ? JSON.parse(item)
        : initialValue;
    } catch (error) {
      console.log("Error accessing localStorage", error);
      return initialValue;
    }
  });

  const setValueWrapper = useCallback(
    (updatedValue) => {
      try {
        const valueToStore =
          updatedValue instanceof Function ? updatedValue(value) : updatedValue;
        setValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.log("Error adding into localStorage", error);
      }
    },
    [key, value]
  );

  return [value, setValueWrapper];
};
