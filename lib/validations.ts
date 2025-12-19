export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export const validateEmail = (email: string): void => {
  if (!email || typeof email !== 'string') {
    throw new ValidationError('Email is required');
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ValidationError('Invalid email format');
  }
};

export const validatePassword = (password: string, minLength = 8): void => {
  if (!password || typeof password !== 'string') {
    throw new ValidationError('Password is required');
  }
  if (password.length < minLength) {
    throw new ValidationError(`Password must be at least ${minLength} characters`);
  }
  // Check for at least one uppercase, one lowercase, one number
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    throw new ValidationError('Password must contain uppercase, lowercase, and number');
  }
};

export const validateName = (name: string): void => {
  if (!name || typeof name !== 'string') {
    throw new ValidationError('Name is required');
  }
  if (name.trim().length < 2) {
    throw new ValidationError('Name must be at least 2 characters');
  }
};