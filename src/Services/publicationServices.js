import axios from "axios";

//Definimos una constante para almacenar la URL base de la API
const API_URL = 'http://localhost:8000/api/';

// // Función para crear una publicación
export const createPublication = async (publicationData) => {
    try {
        const token = localStorage.getItem("token");
        
        if (!token) throw new Error("Faltan datos de autenticación");

        const response = await axios.post(`${API_URL}publication`, 
            publicationData,  // Enviar FormData directamente
            {
                headers: {
                    "Authorization": `Bearer ${token}`,
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error("Error al crear la publicación:", error.response?.data || error.message);
        throw error;
    }
};

export const getUserPublicationLimit = async (userId) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Faltan datos de autenticación");

        const response = await axios.get(`${API_URL}user/${userId}/publication-limit`, {
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        });

        return response.data;  // Regresa la información del límite de publicaciones
    } catch (error) {
        console.error("Error al obtener el límite de publicaciones:", error.response?.data || error.message);
        throw error;
    }
};

export const getPulications = async ()=>{
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Faltan datos de autenticación");

        const response = await axios.get(`${API_URL}publications`, {});

        return response.data;  // Regresa la información de las publicaciones
    } catch (error) {
        console.error("Error al obtener las publicaciones:", error.response?.data || error.message);
        throw error;
    }
}

//Para las publicaciones de un usuario 
export const getPublicationsUser = async (userId) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Faltan datos de autenticación");

        const response = await axios.get(`${API_URL}publications/${userId}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error al obtener las publicaciones del usuario:", error.response?.data || error.message);
        throw error;
    }
};

//Para obtener una publicación por su ID
export const getPublicationById = async (publicationId) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Faltan datos de autenticación");

        const response = await axios.get(`${API_URL}publication/${publicationId}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error al obtener la publicación por ID:", error.response?.data || error.message);
        throw error;
    }
};




