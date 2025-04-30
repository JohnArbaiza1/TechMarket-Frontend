import axios from "axios";

//Definimos una constante para almacenar la URL
const API_URL = 'http://localhost:8000/api/';

export const viewPlanes = async () =>{
    
    try {

        // Realizamos la solicitud GET sin parámetros adicionales
        const response = await axios.get(`${API_URL}listMemberships`);
        // console.log(response);
        return response; // Retorna la respuesta de la API
    } catch (error) {
        console.log(error);
        throw error;
    }

}