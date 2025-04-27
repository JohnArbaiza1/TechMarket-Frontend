//Importando funcionalidades y más
import React, { useState, useEffect } from 'react';
import { viewPlanes } from "../Services/planesService";
//Componentes empleados
import { CardPrice } from "../Components/Card";
import Footer from "../Components/Footer";
import LoaderPages from '../Components/Loader';
//Estilo
import '../Styles/planes.css';

export function Planes(){
    //Definimos los estados a emplear
    const [memberships, setMemberships] = useState([]); //Para almacenar los planes
    const [loading, setLoading] = useState(true); // Para la carga

    //Obtenemos los planes desde la API al cargar el componente
    useEffect(() => {
        const fetchMemberships = async () => {
            try {
                const response = await viewPlanes(); // Llamamos a la función viewPlanes
                console.log("Datos de la API:", response.data); // Verifica la estructura de los datos
                setMemberships(response.data); // Establecemos los datos en el estado
            } catch (error) {
                console.error("Error al obtener las membresías:", error);
            } finally {
                setLoading(false); // Dejar de mostrar el estado de carga
            }
        };

        fetchMemberships();
    }, []);

    if (loading) {
        return <LoaderPages delay={3000} />// Mostramos el loader mientras obtenemos los datos
    }

    const userPlans = memberships.filter(membership => 
        membership.membership_name === "Debug" || membership.membership_name === "DeployPro"
    );
    const enterprisePlans = memberships.filter(membership => membership.membership_name.includes("Enterprise"));
    const planesTodos = memberships.filter(membership => membership.membership_name.includes("TechStack Max"));

    return(
        <>
            <div className="planes-contenido">
                <div  className="pricing-header p-3 pb-md-4 mx-auto text-center">
                <h1 className="mt-4 title-planes">¡Da el siguiente paso en tu carrera o proyecto!</h1>
                    <p className="fs-5 info-planes">
                        Elige el plan que mejor se adapte a tus necesidades y empieza a aprovechar todas las oportunidades
                        que nuestra plataforma tiene para ofrecer. Ya seas un desarrollador en busca de más proyectos o una
                        empresa con ideas innovadoras, aquí encontrarás el plan perfecto para ti.
                    </p>
                    <br />

                    <h3 className="subtitle-planes">Para Desarroladores y otros Profesionales</h3>
                    <div className="planes">
                    {userPlans.length > 0 && userPlans.map(membership => (
                            <CardPrice
                                key={membership.id}
                                title={membership.membership_name}
                                subtitle={membership.price}
                                texto="Seleccionar Plan"
                                description={membership.membership_description.split('.')}
                            />
                        ))}
                    </div>
                    <br />

                    <h3 className="subtitle-planes">Planes Especiales para Empresas</h3>
                    <div className="planes">
                        {enterprisePlans.length > 0 && enterprisePlans.map(membership => (
                            <CardPrice
                                key={membership.id}
                                title={membership.membership_name}
                                subtitle={membership.price}
                                texto="Seleccionar Plan"
                                description={membership.membership_description.split('.')}
                            />
                        ))}
                    </div>
                    <br />

                    <h3 className="subtitle-planes">Planes Innovadores para Todos</h3>
                    <div className="planes">
                        {planesTodos.length > 0 && planesTodos.map(membership => (
                            <CardPrice
                                key={membership.id}
                                title={membership.membership_name}
                                subtitle={membership.price}
                                texto="Seleccionar Plan"
                                description={membership.membership_description.split('.')}
                            />
                        ))}
                    </div>

                </div>
            </div>
            <Footer />
        </>
    );
}