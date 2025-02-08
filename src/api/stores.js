import axios from 'axios';

const API_URL = 'https://backend.milliycrm.uz/api';

const handleApiError = (error) => {
  if (error.response) {
    throw new Error(error.response.data.message || 'API Error');
  }
  throw error;
};

const getToken = () => localStorage.getItem('token');

export const getStores = async () => {
  try {
    const response = await axios.get(`${API_URL}/stores`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getStore = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/stores/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createStore = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/stores`, formData, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateStoreStatus = async (id, status) => {
  try {
    const response = await axios.patch(
      `${API_URL}/stores/${id}/status`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      }
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteStore = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/stores/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateStore = async (id, formData) => {
  try {
    const response = await axios.put(`${API_URL}/stores/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
