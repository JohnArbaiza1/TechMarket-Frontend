import { createBrowserRouter } from "react-router-dom";

import Login from "../Auth/Login";
import Register from "../Auth/Register";

//importamos los archivo que se encargan de proteger las rutas
import ProtectedRoutes from "./ProtectedRoutes";
import PublicRoute from "./PublicRoute";

//importamos las pages a emplear
import Home from "../Pages/Home";
import Principal from "../Pages/Principal";
import {Planes} from "../Pages/Planes";
import Layout from "../Components/layout";

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
                element: (
                    <PublicRoute>
                        <Principal/>
                    </PublicRoute>
                )
            },
            {
                path: "/planes",
                element: <Planes/>
            },
            {
                path: "/login",
                element: (
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                ),
            },
            {
                path: "/register",
                element: (
                    <PublicRoute>
                        <Register />
                    </PublicRoute>
                ),
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
    }

    ]);
    
export default router;