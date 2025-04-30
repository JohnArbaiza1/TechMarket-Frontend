import axios from 'axios';

const API_URL = 'http://localhost:8000/api/';

// Seguir a un usuario
export const followUser = async (userId, token) => {
    try {
        const response = await axios.post(`${API_URL}follow/${userId}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (e) {
        throw e.response?.data?.message || 'Error al seguir al usuario';
    }
};

// Dejar de seguir a un usuario
export const unfollowUser = async (userId, token) => {
    try {
        const response = await axios.post(`${API_URL}unfollow/${userId}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (e) {
        throw e.response?.data?.message || 'Error al dejar de seguir al usuario';
    }
};

// Obtener mis seguidores
export const getFollowers = async (token, search = '') => {
    try {
        const response = await axios.get(`${API_URL}followers?search=${search}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (e) {
        throw e.response?.data?.message || 'Error al obtener seguidores';
    }
};

// Obtener usuarios que sigo
export const getFollowing = async (token, search = '') => {
    try {
        const response = await axios.get(`${API_URL}following?search=${search}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (e) {
        throw e.response?.data?.message || 'Error al obtener seguidos';
    }
};



