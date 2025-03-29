import '../Styles/Componentes/sidebar.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';

const Sidebar = () => {
    const location = useLocation(); // Obtiene la ruta actual
    const { logout } = useAuth(); // Obtiene la función logout
    const navigate = useNavigate(); //para la redirección después del logout

    //definimos un array para los links del sidebar
    const links_sidebar = [
        {text:"Inicio", href: "/home"},
        { text: "Publicar", href: "/publicar" },
    ];
    
    // Función para manejar el cierre de sesión
    const handleLogout = () => {
        logout();  // Cierra sesión
        navigate("/login"); // Redirige al login
    };

    return (
        <div className='sidebar'>
            <ul>
                {/* Generamos los li de manera dinamica */}
                {links_sidebar.map(link => (
                    <li key={link.href} className={`item ${location.pathname === link.href ? "active" : ""}`}>
                        <Link to={link.href}>{link.text}</Link>
                    </li>
                ))}

                <li className="item logout">
                    <Link onClick={handleLogout}>Cerrar sesión</Link>
                </li>

            </ul>
        </div>
    );
}

export default Sidebar;
