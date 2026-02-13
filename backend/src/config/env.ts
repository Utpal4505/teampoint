const requiredEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`❌ Missing environment variable: ${key}`);
  return value;
};

export const env = {
  GOOGLE_CLIENT_ID: requiredEnv("GOOGLE_LOGIN_CLIENT_ID"),
  GOOGLE_CLIENT_SECRET: requiredEnv("GOOGLE_LOGIN_CLIENT_SECRET"),
  GOOGLE_CALLBACK_URL: requiredEnv("GOOGLE_LOGIN_CALLBACK_URL"),
  GITHUB_CALLBACK_URL: requiredEnv("GITHUB_LOGIN_CALLBACK_URL"),
  GITHUB_CLIENT_ID: requiredEnv("GITHUB_LOGIN_CLIENT_ID"),
  GITHUB_CLIENT_SECRET: requiredEnv("GITHUB_LOGIN_CLIENT_SECRET"),
  ACCESS_TOKEN_SECRET: requiredEnv("ACCESS_TOKEN_SECRET"),
  REFRESH_TOKEN_SECRET: requiredEnv("REFRESH_TOKEN_SECRET"),
  ACCESS_TOKEN_EXPIRY: requiredEnv("ACCESS_TOKEN_EXPIRY"),
  REFRESH_TOKEN_EXPIRY: requiredEnv("REFRESH_TOKEN_EXPIRY"),
  CLIENT_URL: requiredEnv("CLIENT_URL")
};
