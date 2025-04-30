import axios from "axios";

//Definimos una constante para almacenar la URL base de la API
const API_URL = 'http://localhost:8000/api/';

export const postAplicationProyect = async (applicationData) => {
    try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("user_id");
        if (!userId) throw new Error("Faltan datos de usuario");
        
        if (!token) throw new Error("Faltan datos de autenticación");

        const response = await axios.post(`${API_URL}applicant`, 
            applicationData, 
            {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                params: {
                    id_publication: applicationData.id_publication, // Agregar el ID de la publicación como parámetro
                    id_user: userId, // Agregar el ID del usuario como parámetro
                },
            }
        );
        return response;
    } catch (error) {
        console.error("Error al crear la publicación:", error.response?.data || error.message);
        throw error;
    }
}
export const getPulicationsByidUser = async (id_user) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Faltan datos de autenticación");

        const response = await axios.get(`${API_URL}applicants/user/${id_user}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error al obtener las publicaciones:", error.response?.data || error.message);
        throw error;
    }
}
export const delApplicantUserPublication = async (id_publication) => {
    try {
        const token = localStorage.getItem("token");
        const id_user = localStorage.getItem("user_id");
        if (!token) throw new Error("Faltan datos de autenticación");

        const response = await axios.delete(`${API_URL}applicants/user/${id_user}/publication/${id_publication}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
            params: {
                id_publication: id_publication, // Agregar el ID de la publicación como parámetro
            },
        });

        return response;
    } catch (error) {
        console.error("Error al eliminar la solicitud:", error.response?.data || error.message);
        throw error;
    }
}

    //Obtiene las solicitudes que tiene un proyecto por id
    export const getApplicantByPublication = async (id_publication) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Faltan datos de autenticación");

            const response = await axios.get(`${API_URL}applicants/publication/${id_publication}`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });
            return response;
        } catch (error) {
            console.error("Error al obtener las solicitudes:", error.response?.data || error.message);
            throw error;
        }
    }

    //Cambia el estado de la solicitud
    export const updateApplicant = async (id_publicacion, id_user, status) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Faltan datos de autenticación");
    
            // Configurar la solicitud correctamente
            const response = await axios.put(
                `${API_URL}applicant`,
                {
                    id_publication: id_publicacion, // Datos del cuerpo de la solicitud
                    id_user: id_user,
                    status: status,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Encabezado de autenticación
                    },
                }
            );
    
            return response;
        } catch (error) {
            console.error("Error al actualizar la solicitud:", error.response?.data || error.message);
            throw error.response?.data || error.message || "Error al actualizar la solicitud.";
        }
    };
    //Obtiene las solicitudes las cuales su estado es true
    export const getApplicantByStatus = async (id_publication) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Faltan datos de autenticación");

            const response = await axios.get(`${API_URL}applicant/${id_publication}/accepted`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });
            return response;
        } catch (error) {
            console.error("Error al obtener las solicitudes:", error.response?.data || error.message);
            throw error;
        }
    }
    //obtene las aplicaciones que ha hecho el usuario siempre y cuando el is_selected sea true
    export const getApplicantByUser = async (id_user) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Faltan datos de autenticación");

            const response = await axios.get(`${API_URL}applicants/user/${id_user}`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });
            return response;
        } catch (error) {
            console.error("Error al obtener las solicitudes:", error.response?.data || error.message);
            throw error;
        }
    }







