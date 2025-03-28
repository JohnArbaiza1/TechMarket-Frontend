import { Navigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext";

const PublicRoute = ({ children }) => {
    const { isAuth } = useAuth();

    // Si el usuario ya está autenticado, lo redirigimos a /home
    return isAuth ? <Navigate to="/home" /> : children;
};

export default PublicRoute;
