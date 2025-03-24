// este archivo se encarga de validar que el usuario no ingrese sin validación
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext"; // Importa el contexto de autenticación

const ProtectedRoutes = () => {
    const { isAuth } = useAuth(); // Obtenemos el estado de autenticación

    // Si el usuario no está autenticado, redirige al login
    return isAuth ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
