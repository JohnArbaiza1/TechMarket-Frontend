import { useEffect, useState } from 'react';
import userServices from '../../Services/userServices';
import { getProfile } from "../../Services/profileService";
import { toast } from 'sonner'; 
import '../../Styles/Logueado/RegisteredUsers.css' 

const RegisteredUsers = () =>{
    //Definimos los estados a emplear
    const [users, setUsers] = useState([]);
    const [profiles, setProfiles] = useState({});
    const [error, setError] = useState(null);
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

    //hacemos un renderizado condicional
    const getButtonText = (userId) => {
        return followingStatus[userId] ? "Siguiendo" : "Seguir";
    };

    const getButtonClass = (userId) => {
        return followingStatus[userId] ? 'btn-followCard is-following' : 'btn-followCard';
    };

    useEffect(() => {
        const fetchUsersAndProfiles = async () => {
        const loadingToastId = toast.loading("Cargando usuarios...",{position:'top-center'});
            try {
                const token = localStorage.getItem("token");
                const usersData = await userServices.getAllUsers(token);
                setUsers(usersData);

                // Obtener todos los perfiles en paralelo
                const profilePromises = usersData.map(user => getProfile(user.id));
                const profilesData = await Promise.all(profilePromises);

                // Asociar cada perfil a su user.id
                const profilesMap = {};
                usersData.forEach((user, index) => {
                    profilesMap[user.id] = profilesData[index].data;
                });

                setProfiles(profilesMap);
                toast.dismiss(loadingToastId);
                toast.success("Usuarios cargados correctamente",{position:'top-center',duration: 3000});

            } catch (err) {
                console.error("Error cargando usuarios o perfiles:", err);
                // Cerramos el toast de carga y mostramos error
                toast.dismiss(loadingToastId);
                toast.error("No se pudieron cargar los usuarios. Intenta nuevamente.");
            }finally {
                setLoading(false);  // Al finalizar la carga, cambiamos el estado
            }
        };

        fetchUsersAndProfiles();
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
                        <section key={user.id} className='followCard'>
                            <header className='followCard-Header'>
                                <img src={profile.image_url} alt="img-profile" className='followCard-Profile' />
                                <div className="followCard-info">
                                    <span className='followCard-name'>{profile.first_name} {profile.last_name}</span>
                                    <span className="followCard-info-userName">@{user.user_name}</span>
                                </div>

                                <div className='followCard-container-buttons'>
                                    <button
                                        className={getButtonClass(user.id)}
                                        onClick={() => handleClick(user.id)} // Pasar el id del usuario
                                    >
                                        {getButtonText(user.id)}
                                    </button>

                                    <button className="btn-followCard">
                                        Mensaje
                                    </button>
                                </div>
                            </header>
                        </section>
                    );
                })}
            </div>
        </>
    );
}

export default RegisteredUsers;