import React, { createContext, useState, useContext } from 'react';
import authservice from '../Services/authservice';

//Definimos el contexto
const AuthContext = createContext();

//Proveedor del contexto
export const AuthProvider = ({ children }) => {
    //inicializamos nuestro isAuth con el valor que tengamos en el localstorage
    const [isAuth, setIsAuth] = useState(!!localStorage.getItem("token"));

    // Función para el registro de usuarios
    const register = async (username, email, password) => {
        try {
            // Usamos el servicio para hacer la solicitud de registro
            const data = await authservice.register(username, email, password);
            console.log('Usuario registrado:', data);
            
        } catch (error) {
            // Si hay un error, lo mostramos
            console.error('Error al registrar el usuario:', error);
        }
    };

    //función para iniciar sesión
    const login = async (userLogin, password) => {
        try{
            // Llamamos a la función login del authservice
            const data = await authservice.login(userLogin, password);

            if (data.token) {
                localStorage.setItem("token", data.token);
                setIsAuth(true);  // Actualizar estado de autenticación
                console.log("Usuario autenticado:", data);
            }

        }catch(error){
            console.error("Error al iniciar sesión:", error);      
        }
    }
    
    //Función para cuando se cierra la sesión
    const logout = async () =>{
        try{

            const token = localStorage.getItem("token"); // Obtenemos el token almacenado
            if (!token) {
                console.warn("No hay token para cerrar sesión");
                return;
            }

            // Llamamos a la función logout del authservice y le pasamos el token
            await authservice.logout(token);
            // Eliminamos el token del localStorage
            localStorage.removeItem("token");
            // Actualiza el estado de autenticación en el contexto
            setIsAuth(false);
            console.log("Después de actualizar estado: ", isAuth);
        }catch(error){
            console.log("Error al cerrar la sesión ", error);
        }
    }
    
    return(
        <AuthContext.Provider value={{ isAuth, login, logout, register }}>
        {children}
        </AuthContext.Provider>
    );
};

// Hook personalizado para usar el contexto
export const useAuth = () => useContext(AuthContext);