import React, { useState, useEffect } from 'react';
import '../Styles/Componentes/Loaders.css';  // Importa los estilos para el loader

const LoaderPages = ({ delay = 3000 }) => {  // Recibe el tiempo de espera para el loader
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);  // Cambiamos a false cuando se ha "cargado" la app
        }, delay);

        // Limpiar el timeout cuando el componente se desmonte
        return () => clearTimeout(timer);
    }, [delay]);

    return (
        <>
            {loading && (
                <div className="loader-container">
                    <span className="loader"></span>
                </div>
            )}
        </>
    );
}

export default LoaderPages;
