import { Link, useLocation } from 'react-router-dom';
import '../Styles/Componentes/navbar.css';

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
    return(
        <>
        <div className="nav-logueado">
            <h3 className="title-home">TechMarket</h3>
            <button className="menu-btn" onClick={onToggleSidebar}>
                <i className="fa-solid fa-bars"></i>
            </button>
            <div className="nav-icons">

                <div className="notification-icon">
                    <a href="#" className="notifications">
                        <i className="fas fa-bell"></i> 
                        <span className="badge">3</span> 
                    </a>
                </div>

                <div className='dropdown text-end profile-menu'>
                    <a href="#" className="d-block link-body-emphasis text-decoration-none dropdown-toggle"
                    data-bs-toggle="dropdown" aria-expanded="false">
                        <img src="https:/unavatar.io/JohnArbaiza1" alt="mdo" width="32" height="32"
                            className="rounded-circle"/>
                    </a>

                    <ul className="dropdown-menu text-small">
                        <li><a className="dropdown-item" href="#">Settings</a></li>
                        <li><a className="dropdown-item" href="#">Profile</a></li>
                        <li>
                            <hr className="dropdown-divider"/>
                        </li>
                        <li><a className="dropdown-item" href="#">Sign out</a></li>
                    </ul>
                </div>
            </div>
        </div>
        </>
    );
}

export default Navbar;
export {
    NavHome
}
