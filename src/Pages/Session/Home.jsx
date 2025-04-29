import { useEffect, useState } from "react";
import { CardPublication } from "../../Components/Card";
import { getPulications } from "../../Services/publicationServices";
import { getPulicationsByidUser } from "../../Services/aplicationsService";
import "../../Styles/Home.css";
import Echo from "../../Services/laravel-echo.client";
import { getChatIds } from "../../Services/chatService";

const Home = () => {
    const [publications, setPublications] = useState([]);
    const [userApplications, setUserApplications] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const userId = localStorage.getItem("user_id");
                if (!userId) throw new Error("Faltan datos de usuario");
    
                const [publicationsData, applicationsData] = await Promise.all([
                    getPulications(),
                    getPulicationsByidUser(userId)
                ]);
    
                setPublications(publicationsData);
                setUserApplications(applicationsData);
            } catch (error) {
                console.error("Error al cargar datos:", error.message);
            }
        };
    
        fetchData();
    }, []);



    return (
            
    <div className="grid-header">
            <h1>Publicaciones</h1>
            <h2>¡Encuentra tu próximo proyecto!</h2>    
    
        <div className="grid-container">
            {publications.map((publication) => {
                const isApplied = userApplications.some(
                    (application) => application.id_publication === publication.id
                );
    
                return (
                    <CardPublication
                        key={publication.id}
                        image=""
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
    </div>
    );
    
};

export default Home;