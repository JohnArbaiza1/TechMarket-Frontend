import { createBrowserRouter } from "react-router-dom";

import Login from "../Auth/Login";
import Register from "../Auth/Register";

//importamos los archivo que se encargan de proteger las rutas
import ProtectedRoutes from "./ProtectedRoutes";
import PublicRoute from "./PublicRoute";

//importamos las pages a emplear
import Home from "../Pages/Session/Home";
import Principal from "../Pages/Principal";
import {Planes} from "../Pages/Planes";
import PerfilUser from "../Pages/Session/Perfil";
import Publicaciones from "../Pages/Session/Publicar";
import ConfigProfile from "../Pages/Session/ConfigPerfil";
import SettingsPage from "../Pages/Session/SettingsPage";
import MisProyectos from "../Pages/Session/MyProjects";
import RegisteredUsers from "../Pages/Session/Colegas";

//importamos los layouts
import Layout from "../Layouts/layout";
import SessionLayout from "../Layouts/layout_session";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                element: <Principal />,// Esta es la página que se mostrará por defecto
                index: true,  // Esto marca esta ruta como la predeterminada para "/"

            },
            {
                path: "principal",
                element: (
                    <PublicRoute>
                        <Principal/>
                    </PublicRoute>
                )
            },
            {
                path: "planes",
                element: <Planes/>
            },
            {
                path: "login",
                element: (
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                ),
            },
            {
                path: "register",
                element: (
                    <PublicRoute>
                        <Register />
                    </PublicRoute>
                ),
            },
        ],
    },
    // Rutas protegidas
    {
        element: <ProtectedRoutes />,  // Envuelve las rutas a proteger
        children: [
            {
                element: <SessionLayout />,  // Aplica a todas las rutas protegidas
                children: [
                    { path: "/home", element: <Home /> },
                    { path: "/publicar", element: <Publicaciones /> },
                    { path: "/profile", element: <PerfilUser /> },
                    { path: "/settings", element: <SettingsPage /> },
                    { path: "/myprojects", element: <MisProyectos /> },
                    { path: "/proyectos-empresa", element: <MisProyectos /> },
                    { path: "/colegas", element: <RegisteredUsers /> },
                    { path: "/talento-empresas", element: <RegisteredUsers/> },
                ],
            },
            {
                path: "config-profile",
                element: <ConfigProfile />
            }
        ],
    }

    ]);
    
export default router;