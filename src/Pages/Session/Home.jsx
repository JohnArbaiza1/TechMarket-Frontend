import { useEffect, useState } from "react";
import { CardPublication } from "../../Components/Card";
import { getPulications } from "../../Services/publicationServices";
import "../../Styles/Home.css";

const Home = () => {
    const [publications, setPublications] = useState([]);

    useEffect(() => {
        const fetchPublications = async () => {
            try {
                const data = await getPulications();
                setPublications(data); // Guardar las publicaciones en el estado
            } catch (error) {
                console.error("Error al cargar las publicaciones:", error.message);
            }
        };

        fetchPublications();
    }, []);

    return (
        <div className="grid-container">
            {publications.map((publication) => (
                <CardPublication
                    key={publication.id}
                    image=""
                    tags={publication.tags.split(", ")} // Convertir la cadena de tags en un array
                    title={publication.title}
                    date={new Date(publication.created_at).toLocaleDateString()} // Formatear la fecha
                    link={`#`} 
                    quota={publication.quota}
                    rating={publication.publication_rating}
                    description={publication.publication_description} // Ejemplo de descripción
                />
            ))}
        </div>
    );
};

export default Home;