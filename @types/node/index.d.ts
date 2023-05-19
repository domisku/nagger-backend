declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production";
      DATABASE_URL: string;
      JWT_SECRET: string;
      SMTP_EMAIL: string;
      SMTP_PASSWORD: string;
      VAPID_PUBLIC_KEY: string;
      VAPID_PRIVATE_KEY: string;
      REDIS_PASSWORD: string;
      REDIS_HOST: string;
    }
  }
}

export {};
