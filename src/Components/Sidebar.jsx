import '../Styles/Componentes/sidebar.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
    const location = useLocation(); // Obtiene la ruta actual
    const { logout } = useAuth(); // Obtiene la función logout
    const navigate = useNavigate(); //para la redirección después del logout

    //definimos un array para los links del sidebar
    const links_sidebar = [
        {icon: "fas fa-home", text:"Inicio", href: "/home"},
        {icon: "fas fa-folder-open", text:"Mis Proyectos", href: "/myprojects" },
        {icon: "fas fa-search", text: "Descubrir", href: "/descubrir"},
        {icon: "fas fa-upload", text: "Publicar", href: "/publicar"},
        {icon: "fas fa-users", text: "Colegas", href: "/colegas"},
        {icon: "fas fa-envelope", text: "Mensajes", href: "/mensajes"}
    ];
    
    // Función para manejar el cierre de sesión
    const handleLogout = () => {
        logout();  // Cierra sesión
        navigate("/login"); // Redirige al login
    };

    return (
        <div className={`sidebar ${isOpen ? "open" : ""}`}>
            <button className="close-btn" onClick={onClose}>
                <i className="fa-solid fa-xmark"></i>
            </button>
            <ul>
                {/* Generamos los li de manera dinamica */}
                {links_sidebar.map(link => (
                    <li key={link.href} className={`item ${location.pathname === link.href ? "active" : ""}`}>
                        <Link to={link.href}><i className={link.icon}> </i> {link.text}</Link>
                    </li>
                ))}

                <li className="item logout">
                    <Link onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt"></i> Cerrar sesión</Link>
                </li>

            </ul>
        </div>
    );
}

export default Sidebar;
