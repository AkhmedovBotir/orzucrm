import axios from 'axios';

const API_URL = 'https://backend.milliycrm.uz/api';

const getToken = () => {
  return localStorage.getItem('token');
};

const handleApiError = (error) => {
  if (error.response) {
    throw new Error(error.response.data.message || 'API Error');
  }
  throw error;
};

export const getProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/products`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateProductStatus = async (id, status) => {
  try {
    const response = await axios.patch(`${API_URL}/products/${id}/status`, 
      { status },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createProduct = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/products`, formData, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      }
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/products/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      }
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateProduct = async (id, formData) => {
  try {
    const response = await axios.put(`${API_URL}/products/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      }
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
