import { Link, useLocation, useNavigate  } from 'react-router-dom';
import '../Styles/Componentes/navbar.css';
import { useState, useEffect } from "react";
import { getProfile } from '../Services/profileService';
import { useAuth } from '../Auth/AuthContext';
import {viewPlanes} from '../Services/planesService';
import { MyMembership  } from './Modal';

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

const NavHome = ({ onToggleSidebar }) =>{
    const [profile, setProfile] = useState(null);
    const [error,setError] = useState(null);
    const [notifications, setNotifications] = useState([]);

    //Eventos para el plan
    const [modalPlanVisible, setModalPlanVisible] = useState(false);
    const [currentPlan, setCurrentPlan] = useState(null);

    const { logout } = useAuth(); 
    const navigate = useNavigate(); 

    const handleLogout = (e) => {
        e.preventDefault();
        logout();
        navigate("/login");
    };

    const handleShowPlan = async () => {
        try {
            const planes = await viewPlanes();
            const userPlanId = parseInt(localStorage.getItem("id_membership"));

            //para obtener el plan
            const plan = planes.data.find(p => parseInt(p.id) === userPlanId);

            if (plan) {
                setCurrentPlan(plan);
                setModalPlanVisible(true); // Mostrar el modal solo si encuentra el plan
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
    

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userId = localStorage.getItem("user_id");
                const response = await getProfile(userId);
                setProfile(response.data);

                setNotifications(response.data.notifications || []);
                
            } catch (error) {
                setError("Error al cargar el perfil");
                console.error(error);
            }
        };
    
        fetchProfile();
    }, []);

    return(
        <>
        <div className="nav-logueado">
            <h3 className="title-home">TechMarket</h3>
            <button className="menu-btn" onClick={onToggleSidebar}>
                <i className="fa-solid fa-bars"></i>
            </button>
            <div className="nav-icons">

            {notifications.length > 0 && (
                <div className="notification-icon show">
                    <span className="notification-text show">
                        Tienes mensajes
                    </span>
                    <a href="#" className="notifications">
                        <i className="fas fa-bell"></i>
                    </a>
                </div>
            )}


                <div className='dropdown text-end profile-menu'>
                    <a href="#" className="d-block link-body-emphasis text-decoration-none dropdown-toggle"
                    data-bs-toggle="dropdown" aria-expanded="false">
                        <img src={profile?.image_url || "https://unavatar.io/github/defaultuser"}  alt="mdo" width="32" height="32"
                            className="rounded-circle"/>
                    </a>

                    <ul className="dropdown-menu text-small">
                        <li>
                            <Link className="dropdown-item" to="/settings"> <i className="fa-solid fa-gear"></i> Configuración </Link>
                        </li>
                        <li>

                        <li>
                            <button className="dropdown-item" onClick={handleShowPlan}>
                                <i className="fa-solid fa-money-check-dollar"></i> Tu Plan
                            </button>
                        </li>

                        </li>
                        <li>
                            <Link className="dropdown-item" to="/profile"> <i className="fa-solid fa-user"></i> Tu Perfil </Link>
                        </li>
                        <li>
                            <hr className="dropdown-divider" />
                        </li>
                        <li>
                            <Link className="dropdown-item" onClick={handleLogout}> <i className="fa-solid fa-right-to-bracket"></i> Sign out </Link>
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
}

export default Navbar;
export {
    NavHome
}
