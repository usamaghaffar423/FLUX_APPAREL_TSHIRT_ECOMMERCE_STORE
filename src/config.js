export const API_BASE_URL = import.meta.env.PROD
    ? '/api'
    : 'http://localhost/T-SHIRT-ECOMMERCE-STORE/api';

// Base URL for product images stored as relative paths in the DB
export const IMAGE_BASE_URL = import.meta.env.PROD
    ? '/'
    : 'http://localhost/T-SHIRT-ECOMMERCE-STORE/';
