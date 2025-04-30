//Importación la librería axios para hacer solicitudes HTTP
import axios from "axios";
import {toast } from "sonner";

//Parte donde se trabaja el registro de usuario con la API

//Definimos una constante para almacenar la URL
const API_URL = 'http://localhost:8000/api/';

const register = async(user_name, email, password, id_membership ) =>{

    try{
        //Definimos la solicitud POST a la API para el registro del usuario
        const response = await axios.post(`${API_URL}register`,{
            user_name,
            email,
            user_pass: password,
            id_membership,
        });

        //Si la respuesta es exitosa devolvemos los datos
        return response.data;
    
    }catch(e){
        // Si ocurre un error en la solicitud hacemos lo siguiente
        if (e.response && e.response.data) {
            const errorData = e.response.data;
            // Errores de validación
            if (errorData.errors) {
                const errors = errorData.errors;
        
                if (errors.email) {
                    toast.error(errors.email[0], { position: 'top-center' });
                    console.log("Error de email:", errors.email[0]);
                }
                if (errors.user_name) {
                    toast.error(errors.user_name[0], { position: 'top-center' });
                    console.log("Error de username:", errors.user_name[0]);
                }
        
                // Lanzamos un mensaje más específico sobre qué campo falló
                if (errors.email) {
                    throw errors.email[0];
                } else if (errors.user_name) {
                    throw errors.user_name[0];
                } else {
                    throw 'Error de validación al registrar el usuario';
                }
            }
        }
    }
}

//Parte donde se trabaja el login
const login = async (userLogin, password) => {
    try{
        //Definimos la solicitud POST a la API para el inicio de sesión 
        const response = await axios.post(`${API_URL}login`,{
            login: userLogin, 
            user_pass:password
        });

        // console.log("Respuesta del backend en login:", response.data);

        //Guardamos el token en el storage si el login es exitoso
        if (response.data && response.data.token) {
            const user = response.data.user;
            try {
                localStorage.setItem("token", response.data.token);

                // Guardar datos del usuario con validación
                if (user.user_name) localStorage.setItem("user_name", user.user_name);
                if (user.email) localStorage.setItem("email", user.email);
                if (user.id_membership) localStorage.setItem("id_membership", user.id_membership);
                if (user.id) localStorage.setItem("user_id", user.id);

            } catch (storageError) {
                console.error("Error al guardar en localStorage:", storageError);
            }
        }
        return response.data;
    }catch(e){
        if (e.response) {
            throw e.response.data.message || "Error al iniciar sesión";
        }else if (e.request) {
            throw "No se recibió respuesta del servidor";
        }else {
            throw "Error al conectar con el servidor";
        }
    }
}

const logout = async (authorization) => {
    try{

        //Definimos la solictud Post para el cierre de la sesion
        const response = await axios.post(
            `${API_URL}logout`, 
            {},
            {
                headers: {
                    Authorization: `Bearer ${authorization}`
                }
            }
        );

        //eliminamos el token y los otros datos del localstorage
        localStorage.removeItem("token");
        localStorage.removeItem("user_name");
        localStorage.removeItem("email");
        localStorage.removeItem("id_membership");

        return response.data;
    }catch(e){
        if(e.response){
            throw e.response.data.message || "Error al cerrar la sesión";
        }else{
            throw "Error de servidor";
        }
    }
}

const updateMembership = async (id_membership) => {
    try {
        const authorization = localStorage.getItem("token");
        const response = await axios.post(
            `${API_URL}membershipsUpdate`, 
            { id_membership },
            {
                headers: {
                    Authorization: `Bearer ${authorization}`
                }
            }
        );
        return response;
    } catch (e) {
        if (e.response) {
            throw e.response.data.message || "Error al actualizar la membresía";
        } else {
            throw "Error de servidor";
        }
    }
}

const getMembership = async (id_membership) => {
    try {
        const authorization = localStorage.getItem("token");
        const response = await axios.get(
            `${API_URL}membership/${id_membership}`, 
            {
                headers: {
                    Authorization: `Bearer ${authorization}`
                }
            }
        );
        return response;
    } catch (e) {
        if (e.response) {
            throw e.response.data.message || "Error al obtener la membresía";
        } else {
            throw "Error de servidor";
        }
    }
}

export default {
    register,
    login,
    logout,
    updateMembership,
    getMembership
}