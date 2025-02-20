const envConfig = {
  env: process.env.NODE_ENV,

  app: {
    endpoint: process.env.NEXT_PUBLIC_APP_ENDPOINT,
  },
  server: {
    endpoint: process.env.NEXT_PUBLIC_SERVER_ENDPOINT,
  },
};

export default envConfig;
