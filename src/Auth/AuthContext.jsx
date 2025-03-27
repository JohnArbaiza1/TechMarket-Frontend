import React, { createContext, useState, useContext } from 'react';
import authservice from '../Services/authservice';

//Definimos el contexto
const AuthContext = createContext();

//Proveedor del contexto
export const AuthProvider = ({ children }) => {
    const [isAuth, setIsAuth] = useState(false);

    //función para iniciar sesión
    const login = () => setIsAuth(true);

    // Función para el registro de usuarios
    const register = async (username, email, password) => {
        try {
            // Usamos el servicio para hacer la solicitud de registro
            const data = await authservice.register(username, email, password);
            
            // Si el registro es exitoso, seteamos el estado de autenticación
            setIsAuth(true);
            console.log('Usuario registrado:', data);
        } catch (error) {
            // Si hay un error, lo mostramos
            console.error('Error al registrar el usuario:', error);
        }
    };
    
    //Función para cuando se cierra la sesión
    const logout = () => setIsAuth(false);
    
    return(
        <AuthContext.Provider value={{ isAuth, login, logout, register }}>
        {children}
        </AuthContext.Provider>
    );
};

// Hook personalizado para usar el contexto
export const useAuth = () => useContext(AuthContext);