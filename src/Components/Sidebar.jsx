//Importamos los componentes de React y los propios ademas de los estilos
import '../Styles/Componentes/sidebar.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';
import { useState, useEffect } from 'react';

const Sidebar = ({ isOpen, onClose, onToggleCollapse }) => {
    const location = useLocation(); // Hook para obtener la ubicación actual del navegador (ruta actual)
    const { logout } = useAuth(); // Extraemos la función logout del contexto de autenticación
    const navigate = useNavigate(); // Hook para navegar a otras rutas
    const isMessagesRoute = location.pathname === '/techMarket-Chat'; //Para hacer que el sidebar este collapsado en esta ruta

    // Estado para manejar si la barra lateral está colapsada o expandida
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [membershipId, setMembershipId] = useState(null);

    useEffect(() => {
        const id = parseInt(localStorage.getItem("id_membership"));
        setMembershipId(id);
    }, []);

    //Definimos enlaces comunes
    const commonLinks = [
        { icon: "fas fa-home", text: "Inicio", href: "/home" },
        { icon: "fas fa-envelope", text: "Mensajes", href: "/techMarket-Chat" },
        { icon: "fas fa-upload", text: "Publicar", href: "/publicar" },
    ];

    //Definimos los enlaces que veran los profesionales 
    const professionalLinks = [
        { icon: "fas fa-folder-open", text: "Mis Proyectos", href: "/myprojects" },
        { icon: "fas fa-search", text: "Descubrir", href: "/descubrir" },
        { icon: "fas fa-users", text: "Colegas", href: "/colegas" },
    ];

    //Definimos los enlaces que veran las empresas
    const companyLinks = [
        { icon: "fa-solid fa-share-from-square", text: "Proyectos Publicados", href: "/proyectos-empresa" },
        { icon: "fas fa-search", text: "Buscar Talento", href: "/buscar-talento" },
        { icon: "fas fa-users", text: "talento y más", href: "/talento-empresas" },
    ];


    // Definimos los enlaces de la barra lateral, con un icono, texto y la ruta a la que apuntan
    // const links_sidebar = [
    //     { icon: "fas fa-home", text: "Inicio", href: "/home" },
    //     { icon: "fas fa-folder-open", text: "Mis Proyectos", href: "/myprojects" },
    //     { icon: "fas fa-search", text: "Descubrir", href: "/descubrir" },
    //     { icon: "fas fa-upload", text: "Publicar", href: "/publicar" },
    //     { icon: "fas fa-users", text: "Colegas", href: "/colegas" },
    //     { icon: "fas fa-envelope", text: "Mensajes", href: "/mensajes" }
    // ];

    // Combinamos links según membresía
    let links_sidebar = [...commonLinks];
    if (membershipId === 1 || membershipId === 2) {
        links_sidebar = [...commonLinks, ...professionalLinks];
    } else if (membershipId === 3 || membershipId === 4) {
        links_sidebar = [...commonLinks, ...companyLinks];
    }

    // Función que maneja el logout, cierra sesión y navega a la página de login
    const handleLogout = (e) => {
        e.preventDefault();
        logout();
        navigate("/login");
    };

    // Función para alternar el estado de colapso de la barra lateral
    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed); // Cambiamos el estado de colapso
        onToggleCollapse();  
    };

    return (
        <div className={`sidebar ${isOpen ? "open" : ""} ${(isCollapsed || isMessagesRoute) ? "collapsed" : ""}`}>
            <button className="close-btn" onClick={onClose}>
                <i className="fa-solid fa-xmark"></i>
            </button>
            <button className="collapse-btn" onClick={toggleSidebar}>
                {isCollapsed ? <i className="fa-solid fa-arrow-right"></i> : <i className="fa-solid fa-arrow-left"></i>}
            </button>
            <ul>
                {links_sidebar.map(link => (
                    <li key={link.href} className={`item ${location.pathname === link.href ? "active" : ""}`}>
                        <Link to={link.href}>
                            <i className={link.icon}></i> 
                            {!(isCollapsed || isMessagesRoute) && <span>{link.text}</span>}
                        </Link>
                    </li>
                ))}

                <li className="item logout">
                    <Link onClick={handleLogout}>
                        <i className="fas fa-sign-out-alt"></i>
                        {!(isCollapsed || isMessagesRoute) && <span>Cerrar sesión</span>}
                    </Link>
                </li>
            </ul>
        </div>
    );
};
export default Sidebar;
