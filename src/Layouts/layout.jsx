// Layout.js
import React from 'react';
import Navbar from '../Components/Navbar';
import { Outlet } from 'react-router-dom'; // Esto renderiza la ruta hija

const Layout = () => {
  return (
    <div>
      <Navbar />
      <main>
        <Outlet /> {/* Aquí se renderizan las rutas hijas */}
      </main>
    </div>
  );
};

export default Layout;
