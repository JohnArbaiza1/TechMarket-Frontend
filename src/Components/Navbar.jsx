import { Link, useLocation, useNavigate  } from 'react-router-dom';
import '../Styles/Componentes/navbar.css';
import { useState, useEffect, useRef } from "react";
import { useProfile } from '../Contexts/ProfileContext';
import { useAuth } from '../Auth/AuthContext';
import {viewPlanes} from '../Services/planesService';
import { MyMembership  } from './Modal';
import { useChatContext } from "../GlobalMessageListener";

const Navbar = () => {
    const location = useLocation(); // Obtener la ubicación actual

    // Array de objetos -> links que contienen la información de cada enlace a mostrar en el navbar
    const links = [
        { text: "Principal", href: "/principal" },
        { text: "About", href: "/about" },
        { text: "Planes", href: "/planes" },
    ];

    return (
        <>
        <div className="nav-contenido">
            <nav className="navbar navbar-expand-lg">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/principal">
                        TechMarket
                    </Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav">
                            {/* Links generales como Principal, About y Planes */}
                            {links.map(link => (
                                <li key={link.href} className="nav-item">
                                    <Link to={link.href} className="nav-link active">{link.text}</Link>
                                </li>
                            ))}

                            {/* condicion para la visualización de los enlaces dependiendo de la vista actual */}
                            {location.pathname !== '/login' && (
                                <li className="nav-item">
                                    <Link to="/login" className="nav-link active sign-in">Iniciar Sesión</Link>
                                </li>
                            )}
                            {location.pathname !== '/register' && (
                                <li className="nav-item">
                                    <Link to="/register" className="nav-link active sign-up">Registrarse</Link>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </nav>

        </div>
        </>
    );
};



const NavHome = ({ onToggleSidebar }) => {
    // Usar el contexto de perfil en lugar del estado local
    const { 
        profile, 
        loading: profileLoading, 
        error: profileError,
        getProfileImage,
        handleImageError,
        handleImageLoad,
        imageLoaded,
        imageError
    } = useProfile();
    
    const [notifications, setNotifications] = useState([]); // Notificaciones de mensajes no leídos
    const [unreadCount, setUnreadCount] = useState(0); // Contador de mensajes no leídos

    const { lastMessage } = useChatContext(); // Obtener el último mensaje desde el contexto
    const { logout } = useAuth();
    const location = useLocation(); // Obtener la ruta actual

    const processedMessages = useRef(new Set()); // Almacenar IDs de mensajes procesados

    const [modalPlanVisible, setModalPlanVisible] = useState(false);
    const [currentPlan, setCurrentPlan] = useState(null);
    const navigate = useNavigate();

    // Cargar notificaciones cuando el perfil está disponible
    useEffect(() => {
        if (profile && profile.notifications) {
            setNotifications(profile.notifications);
        }
    }, [profile]);

    const handleLogout = (e) => {
        e.preventDefault();
        logout();
        navigate("/login");
    };

    const handleShowPlan = async () => {
        try {
            const planes = await viewPlanes();
            const userPlanId = parseInt(localStorage.getItem("id_membership"));

            const plan = planes.data.find((p) => parseInt(p.id) === userPlanId);

            if (plan) {
                setCurrentPlan(plan);
                setModalPlanVisible(true);
            } else {
                console.warn("Plan del usuario no encontrado");
            }
        } catch (error) {
            console.error("Error al obtener el plan:", error);
        }
    };

    const handleUpdatePlan = () => {
        setModalPlanVisible(false);
        navigate("#");
    };
    // Actualizar el contador de mensajes no leídos cuando llega un nuevo mensaje
    useEffect(() => {
        if (lastMessage) {
            //console.log("NavHome: Nuevo mensaje recibido:", lastMessage);

            // Verificar si el usuario NO está en la ruta /techMarket-Chat
            if (location.pathname !== "/techMarket-Chat") {
                const currentUserId = parseInt(localStorage.getItem("user_id"));

                // Verificar si el mensaje ya fue procesado
                if (lastMessage.id_user !== currentUserId && !processedMessages.current.has(lastMessage.id)) {
                    processedMessages.current.add(lastMessage.id); // Marcar el mensaje como procesado
                    setUnreadCount((prevCount) => prevCount + 1); // Incrementar el contador
                }
            }
        }
    }, [lastMessage, location.pathname]);

    // Reiniciar el contador cuando el usuario esté en /techMarket-Chat
    useEffect(() => {
        if (location.pathname === "/techMarket-Chat") {
            //console.log("NavHome: Usuario está en /techMarket-Chat. Reiniciando contador de mensajes no leídos.");
            setUnreadCount(0); // Reiniciar el contador
        }
    }, [location.pathname]);

    return (
        <>
            <div className="nav-logueado">
                <h3 className="title-home">TechMarket</h3>
                <button className="menu-btn" onClick={onToggleSidebar}>
                    <i className="fa-solid fa-bars"></i>
                </button>
                <div className="nav-icons">
                    {unreadCount > 0 && (
                        <div className="notification-icon show">
                            <span className="notification-text show">
                                Tienes {unreadCount} mensaje{unreadCount > 1 ? "s" : ""}
                            </span>
                            <a href="#" className="notifications">
                                <i className="fas fa-bell"></i>
                            </a>
                        </div>
                    )}

                    <div className="dropdown text-end profile-menu">
                        <a
                            href="#"
                            className="d-block link-body-emphasis text-decoration-none dropdown-toggle"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            {profile && (
                                <img
                                    src={getProfileImage()}
                                    alt={profile.first_name || "Usuario"}
                                    width="32"
                                    height="32"
                                    className={`rounded-circle ${!imageLoaded && !imageError ? 'loading' : ''}`}
                                    onError={handleImageError}
                                    onLoad={handleImageLoad}
                                    loading="lazy"
                                />
                            )}
                            {(profileLoading || !profile) && (
                                <div className="profile-loading-placeholder rounded-circle"></div>
                            )}
                        </a>

                        <ul className="dropdown-menu text-small">
                            <li>
                                <Link className="dropdown-item" to="/settings">
                                    <i className="fa-solid fa-gear"></i> Configuración
                                </Link>
                            </li>
                            <li>
                                <button className="dropdown-item" onClick={handleShowPlan}>
                                    <i className="fa-solid fa-money-check-dollar"></i> Tu Plan
                                </button>
                            </li>
                            <li>
                                <Link className="dropdown-item" to="/profile">
                                    <i className="fa-solid fa-user"></i> Tu Perfil
                                </Link>
                            </li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            <li>
                                <Link className="dropdown-item" onClick={handleLogout}>
                                    <i className="fa-solid fa-right-to-bracket"></i> Sign out
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <MyMembership
                show={modalPlanVisible}
                onHide={() => setModalPlanVisible(false)}
                currentPlan={currentPlan}
                onUpdatePlan={handleUpdatePlan}
            />
        </>
    );
};
    
export default Navbar;
export {
    NavHome
}
