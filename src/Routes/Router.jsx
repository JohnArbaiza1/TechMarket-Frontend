import { createBrowserRouter } from "react-router-dom";
import Principal from "../Pages/Principal";
import {Planes} from "../Pages/Planes";
import Layout from "../Components/layout";
import Login from "../Auth/Login";
import Register from "../Auth/Register";

//importamos el archivo que nos permite proteger las rutas
import ProtectedRoutes from "./ProtectedRoutes";
import Home from "../Pages/Home";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />, 
        children: [
            {
                path: "/",
                element: <Principal />,// Esta es la página que se mostrará por defecto
                index: true,  // Esto marca esta ruta como la predeterminada para "/"

            },
            {
                path: "/principal",
                element: <Principal />,
            },
            {
                path: "/planes",
                element: <Planes/>
            },
            {
                path: "/login",
                element: <Login/>
            },
            {
                path: "/register",
                element: <Register/>
            },

        ]
    },

    // Rutas protegidas
    {
        element: <ProtectedRoutes />, // Envuelve las rutas a proteger
        children: [
        {
            path: "/home", // Solo se podrá acceder si está autenticado
            element: <Home />,
        },
        ],
    },

    // Ruta a la que devuelve si no ha accedido
    {
        path: "/login",
        element: <Login />,
    },

    ]);
    
export default router;