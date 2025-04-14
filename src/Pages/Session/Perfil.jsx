import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaPhoneAlt, FaEnvelope, FaLinkedin, FaFacebook, FaTwitter, FaGithub, FaDownload, FaGraduationCap, FaBriefcase, FaTools  } from "react-icons/fa";
import { toast } from "sonner";
import '../../Styles/Logueado/perfil.css' 
import { getProfile, getProfileByUsername } from "../../Services/profileService";
import { useParams } from "react-router-dom";

const PerfilUser = () =>{
    const { username } = useParams(); // Obtenemos el username de la URL
    //Definimos los estados a emplear
    const [profile, setProfile] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isCompany, setIsCompany] = useState(false);

    // Obtenemos los datos del usuario desde localStorage    
    const userName = localStorage.getItem("user_name");
    const email = localStorage.getItem("email");

    
    


    useEffect(() => {
        const fetchProfile = async () => {
            // Guardamos el ID del toast para poder cerrarlo más tarde
            const loadingToastId = toast.loading("Cargando perfil...");
            
            try {
                if(!username) {
                    const userId = localStorage.getItem("user_id");
                    const response = await getProfile(userId);
                    const membershipId = parseInt(localStorage.getItem("id_membership"));
                    setIsCompany(membershipId === 3);
                    setProfile(response.data);
                    
                    
                    // Cerramos el toast de carga y mostramos éxito
                    toast.dismiss(loadingToastId);
                    toast.success("Perfil cargado correctamente");
                }
                else {
                    const response = await getProfileByUsername(username);
                    setProfile(response.data.profile);
                    setUser(response.data);

                    setIsCompany(response.data.id_membership === 3); // Verificamos si es una empresa

                    // Cerramos el toast de carga y mostramos éxito
                    toast.dismiss(loadingToastId);
                    toast.success("Perfil cargado correctamente");
                }
            } catch (err) {
                setError("Error al cargar el perfil");
                
                // Cerramos el toast de carga y mostramos error
                toast.dismiss(loadingToastId);
                toast.error("No se pudo cargar el perfil. Intenta nuevamente.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
    
        fetchProfile();
    }, []);
    
    if (loading) return null;
    if (error) return <div>{error}</div>;
    if (!profile) return <div className="text-center p-5">No se pudo cargar la información del perfil</div>;

    return (
        <>
            <Container>
                <div className="Encabezado">
                    <img src={profile.image_url} alt="img profile" className="img-profile"/>
                    <div className="data">
                        <h3>{profile.first_name} {isCompany ? `(${profile.last_name})` : profile.last_name}</h3>
                        <p>{user? user.user_name:userName}</p>
                    </div>

                    <div className="myData">
                        <p>
                        <FaPhoneAlt className="me-2" />{profile.phone_number}</p>
                        <p>
                        <FaEnvelope className="me-2" /> {user? user.email: email}</p>

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
                                <p className="description-Profile">{profile.description}</p>
                            </Col>
                            <Col>
                                <h4 className="title-Profile">Dirección</h4>
                                <p className="description-Profile">{profile.address}</p>
                            </Col>
                        </Row>

                        <br />
                        <div className="more-info">
                            {!isCompany && (
                                <div>
                                    <h4 className="title-Profile"><FaGraduationCap/> Educación</h4>
                                    <ul>
                                        {profile.education? profile.education.split(",").map((education, index) => (
                                                <li key={index}>{education.trim()}</li>
                                        )) : <li> No hay</li>}
                                    </ul>
                                </div>
                            )}
                            <div>
                                <h4 className="title-Profile"><FaBriefcase/> {isCompany ? "Servicios ofrecidos" : "Experiencia"}</h4>
                                <ul>
                                    {profile.work_experience? profile.work_experience.split(",").map((work_experience, index) => (
                                            <li key={index}>{work_experience.trim()}</li>
                                    )): <li> No hay</li>}
                                </ul>
                            </div>

                            <div>
                                <h4 className="title-Profile"><FaTools /> {isCompany ? "Tecnologías utilizadas" : "Skills"}</h4>
                                <ul>
                                    {profile.skills? profile.skills.split(",").map((skill, index) => (
                                            <li key={index}>{skill.trim()}</li>
                                    )) : <li> No hay</li>}
                                </ul>
                            </div>
                        </div>
                    </section>
                </div>
            </Container>
            <br />
            
        </>
    );
}

export default PerfilUser;