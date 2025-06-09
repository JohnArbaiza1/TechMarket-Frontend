import { useEffect, useState, useRef } from "react";
import { CardPublication } from "../../Components/Card";
import { getPulications, getPublicationsByPage } from "../../Services/publicationServices";
import { getPulicationsByidUser } from "../../Services/aplicationsService";
import "../../Styles/Home.css";
import Echo from "../../Services/laravel-echo.client";
import { getChatIds } from "../../Services/chatService";


const Home = () => {
    const [publications, setPublications] = useState([]); // Publicaciones cargadas
    const [currentPage, setCurrentPage] = useState(1); // Página actual
    const [hasMore, setHasMore] = useState(true); // Si hay más páginas para cargar
    const [isLoading, setIsLoading] = useState(false); // Estado de carga
    const [userApplications, setUserApplications] = useState([]); // Aplicaciones del usuario
    const gridHeaderRef = useRef(null); // Referencia al contenedor con scroll

    // Función para cargar publicaciones por página
    const fetchPublications = async (page) => {
        if (!hasMore || isLoading) return; // Si no hay más páginas o ya está cargando, no hacer nada

        try {
            setIsLoading(true);
            const [publicationsData, applicationsData] = await Promise.all([
                getPublicationsByPage(page),
                getPulicationsByidUser(localStorage.getItem("user_id")),
            ]);
            setUserApplications(applicationsData);

            // Agregar nuevas publicaciones al estado existente sin duplicados
            setPublications((prevPublications) => {
                const newPublications = publicationsData.data.filter(
                    (newPub) => !prevPublications.some((pub) => pub.id === newPub.id)
                );
                return [...prevPublications, ...newPublications];
            });

            // Actualizar el estado de paginación
            setHasMore(publicationsData.last_page != currentPage); // Verificar si hay más páginas
            if (publicationsData.next_page_url && publicationsData.last_page != currentPage) {
                setCurrentPage((prevPage) => prevPage + 1); // Incrementar la página actual
            }
        } catch (error) {
            console.error("Error al cargar publicaciones:", error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Cargar la primera página al montar el componente
    useEffect(() => {
        fetchPublications(1);
    }, []);

    // Detectar el final del scroll
    const handleScroll = () => {
        const container = document.getElementById("homeidcontent");
        if (!container) return;

        const scrollTop = container.scrollTop;
        const scrollHeight = container.scrollHeight;
        const clientHeight = container.clientHeight;

        if (scrollTop + clientHeight >= scrollHeight - 100) {

            if (hasMore && !isLoading) {
                fetchPublications(currentPage);
            }
        }
    };

    // Agregar el evento de scroll al contenedor
    useEffect(() => {
        const container = document.getElementById("homeidcontent");
        if (!container) return;

        container.addEventListener("scroll", handleScroll);
        return () => container.removeEventListener("scroll", handleScroll);
    }, [currentPage, hasMore, isLoading]);

    return (
        <div className="grid-header">
            <h1 className="title text-center">Publicaciones</h1>
            <h2 className="text-center" style={{ color: "#2E186A" }}>
                ¡Encuentra tu próximo proyecto!
            </h2>

            <div className="grid-container">
                {publications.map((publication) => {
                    const isApplied = userApplications.some(
                        (application) => application.id_publication === publication.id
                    );
                    return (
                        <CardPublication
                            key={publication.id}
                            image={publication.image || ""}
                            tags={publication.tags.split(", ")}
                            title={publication.title}
                            date={new Date(publication.created_at).toLocaleDateString()}
                            quota={publication.quota}
                            rating={publication.publication_rating}
                            description={publication.publication_description}
                            publication={publication}
                            isApplied={isApplied}
                            isOwner={publication.id_user == localStorage.getItem("user_id")}
                        />
                    );
                })}
            </div>

            {isLoading && (
                <div className="loading-indicator text-center">
                    Cargando más publicaciones...
                </div>
            )}
        </div>
    );
};

export default Home;