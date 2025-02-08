import axios from 'axios';

const API_URL = 'https://backend.milliycrm.uz/api';
const getToken = () => localStorage.getItem('token');
const handleApiError = (error) => {
  if (error.response) {
    return error.response.data.message;
  } else {
    return 'Network error';
  }
}
export const getAgents = async () => {
  try {
    const response = await axios.get(`${API_URL}/agents`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateAgentStatus = async (id, status) => {
  try {
    const response = await axios.patch(
      `${API_URL}/agents/${id}/status`,
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

export const getAgent = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/agents/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });
    return response.data.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteAgent = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/agents/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateAgent = async (id, agentData) => {
  try {
    const response = await axios.put(`${API_URL}/agents/${id}`, agentData, {
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

export const createAgent = async (agentData) => {
  try {
    const response = await axios.post(`${API_URL}/agents`, agentData, {
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
