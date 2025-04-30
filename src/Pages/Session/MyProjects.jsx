import { useEffect, useState } from "react";
import { CardPublication } from "../../Components/Card";
import { getPublicationsUser } from "../../Services/publicationServices";
import { toast } from 'sonner';

const MisProyectos = () => {
    const [myPublications, setMyPublications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyPublications = async () => {
            const loadingToastId = toast.loading('Cargando tus publicaciones...',{position:'top-center'});
            
            try {
                const userId = localStorage.getItem("user_id");
                if (!userId) throw new Error("Faltan datos de usuario");

                const data = await getPublicationsUser(userId);
                // console.log("Publicaciones del usuario:", data);
                setMyPublications(data);
                
                toast.dismiss(loadingToastId);
                
                // Mostramos toast de éxito solo si hay publicaciones
                if (data && data.length > 0) {
                    toast.success('Tus publicaciones han sido cargadas con éxito');
                } else {
                    toast.info('No has creado ninguna publicación aún');
                }
            } catch (error) {
                console.error("Error al cargar tus publicaciones:", error.message);
                // Cerramos el toast de carga en caso de error
                toast.dismiss(loadingToastId);
                toast.error(`Error al cargar publicaciones: ${error.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchMyPublications();
    }, []);

    return (
        <div className="grid-container">
            {loading ? (
                <h2 className="title text-center"> 📦Desempacando magia digital...</h2>
            ) : myPublications.length === 0 ? (
                <p>No has creado ninguna publicación aún.</p>
            ) : (
                
                myPublications.map((publication) => (
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
                        isApplied={false}
                        isOwner={true}
                    />
                ))
            )}
        </div>
    );
};

export default MisProyectos;