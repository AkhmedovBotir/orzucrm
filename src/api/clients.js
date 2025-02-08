import axios from 'axios';

const API_URL = 'https://backend.milliycrm.uz/api';
const getToken = () => localStorage.getItem('token');
const handleApiError = (error) => {
  if (error.response) {
    return error.response.data.message || 'Xatolik yuz berdi';
  } else {
    return 'Server xatolik yuz berdi';
  }
}

export const getClients = async () => {
  try {
    const response = await axios.get(`${API_URL}/clients`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getClient = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/clients/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createClient = async (clientData) => {
  try {
    const response = await axios.post(`${API_URL}/clients`, clientData, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateClient = async (id, clientData) => {
  try {
    const response = await axios.put(`${API_URL}/clients/${id}`, clientData, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateClientStatus = async (id, status) => {
  try {
    const response = await axios.patch(`${API_URL}/clients/${id}/status`, { status }, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteClient = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/clients/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
