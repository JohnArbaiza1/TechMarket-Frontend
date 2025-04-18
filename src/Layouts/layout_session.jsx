//Importamos los componentes de React y los propios
import { Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import { NavHome } from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";

const SessionLayout = () => {
    //Definimos los estados a emplear
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Controla si la barra lateral está abierta o no.
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // Controla si la barra lateral está colapsada o expandida.
    const isMessagesRoute = location.pathname === "/techMarket-Chat";

    return (
        <div className="home-layout">
            <NavHome onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
            <div className="home-content">
                <Sidebar 
                    isOpen={isSidebarOpen} 
                    onClose={() => setIsSidebarOpen(false)} 
                    onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
                />
                <main className={`home-main ${(isSidebarCollapsed || isMessagesRoute) ? 'shifted' : ''}`}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default SessionLayout;
