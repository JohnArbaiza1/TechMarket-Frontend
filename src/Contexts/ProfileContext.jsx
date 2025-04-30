// Importación de React y hooks necesarios
import { createContext, useState, useEffect, useContext } from 'react';
// Importa la función para obtener el perfil desde el servicio correspondiente
import { getProfile } from '../Services/profileService';

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
    //Definimos los estados a emplear
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);
    
    // Agregamos un estado para rastrear el estado de autenticación
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("user_id"));

    // Efecto para monitorear cambios en el estado de inicio de sesión
    useEffect(() => {
        const checkAuthStatus = () => {
            // Obtiene el ID del usuario desde localStorage
            const userId = localStorage.getItem("user_id");
            setIsAuthenticated(!!userId);
        };

        // Verificar inmediatamente
        checkAuthStatus();

        // Configurar un listener de eventos para cambios en el almacenamiento
        window.addEventListener('storage', checkAuthStatus);
        
        // Evento personalizado para cambios de autenticación en la misma ventana
        window.addEventListener('authChanged', checkAuthStatus);

        return () => {
            window.removeEventListener('storage', checkAuthStatus);
            window.removeEventListener('authChanged', checkAuthStatus);
        };
    }, []);

    // Obtener perfil cuando cambie el estado de autenticación
    useEffect(() => {
        if (isAuthenticated) {
            fetchProfile();
        } else {
            setProfile(null);
        }
    }, [isAuthenticated]);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const userId = localStorage.getItem("user_id");
            if (!userId) {
                console.log("No hay usuario logueado o ID no encontrado");
                setLoading(false);
                return;
            }
    
            const response = await getProfile(userId);
            console.log("Perfil cargado en contexto:", response.data);
            setProfile(response.data);
            // Reiniciar estados de imagen cuando se actualiza el perfil
            setImageLoaded(false);
            setImageError(false);
        } catch (error) {
            console.error("Error al cargar el perfil:", error);
            setError("Error al cargar el perfil");
        } finally {
            setLoading(false);
        }
    };

    const refreshProfile = async () => {
        await fetchProfile();
    };

    const handleImageError = () => {
        setImageError(true);
    };

    // Maneja el evento de imagen cargada correctamente
    const handleImageLoad = () => {
        setImageLoaded(true);
    };

    // Devuelve la URL de la imagen del perfil o una por defecto si hay error
    const getProfileImage = () => {
        if (imageError || !profile?.image_url) {
            return "https://unavatar.io/github/defaultuser";
        }
        return profile.image_url;
    };

    // Retorna el proveedor del contexto con todos los valores necesarios
    return (
        <ProfileContext.Provider 
            value={{ 
                profile, 
                loading, 
                error, 
                refreshProfile,
                imageLoaded,
                imageError,
                handleImageError,
                handleImageLoad,
                getProfileImage,
                isAuthenticated
            }}
        >
            {children}
        </ProfileContext.Provider>
    );
};

// Hook personalizado para consumir el contexto más fácilmente
export const useProfile = () => useContext(ProfileContext);