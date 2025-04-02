import { Outlet } from "react-router-dom";
import { useState } from "react";
//importamos los componentes necesarios
import { NavHome } from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";

const SessionLayout = () =>{

    //Definimos un estado para el sidebar
    const[isSidebarOpen, setIsSidebarOpen] = useState(false);
    return(
        <div className="home-layout">
            {/* Pasamos el estado al navbar para que pueda abrir/cerrar el sidebar */}
            <NavHome onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
            <div className="home-content">
                {/* Pasamos isOpen para manejar la visibilidad */}
                <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
                <main className="home-main">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default SessionLayout;