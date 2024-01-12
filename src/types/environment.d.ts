declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string;
      URL: string;
      PORT: string;
      MONGODB_URL: string;
      JWT_SECRET: string;
      ADMIN_TOKEN: string;
      CONSUMER_TOKEN: string;
      EMPLOYER_TOKEN: string;
    }
  }
}

export {};
