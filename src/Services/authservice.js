//Importación la librería axios para hacer solicitudes HTTP
import axios from "axios";

//Parte donde se trabaja el registro de usuario con la API

//Definimos una constante para almacenar la URL
const register_url = 'http://localhost:8000/api/';

const register = async(user_name, email, password ) =>{
    try{
        //Definimos la solicitud POST a la API para el registro del usuario
        const response = await axios.post(`${register_url}register`,{
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

export default {
    register
}