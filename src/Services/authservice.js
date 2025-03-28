//Importación la librería axios para hacer solicitudes HTTP
import axios from "axios";

import { createContext, useState, useEffect } from "react";

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

        //Guardamos el token en el storage si el login es exitoso
        if(response.data.token){
            localStorage.setItem("token", response.data.token)
        }

        return response.data

    }catch(e){
        if (e.response) {
            throw e.response.data.message || "Error al iniciar sesión";
        } else {
            throw "Error al conectar con el servidor";
        }
    }
}

export default {
    register,
    login
}