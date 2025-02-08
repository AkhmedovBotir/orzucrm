import axios from 'axios';

const API_URL = 'https://backend.milliycrm.uz/api';

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

// Categories API
export const getCategories = async () => {
  const response = await axios.get(`${API_URL}/categories`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return response.data.data;
};

export const getCategoryById = async (id) => {
  const response = await axios.get(`${API_URL}/categories/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return response.data.data;
};

export const createCategory = async (data) => {
  const response = await axios.post(`${API_URL}/categories`, data, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'application/json'
    }
  });
  return response.data.data;
};

export const updateCategory = async (id, data) => {
  const response = await axios.put(`${API_URL}/categories/${id}`, data, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'application/json'
    }
  });
  return response.data.data;
};

export const deleteCategory = async (id) => {
  const response = await axios.delete(`${API_URL}/categories/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return response.data.data;
};

// Subcategories API
export const createSubcategory = async (categoryId, data) => {
  const response = await axios.post(
    `${API_URL}/categories/${categoryId}/subcategories`,
    data,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data.data;
};

export const updateSubcategory = async (categoryId, subcategoryId, data) => {
  const response = await axios.put(
    `${API_URL}/categories/${categoryId}/subcategories/${subcategoryId}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data.data;
};

export const deleteSubcategory = async (categoryId, subcategoryId) => {
  const response = await axios.delete(
    `${API_URL}/categories/${categoryId}/subcategories/${subcategoryId}`,
    {
      headers: { Authorization: `Bearer ${getToken()}` }
    }
  );
  return response.data.data;
};

export const getCategoryWithSubs = async (categoryId) => {
  try {
    const response = await axios.get(`${API_URL}/categories/${categoryId}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};