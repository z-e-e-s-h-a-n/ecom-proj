export const getLocalStorage = <T>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  const storedValue = localStorage.getItem(key);
  return storedValue ? (JSON.parse(storedValue) as T) : fallback;
};

export const updateLocalStorage = <T>(key: string, data: T): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const calculateCartPrice = (price: number, quantity: number) =>
  price * quantity;

export const handleError = (error: unknown, message: string) => {
  console.log(error, message);
  throw error;
};
