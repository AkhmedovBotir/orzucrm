import axios from 'axios';

const API_URL = 'https://backend.milliycrm.uz/api';

const getToken = () => localStorage.getItem('token');
const handleApiError = (error) => {
  if (error.response) {
    return error.response.data.message;
  } else if (error.request) {
    return 'Server is not responding';
  } else {
    return 'Something went wrong';
  }
};

export const getRegions = async () => {
  try {
    const response = await axios.get(`${API_URL}/regions`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createRegion = async (regionData) => {
  try {
    const response = await axios.post(`${API_URL}/regions`, regionData, {
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

export const updateRegion = async (id, regionData) => {
  try {
    const response = await axios.put(`${API_URL}/regions/${id}`, regionData, {
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

export const deleteRegion = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/regions/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateRegionStatus = async (id, status) => {
  try {
    const response = await axios.patch(`${API_URL}/regions/${id}/status`, { status }, {
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
