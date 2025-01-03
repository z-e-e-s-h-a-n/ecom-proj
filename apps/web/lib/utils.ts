export const getEnv = (key: string, fallback?: string): string => {
  const value = process.env[key];
  if (!value && !fallback)
    throw new Error(`Missing environment variable: ${key}`);
  return value || fallback!;
};

export const handleError = (error: unknown, message: string) => {
  console.log(error, message);
  throw error;
};
