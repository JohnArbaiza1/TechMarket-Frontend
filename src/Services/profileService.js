import axios from "axios";

//Definimos una constante para almacenar la URL
const API_URL = 'http://localhost:8000/api/';


//Función para crear el peril del usuario
export const createProfile = async (formData) => {
    try {
        const token = localStorage.getItem("token"); // Obtiene token del localStorage
        const userId = localStorage.getItem("user_id"); // Obtiene el ID del usuario

        if (!token || !userId) throw new Error("Faltan datos de autenticación");

        const response = await axios.post(`${API_URL}profile`, { 
            ...formData, 
            id_user: userId  //Agrega el ID del usuario en la solicitud
        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        return response.data;
    } catch (error) {
        console.error("Error al guardar el perfil:", error.response?.data || error.message);
        throw error;
    }
};

//Función para obtener un perfil por ID de usuario
export const getProfile = async (idUser) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No hay token disponible");

    return await axios.get(`${API_URL}profile/${idUser}`, {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });
};

//Función para actualizar un perfil
export const updateProfile = async (idUser, profileData) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No hay token disponible");

    return await axios.put(`${API_URL}profile/${idUser}`, profileData, {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });
};