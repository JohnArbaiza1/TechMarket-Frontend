import { Link, useLocation } from 'react-router-dom';
import '../Styles/navbar.css';

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
        </>
    );
};

export default Navbar;
