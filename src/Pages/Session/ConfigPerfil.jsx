import { useNavigate } from "react-router-dom";
import FormularioPerfil from '../../Components/Forms'
import { useAuth } from "../../Auth/AuthContext";
import { Container, Row, Col,Card, Image } from "react-bootstrap";
import images from "../../JS/images";

const ConfigProfile = () => {
    const navigate = useNavigate();
    const { setNeedsProfileSetup } = useAuth();

    //Función que se ejecutará cuando el usuario guarde su perfil
    const handleProfileSave = () => {
        setNeedsProfileSetup(false); //Marcar perfil como configurado
        navigate("/home"); // Redirige al home después de guardar el perfil
    };

    const styles = {
        titleForm: {
            fontFamily: '"Tektur", sans-serif',
            fontWeight: "600",
            color: "#2E186A",
            fontSize: "1.8em",
            marginTop: "10px",
            marginBottom: "40px"
        }
    };

    return (
        <>
        <Container className="d-flex justify-content-center align-items-center min-vh-100 py-5">
            <Card className="p-4 my-5" style={{  maxWidth: "90%", width: "100%",
                boxShadow: "1px 2px 12px rgba(107, 66, 194, 0.384)"
            }}>
                <Row className="g-0 align-items-center">
                    {/* Columna de la imagen */}
                    <Col xs={12} md={6} className="text-center">
                        <h2 style={styles.titleForm}>¡Hola! Bienvenido a TechMarket, un lugar  donde los proyectos y el talento se encuentran. </h2>
                        <Image 
                            src={images["img-7"]} 
                            alt="Imagen de perfil" 
                            style={{ filter: "drop-shadow(2px 10px 10px rgb(46, 24, 106))"}}
                            fluid 
                            className="rounded-start w-100" 
                        />
                    </Col>

                    {/* Columna del formulario */}
                    <Col xs={12} md={6} className="p-4">
                        <FormularioPerfil onProfileSave={handleProfileSave} />
                    </Col>
                </Row>
            </Card>
        </Container>
        </>
    );
};

export default ConfigProfile;