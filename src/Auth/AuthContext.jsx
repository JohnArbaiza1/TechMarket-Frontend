import React, { createContext, useState, useContext, useEffect } from 'react';
import authservice from '../Services/authservice';
import {toast} from 'sonner';


//Definimos el contexto
const AuthContext = createContext();

//Proveedor del contexto
export const AuthProvider = ({ children }) => {
    //inicializamos nuestro isAuth con el valor que tengamos en el localstorage
    const [isAuth, setIsAuth] = useState(!!localStorage.getItem("token"));
    const [needsProfileSetup, setNeedsProfileSetup] = useState(
        JSON.parse(localStorage.getItem("needsProfileSetup")) || false
    );

    //función para iniciar sesión
    const login = async (userLogin, password) => {
        try{
            // Llamamos a la función login del authservice
            const data = await authservice.login(userLogin, password);
            console.log("Respuesta del login:", data);

            if (data.token) {
                localStorage.setItem("token", data.token);
                if (data.user && data.user.id) {
                    localStorage.setItem("user_id", data.user.id);
                }
                setIsAuth(true);// Actualiza estado de autenticación
            }

            return data;
        }catch(error){
            console.log(error);
            throw error;    
        }
    }

    // Función para el registro de usuarios
    const register = async (username, email, password, id_membership) => {
        try {
            // Usamos el servicio para hacer la solicitud de registro
            const data = await authservice.register(username, email, password, id_membership);
            toast.success('Usuario registrado Correctamente', {position:'top-center'})

            //Si el registro es exitoso, iniciamos sesión automaticamente
            if (data){
                setNeedsProfileSetup(true); //Indicamos que necesita configurar su perfil
                await login(username, password)
            }
            return data; 
            
        } catch (error) {
            // Si hay un error, lo mostramos
            console.error('Error al registrar el usuario:', error);
            throw error;
        }
    };
    
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
            localStorage.clear(); 

            // Actualiza el estado de autenticación en el contexto
            setNeedsProfileSetup(false); //Reiniciamos el estado al cerrar sesión
            setIsAuth(false);
        }catch(error){
            console.log("Error al cerrar la sesión ", error);
        }
    }

        // Guardar needsProfileSetup en localStorage cuando cambie
        useEffect(() => {
            localStorage.setItem("needsProfileSetup", JSON.stringify(needsProfileSetup));
        }, [needsProfileSetup]);
    
    return(
        <AuthContext.Provider value={{ isAuth, needsProfileSetup, setNeedsProfileSetup, login, logout, register}}>
        {children}
        </AuthContext.Provider>
    );
};

// Hook personalizado para usar el contexto
export const useAuth = () => useContext(AuthContext);