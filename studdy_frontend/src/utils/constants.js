// For development - use proxy path
export const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? '/user'  // This will be proxied to http://localhost:8080/user
  : 'http://localhost:8080/user';

export const FORM_VALIDATION = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[\+]?[1-9][\d]{0,15}$/,
  NAME: /^[A-Za-z\s'-]+$/,
  MIN_PASSWORD_LENGTH: 6
};