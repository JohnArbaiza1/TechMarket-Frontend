// Importación de React y hooks necesarios
import { createContext, useState, useEffect, useContext } from 'react';
// Importa la función para obtener el perfil desde el servicio correspondiente
import { getProfile } from '../Services/profileService';

// Crea el contexto de perfil
const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
    //Definimos los estados a emplear
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    // Hook que se ejecuta al montar el componente
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Obtiene el ID del usuario desde localStorage
                const userId = localStorage.getItem("user_id");
                if (!userId) {
                    console.log("No hay usuario logueado o ID no encontrado");
                    setLoading(false);
                    return;
                }
        
                // Llama al servicio para obtener el perfil
                const response = await getProfile(userId);
                console.log("Perfil cargado en contexto:", response.data);
                setProfile(response.data); // Almacena el perfil en el estado
            } catch (error) {
                console.error("Error al cargar el perfil:", error);
                setError("Error al cargar el perfil"); // Guarda el error
            } finally {
                setLoading(false);// Finaliza la carga, sin importar si hubo error o no
            }
        };
            fetchProfile();// Ejecuta la función
    }, []);// Solo se ejecuta una vez al montar el componente

    // Función para actualizar manualmente el perfil
    const refreshProfile = async () => {
    setLoading(true);
        try {
            const userId = localStorage.getItem("user_id");
            if (!userId) return;
            
            const response = await getProfile(userId);
            setProfile(response.data);
            // Resetear estados de imagen cuando se actualiza el perfil
            setImageLoaded(false);
            setImageError(false);
        } catch (error) {
            setError("Error al actualizar el perfil");
            console.error("Error al actualizar el perfil:", error);
        } finally {
            setLoading(false);
        }
    };

    // Maneja el error al cargar la imagen del perfil
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
        return "https://unavatar.io/github/defaultuser"; // Imagen por defecto
        }
        return profile.image_url; // Imagen del usuario
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
                getProfileImage
            }}
        >
        {children}
        </ProfileContext.Provider>
    );
};
// Hook personalizado para consumir el contexto más fácilmente
export const useProfile = () => useContext(ProfileContext);