import { Outlet } from "react-router-dom";

//importamos los componentes necesarios
import { NavHome } from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";

const SessionLayout = () =>{
    return(
        <div className="home-layout">
            <NavHome/>
            <div className="home-content">
                <Sidebar/>
                <main className="home-main">
                    <Outlet/>
                </main>
            </div>
        </div>
    );
}

export default SessionLayout;