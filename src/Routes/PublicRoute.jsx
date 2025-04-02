import { Navigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext";

const PublicRoute = ({ children }) => {
    const { isAuth, needsProfileSetup } = useAuth();

    // Si el usuario ya está autenticado, lo redirigimos a /home
    return  isAuth   ? (needsProfileSetup ? <Navigate to="/config-profile" /> : <Navigate to="/home" />) 
    : children;
};

export default PublicRoute;
