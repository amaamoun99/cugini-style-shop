import axiosInstance from './axiosInstance';

/**
 * Logs a user in with email and password
 * @param {string} email User's email
 * @param {string} password User's password
 * @returns {Promise<Object>} Response containing auth token
 */
export const login = async (email, password) => {
  try {
    const response = await axiosInstance.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Registers a new user
 * @param {string} name User's name
 * @param {string} email User's email
 * @param {string} password User's password
 * @returns {Promise<Object>} Response containing auth token
 */
export const register = async (name, email, password) => {
  try {
    const response = await axiosInstance.post('/auth/register', { name, email, password });
    return response.data;
  } catch (error) {
    console.error('Registration error:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Gets current user profile information
 * @returns {Promise<Object>} User profile data
 */
export const getCurrentUser = async () => {
  try {
    const response = await axiosInstance.get('/auth/me');
    return response.data;
  } catch (error) {
    console.error('Get user error:', error.response?.data || error.message);
    throw error;
  }
};
