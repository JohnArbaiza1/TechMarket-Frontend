import axios from 'axios';

const API_URL = 'http://localhost:8000/api/';

// Obtenemos todos los usuarios registrados (requiere token)
const getAllUsers = async (token) => {
    try {
        const response = await axios.get(`${API_URL}users`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (e) {
        if (e.response) {
            throw e.response.data.message || 'Error al obtener usuarios';
        } else {
            throw 'Error de conexión con el servidor';
        }
    }
};

export default {
    getAllUsers,
};