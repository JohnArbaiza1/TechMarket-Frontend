import React, { createContext, useState, useContext } from 'react';

//Definimos el contexto
const AuthContext = createContext();

//Proveedor del contexto
export const AuthProvider = ({ children }) => {
    const [isAuth, setIsAuth] = useState(false);

    //función para iniciar sesión
    const login = () => setIsAuth(true);

    //función para el registro de usuarios
    const register = (username, email, password) =>{
        // esto solo es de prueba acá iria lo de la API
        console.log('Usuario registrado:', { username, email, password });
        setIsAuth(true);
    }
    
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