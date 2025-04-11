//Importación la librería axios para hacer solicitudes HTTP
import axios from "axios";

//Parte donde se trabaja el registro de usuario con la API

//Definimos una constante para almacenar la URL
const API_URL = 'http://localhost:8000/api/';

const register = async(user_name, email, password ) =>{
    try{
        //Definimos la solicitud POST a la API para el registro del usuario
        const response = await axios.post(`${API_URL}register`,{
            user_name,
            email,
            user_pass: password,
        });

        //Si la respuesta es exitosa devolvemos los datos
        return response.data;
    
    }catch(e){
        // Si ocurre un error en la solicitud hacemos lo siguiente
        if (e.response) {
            //mostramos un mensaje de error que envía la API
            throw e.response.data.message ||'Error al registrar el usuario';
        } else {
            // Si no hay respuesta del servidor mostramos el mensaje siguiente
            throw 'Error al conectar con el servidor';
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

        console.log("Respuesta del backend en login:", response.data);

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

export default {
    register,
    login,
    logout
}