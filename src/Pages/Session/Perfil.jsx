import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaPhoneAlt, FaEnvelope, FaLinkedin, FaFacebook, FaTwitter, FaGithub, FaDownload, FaGraduationCap, FaBriefcase, FaTools  } from "react-icons/fa";
import { toast } from "sonner";
import '../../Styles/Logueado/perfil.css' 
import { getProfileByUsername } from "../../Services/profileService";
import { useParams } from "react-router-dom";
import { useProfile } from "../../Contexts/ProfileContext";
import { getApplicantByUser } from "../../Services/aplicationsService";
import { getPublicationsUserMin } from "../../Services/publicationServices";

const PerfilUser = () => {
    const { username } = useParams(); // Obtenemos el username de la URL
    // Usar el contexto para el perfil propio
    const { profile: myProfile, loading: myProfileLoading } = useProfile();
    // Estados adicionales para perfiles de otros usuarios
    const [otherProfile, setOtherProfile] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isCompany, setIsCompany] = useState(false);
    const [applications, setApplications] = useState([]);
    const [publications, setPublications] = useState([]);
    // Datos de localStorage
    const userName = localStorage.getItem("user_name");
    const email = localStorage.getItem("email");
    const idUser = localStorage.getItem("user_id");

    const fetchAplications = async () => {
        const loadingToastId = toast.loading("Cargando aplicaciones...");
        try {
            let response = null; // Cambiado de `const` a `let`
            if (!username) {
                response = await getApplicantByUser(idUser); // Usamos `idUser` aquí
            } else {
                response = await getApplicantByUser(user.id); // Usamos `user.id` aquí
            }
    
            setApplications(response.data);
            toast.dismiss(loadingToastId);
            toast.success("Aplicaciones cargadas correctamente");
        } catch (err) {
            setError("Error al cargar las aplicaciones");
            toast.dismiss(loadingToastId);
            toast.error("No se pudo cargar las aplicaciones. Intenta nuevamente.");
            console.error(err);
        }
    };

    const fetchPublications = async () => {
        const loadingToastId = toast.loading("Cargando publicaciones...");
        try {
            let response = null; // Cambiado de `const` a `let`
            if (!username) {
                response = await getPublicationsUserMin(idUser); // Usamos `idUser` aquí
            } else {
                response = await getPublicationsUserMin(user.id); // Usamos `user.id` aquí
            }
    
            setPublications(response.data);
            toast.dismiss(loadingToastId);
            toast.success("Publicaciones cargadas correctamente");
        } catch (err) {
            setError("Error al cargar las publicaciones");
            toast.dismiss(loadingToastId);
            toast.error("No se pudo cargar las publicaciones. Intenta nuevamente.");
            console.error(err);
        }
    };

    useEffect(() => {
        // Función para cargar el perfil de otro usuario
        const fetchOtherProfile = async () => {
            const loadingToastId = toast.loading("Cargando perfil...");
            try {
                const response = await getProfileByUsername(username);
                setOtherProfile(response.data.profile);
                setUser(response.data); // Actualizamos el estado de `user`
                setIsCompany(response.data.id_membership === 3 || response.data.id_membership === 4);
                toast.dismiss(loadingToastId);
                toast.success("Perfil cargado correctamente");
            } catch (err) {
                setError("Error al cargar el perfil");
                toast.dismiss(loadingToastId);
                toast.error("No se pudo cargar el perfil. Intenta nuevamente.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
    
        // Si no hay username en la URL, usamos el perfil del contexto
        if (!username) {
            const membershipId = parseInt(localStorage.getItem("id_membership"));
            setIsCompany(membershipId === 3);
            setLoading(false);
            fetchAplications();
            fetchPublications();
            return;
        }
    
        // Si hay un username, cargamos el perfil de otro usuario
        if (username) {
            fetchOtherProfile();
        }
    }, [username]);
    
    // Nuevo useEffect para cargar aplicaciones y publicaciones después de que `user` esté disponible
    useEffect(() => {
        if (!user) return; // Esperar hasta que `user` esté definido
    
        
    
        fetchAplications();
        fetchPublications();
    }, [user]); // Este useEffect depende de `user`

    // Determinar qué perfil mostrar
    const profileToShow = username ? otherProfile : myProfile;
    
    if ((username && loading) || (!username && myProfileLoading)) return null;
    if (error) return <div>{error}</div>;
    if (!profileToShow) return <div className="text-center p-5">No se pudo cargar la información del perfil</div>;

    return (
        <>
            <Container>
                <div className="Encabezado">
                    <img 
                        src={profileToShow.image_url} 
                        alt="img profile" 
                        className="img-profile"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://unavatar.io/github/defaultuser";
                        }}
                    />
                    <div className="data">
                        <h3>{profileToShow.first_name} {isCompany ? `(${profileToShow.last_name})` : profileToShow.last_name}</h3>
                        <p>{user ? user.user_name : userName}</p>
                    </div>

                    <div className="myData">
                        <p>
                        <FaPhoneAlt className="me-2" />{profileToShow.phone_number}</p>
                        <p>
                        <FaEnvelope className="me-2" /> {user ? user.email : email}</p>

                        <div className="mt-2 d-flex justify-content-end gap-3">
                            <FaFacebook size={20} />
                            <FaTwitter size={20} />
                            <FaGithub size={20} />
                            <FaLinkedin size={20} />
                        </div>
                    </div>
                </div>

                <div className="cuerpo-profile">
                    <section>
                        <Row>
                            <Col>
                                <h4 className="title-Profile"> {isCompany ? "Sobre Nosotros" : "Sobre mí"}</h4>
                                <p className="description-Profile">{profileToShow.description}</p>
                            </Col>
                            <Col>
                                <h4 className="title-Profile">Dirección</h4>
                                <p className="description-Profile">{profileToShow.address}</p>
                            </Col>
                        </Row>

                        <br />
                        <div className="more-info">
                            {!isCompany && (
                                <div>
                                    <h4 className="title-Profile"><FaGraduationCap/> Educación</h4>
                                    <ul>
                                        {profileToShow.education ? profileToShow.education.split(",").map((education, index) => (
                                                <li key={index}>{education.trim()}</li>
                                        )) : <li> No hay</li>}
                                    </ul>
                                </div>
                            )}
                            <div>
                                <h4 className="title-Profile"><FaBriefcase/> {isCompany ? "Servicios ofrecidos" : "Experiencia"}</h4>
                                <ul>
                                    {profileToShow.work_experience ? profileToShow.work_experience.split(",").map((work_experience, index) => (
                                            <li key={index}>{work_experience.trim()}</li>
                                    )) : <li> No hay</li>}
                                </ul>
                            </div>

                            <div>
                                <h4 className="title-Profile"><FaTools /> {isCompany ? "Tecnologías utilizadas" : "Skills"}</h4>
                                <ul>
                                    {profileToShow.skills ? profileToShow.skills.split(",").map((skill, index) => (
                                            <li key={index}>{skill.trim()}</li>
                                    )) : <li> No hay</li>}
                                </ul>
                            </div>
                        </div>
                        <div className="more-info">
                            <div>
                                <h4 className="title-Profile"><FaBriefcase /> Portafolio en nuestra plataforma</h4>
                                <ul> 
                                    {applications.length > 0 ? applications.map((application, index) => (
                                            <li key={index}>{application.publication.title}</li>
                                    )) : <li>No ha participado en ningun proyecto</li>}
                                    
                                </ul>
                            </div>
                            <div>
                                <h4 className="title-Profile"><FaEnvelope/> Proyectos publicados</h4>
                                <ul> 
                                    {publications.length > 0 ? publications.map((publication, index) => (
                                            <li key={index}>{publication.title}</li>
                                    )) :
                                    <li> No ha publicado ningun proyecto</li>}
                                </ul>
                            </div>
                        </div>
                        
                    </section>
                </div>
            </Container>
            <br />
        </>
    );
};

export default PerfilUser;