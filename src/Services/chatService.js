import axios from "axios";

//Definimos una constante para almacenar la URL base de la API
const API_URL = 'http://localhost:8000/api/';

// funcion para mandar mensaje y crear chat
export const CreateChatMessage = async (user_two_id, message, id_publication) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Faltan datos de autenticación");

        const response = await axios.post(`${API_URL}messages`, {
            message: message,
            user_two_id: user_two_id,  // ID del usuario receptor
            id_publication: id_publication, // ID de la publicación (opcional)
        }, {
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        });

        return response.data;  
    } catch (error) {
        console.error("Error al enviar el mensaje:", error.response?.data || error.message);
        throw error;
    }
};
//Funcion para obtener los chats
export const getChats = async () => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Faltan datos de autenticación");

        const response = await axios.get(`${API_URL}messages`, {
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        });
        console.log("Respuesta de getChats:", response.data); // Verificar la respuesta
        return response.data;  
    } catch (error) {
        console.error("Error al obtener los mensajes:", error.response?.data || error.message);
        throw error;
    }
};
//funcion para mandar mensaje
export const sendMessage = async (id_chat, message) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Faltan datos de autenticación");

        const response = await axios.post(`${API_URL}messages`, {
            message: message,
            id_chat: id_chat, 
        }, {
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        });

        return response.data;  
    } catch (error) {
        console.error("Error al enviar el mensaje:", error.response?.data || error.message);
        throw error;
    }
};
//Funcion para obtener los ids de los chats del usuario logueado
export const getChatIds = async () => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Faltan datos de autenticación");

        const response = await axios.get(`${API_URL}chat`, {
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        });
        return response.data;  
    } catch (error) {
        console.error("Error al obtener los mensajes:", error.response?.data || error.message);
        throw error;
    }
};
//Funcion para cambiar de estado el mensaje
export const changeStateMessage = async (id_message) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Faltan datos de autenticación");

        const response = await axios.put(`${API_URL}messages`, {
            id_chat: id_message,
        }, {
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        });
        return response;  
    } catch (error) {
        console.error("Error al cambiar el estado del mensaje:", error.response?.data || error.message);
        throw error;
    }
};

export const getChatDetails = async (id_chat) => {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}chats/${id_chat}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Error al obtener los detalles del chat");
        }

        return await response.json();
    } catch (error) {
        console.error("Error al obtener los detalles del chat:", error);
        throw error;
    }
};