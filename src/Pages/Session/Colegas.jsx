import { useEffect, useState } from 'react';
import userServices from '../../Services/userServices';
import { getProfile } from "../../Services/profileService";
import { toast } from 'sonner'; 
import { UserCard } from '../../Components/Card';
import '../../Styles/Logueado/RegisteredUsers.css' 

const RegisteredUsers = () =>{
    //Definimos los estados a emplear
    const [users, setUsers] = useState([]);
    const [profiles, setProfiles] = useState({});
    const [error] = useState(null);
    const [loading, setLoading] = useState(true); 
    // Estado que mantiene el estado de seguimiento de cada usuario
    const [followingStatus, setFollowingStatus] = useState({});

    // Función que cambia el estado isFollowing de un usuario específico
    const handleClick = (userId) => {
        setFollowingStatus((prevStatus) => ({
            ...prevStatus,
            [userId]: !prevStatus[userId], // Cambia el estado solo para ese usuario
        }));
    };

    useEffect(() => {
        const fetchUsersWithProfiles = async () => {
            const loadingToastId = toast.loading("Cargando usuarios...", { position: 'top-center' });
    
            try {
                const token = localStorage.getItem("token");
                const loggedUserId = parseInt(localStorage.getItem("user_id")); // Obtén el ID del usuario logueado
    
                const usersData = await userServices.getAllUsers(token);
    
                // Filtrar al usuario logueado
                const filteredUsers = usersData.filter(user => user.id !== loggedUserId);
    
                setUsers(filteredUsers);
    
                // Crear un objeto de perfiles directamente del JSON recibido
                const profilesMap = {};
                filteredUsers.forEach(user => {
                    profilesMap[user.id] = user.profile; // Ya viene incluido en la respuesta
                });
    
                setProfiles(profilesMap);
                toast.dismiss(loadingToastId);
                toast.success("Usuarios cargados correctamente", { position: 'top-center', duration: 3000 });
            } catch (err) {
                console.error("Error cargando usuarios:", err);
                toast.dismiss(loadingToastId);
                toast.error("No se pudieron cargar los usuarios. Intenta nuevamente.");
            } finally {
                setLoading(false);
            }
        };
    
        fetchUsersWithProfiles();
    }, []);

    if (loading) {
        return null; // Mientras cargan los datos no mostramos nada, el toast se encargará de la retroalimentación
    }

    if (error) return <div>{error}</div>;
    return(
        <>
            <h2 className="title text-center">Usuarios que Hacen Parte de Nuestra Comunidad</h2>
            <div className="users-list">
            {users.map(user => {
                const profile = profiles[user.id];
                if (!profile) return null;

                return (
                    <UserCard
                        key={user.id}
                        user={user}
                        profile={profile}
                        isFollowing={followingStatus[user.id]}
                        onFollowToggle={handleClick}
                    />
                );
            })}
            </div>
        </>
    );
}

export default RegisteredUsers;