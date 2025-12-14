import crypto from 'node:crypto';

const getSecretKey = (): string => {
  const secret = process.env.PASSWORD_SECRET_KEY || 'default-secret-key-change-in-production';

  return secret;
};

export const hashPassword = (password: string): string => {
  return crypto
    .createHmac('sha256', getSecretKey())
    .update(password)
    .digest('hex');
};

export const verifyPassword = (password: string, hashedPassword: string): boolean => {
  return hashPassword(password) === hashedPassword;
};
