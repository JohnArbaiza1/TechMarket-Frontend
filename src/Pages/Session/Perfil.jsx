import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaPhoneAlt, FaEnvelope, FaLinkedin, FaFacebook, FaTwitter, FaGithub, FaDownload, FaGraduationCap, FaBriefcase, FaTools  } from "react-icons/fa";
import { toast } from "sonner";
import '../../Styles/Logueado/perfil.css' 
import { getProfile } from "../../Services/profileService";

const PerfilUser = () =>{
    //Definimos los estados a emplear
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const imageUrl = localStorage.getItem("image_url") || "https://unavatar.io/github/defaultuser";

    // Obtenemos los datos del usuario desde localStorage
    const userName = localStorage.getItem("user_name");
    const email = localStorage.getItem("email");

    useEffect(() => {
        const fetchProfile = async () => {
            // Guardamos el ID del toast para poder cerrarlo más tarde
            const loadingToastId = toast.loading("Cargando perfil...");
            
            try {
                const userId = localStorage.getItem("user_id");
                const response = await getProfile(userId);
                setProfile(response.data);
                
                // Cerramos el toast de carga y mostramos éxito
                toast.dismiss(loadingToastId);
                toast.success("Perfil cargado correctamente");
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
    
    if (loading) return <div className="text-center p-5">Cargando perfil...</div>;
    if (error) return <div>{error}</div>;
    if (!profile) return <div className="text-center p-5">No se pudo cargar la información del perfil</div>;

    return (
        <>
            <Container>
                <div className="Encabezado">
                    <img src={imageUrl} alt="img profile" className="img-profile"/>
                    <div className="data">
                        <h3>{profile.first_name} {profile.last_name}</h3>
                        <p>{userName}</p>
                    </div>

                    <div className="myData">
                        <p>
                        <FaPhoneAlt className="me-2" />{profile.phone_number}</p>
                        <p>
                        <FaEnvelope className="me-2" /> {email}</p>

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
                                <h4 className="title-Profile">Sobre mí</h4>
                                <p className="description-Profile">{profile.description}</p>
                            </Col>
                            <Col>
                                <h4 className="title-Profile">Dirección</h4>
                                <p className="description-Profile">{profile.address}</p>
                            </Col>
                        </Row>

                        <br />
                        <div className="more-info">
                            <div>
                                <h4 className="title-Profile"><FaGraduationCap/> Educación</h4>
                                <ul>
                                    {profile.education.split(",").map((education, index) => (
                                            <li key={index}>{education.trim()}</li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h4 className="title-Profile"><FaBriefcase/> Experiencia</h4>
                                <ul>
                                    {profile.work_experience.split(",").map((work_experience, index) => (
                                            <li key={index}>{work_experience.trim()}</li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <h4 className="title-Profile"><FaTools /> Skills</h4>
                                <ul>
                                    {profile.skills.split(",").map((skill, index) => (
                                            <li key={index}>{skill.trim()}</li>
                                    ))}
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