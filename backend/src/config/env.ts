const requiredEnv = (key: string): string => {
  const value = process.env[key]
  if (!value) throw new Error(`❌ Missing environment variable: ${key}`)
  return value
}

const optionalEnv = (key: string, defaultValue: string | number): string | number => {
  const value = process.env[key]
  return value
    ? typeof defaultValue === 'number'
      ? parseInt(value, 10)
      : value
    : defaultValue
}

export const env = {
  NODE_ENV: requiredEnv('NODE_ENV'),
  DEV_AUTH_SECRET: requiredEnv('DEV_AUTH_SECRET'),
  CORS_ORIGIN: requiredEnv('CORS_ORIGIN'),
  PORT: requiredEnv('PORT'),
  STORAGE_PROVIDER: requiredEnv('STORAGE_PROVIDER'),
  GOOGLE_CLIENT_ID: requiredEnv('GOOGLE_LOGIN_CLIENT_ID'),
  GOOGLE_CLIENT_SECRET: requiredEnv('GOOGLE_LOGIN_CLIENT_SECRET'),
  GOOGLE_CALLBACK_URL: requiredEnv('GOOGLE_LOGIN_CALLBACK_URL'),
  GITHUB_CALLBACK_URL: requiredEnv('GITHUB_LOGIN_CALLBACK_URL'),
  GITHUB_CLIENT_ID: requiredEnv('GITHUB_LOGIN_CLIENT_ID'),
  GITHUB_CLIENT_SECRET: requiredEnv('GITHUB_LOGIN_CLIENT_SECRET'),
  ACCESS_TOKEN_SECRET: requiredEnv('ACCESS_TOKEN_SECRET'),
  REFRESH_TOKEN_SECRET: requiredEnv('REFRESH_TOKEN_SECRET'),
  ACCESS_TOKEN_EXPIRY: requiredEnv('ACCESS_TOKEN_EXPIRY'),
  REFRESH_TOKEN_EXPIRY: requiredEnv('REFRESH_TOKEN_EXPIRY'),
  CLIENT_URL: requiredEnv('CLIENT_URL'),
  EMAIL_HOST: requiredEnv('EMAIL_HOST'),
  EMAIL_PORT: requiredEnv('EMAIL_PORT'),
  BREVO_SMTP_USER: requiredEnv('BREVO_SMTP_USER'),
  BREVO_SMTP_PASS: requiredEnv('BREVO_SMTP_PASS'),
  EMAIL_FROM: requiredEnv('EMAIL_FROM'),
  R2_ACCESS_KEY_ID: requiredEnv('R2_ACCESS_KEY_ID'),
  R2_SECRET_ACCESS_KEY: requiredEnv('R2_SECRET_ACCESS_KEY'),
  R2_ENDPOINT: requiredEnv('R2_ENDPOINT'),
  R2_BUCKET_NAME: requiredEnv('R2_BUCKET_NAME'),
  R2_AVATAR_BUCKET_NAME: requiredEnv('R2_AVATAR_BUCKET_NAME'),
  R2_TOKEN_VALUE: requiredEnv('R2_TOKEN_VALUE'),
  R2_AVATARS_PUBLIC_BASE_URL: requiredEnv('R2_AVATARS_PUBLIC_BASE_URL'),
  GOOGLE_INTEGRATION_CALLBACK_URL: requiredEnv('GOOGLE_INTEGRATION_CALLBACK_URL'),

  GITHUB_PAT: requiredEnv('GITHUB_PAT'),
  GITHUB_OWNER: requiredEnv('GITHUB_OWNER'),
  GITHUB_REPO: requiredEnv('GITHUB_REPO'),

  ENABLE_RATE_LIMIT: optionalEnv('ENABLE_RATE_LIMIT', 'true') === 'true',
  GLOBAL_RATE_LIMIT: optionalEnv('GLOBAL_RATE_LIMIT', 100) as number,
  AUTH_RATE_LIMIT: optionalEnv('AUTH_RATE_LIMIT', 5) as number,
  UPLOAD_RATE_LIMIT: optionalEnv('UPLOAD_RATE_LIMIT', 30) as number,
  API_RATE_LIMIT: optionalEnv('API_RATE_LIMIT', 60) as number,
  INTEGRATION_RATE_LIMIT: optionalEnv('INTEGRATION_RATE_LIMIT', 20) as number,
  REFRESH_TOKEN_RATE_LIMIT: optionalEnv('REFRESH_TOKEN_RATE_LIMIT', 10) as number,
}
