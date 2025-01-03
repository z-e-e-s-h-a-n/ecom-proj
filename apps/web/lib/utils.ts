/* eslint-disable @typescript-eslint/no-explicit-any */
export const getEnv = (key: string, fallback?: string): string => {
  const value = process.env[key];
  if (!value && !fallback)
    throw new Error(`Missing environment variable: ${key}`);
  return value || fallback!;
};

export const getLocalStorage = (key: string, fallback: any) => {
  return typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem(key) || fallback)
    : fallback;
};

export const handleError = (error: unknown, message: string) => {
  console.log(error, message);
  throw error;
};
