import { useState } from "react";
import {Card ,Form, Row, Col }from 'react-bootstrap';
import { createProfile } from "../Services/profileService";
import {toast } from "sonner";
import { useProfile } from "../Contexts/ProfileContext";

const FormularioPerfil = ({ userId, onProfileSave }) => {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        phone_number: "",
        address: "",
        description: "",
        education: "",
        work_experience: "",
        skills: "",
        social_media_links: "",
        id_user: userId,
        github: ""
    });

    //Evento para los errores
    const [errors, setErrors] = useState({
        first_name: "",
        last_name: "",
        phone_number: "",
        address: "",
        description: "",
        education: "",
        experience: "",
        skills: "",
        social_media_links: ""
    });

    const membershipId = parseInt(localStorage.getItem("id_membership"));
    const isCompany = membershipId === 3;

    const { refreshProfile } = useProfile(); 

    const styles = {
        titleForm: {
            fontFamily: '"Tektur", sans-serif',
            fontWeight: "600",
            color: "#2E186A",
            fontSize: "1.8em",
            marginTop: "10px",
            marginBottom: "40px"
        },
        labelForm: {
            color: "#63318A"
        },
        errorMessage: {
            color: "red",
            fontSize: "0.9em"
        }
    };

    // Maneja cambios en los inputs
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        // Se encarga de limpiar los mensajes de error
        setErrors({
            ...errors,
            [e.target.name]: ""
        });
    };

    //Validaciones
    const validacionesForm = () => {
        const validaciones = [
            { campo: 'first_name', mensaje: 'El nombre es obligatorio.', validador: valor => !!valor.trim() },
            { campo: 'last_name', mensaje: 'El apellido es obligatorio.', validador: valor => !!valor.trim() },
            { campo: 'description', mensaje: 'La biografía es obligatoria.', validador: valor => valor.trim() !== '' },
            { campo: 'phone_number', mensaje: 'El teléfono es obligatorio.', validador: valor => !!valor.trim() },
            { campo: 'phone_number', mensaje: 'El teléfono solo puede contener números.', validador: valor => !valor.trim() || /^\d+$/.test(valor) },
            { campo: 'address', mensaje: 'La dirección es obligatoria.', validador: valor => !!valor.trim() }
        ];

        const newErrors = {};
        let formIsValid = true;

        validaciones.forEach(({ campo, mensaje, validador }) => {
            if (!validador(formData[campo])) {
                formIsValid = false;
                newErrors[campo] = newErrors[campo] || mensaje;
            }
        });

        setErrors(newErrors);
        return formIsValid;
    };

    // Función para manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validacionesForm()) {
            toast.error("Por favor, complete los campos obligatorios.", { position: 'top-center' });
            return;
        }

        let imageUrl = "";
        if (formData.github.trim() !== "") {
            imageUrl = `https://unavatar.io/github/${formData.github.trim()}`;
        } else {
            // Si no hay GitHub, asignar imagen por defecto según tipo de cuenta
            imageUrl = isCompany
                ? "https://img.freepik.com/free-vector/project-life-cycle-abstract-concept-vector-illustration-successful-project-management-stages-project-completion-task-assignment-business-case-resource-requirements-abstract-metaphor_335657-2941.jpg"
                : "https://img.freepik.com/vector-gratis/generacion-ideas-negocio-desarrollo-plan-hombre-pensativo-personaje-dibujos-animados-bombilla-mentalidad-tecnica-mente-emprendedora-proceso-lluvia-ideas_335657-2104.jpg";
        }

        const dataToSend = {
            ...formData,
            image_url: imageUrl
        };

        try {
            const response = await createProfile(dataToSend);
            console.log("Perfil guardado:", response.data);

            if (imageUrl) {
                localStorage.setItem("image_url", imageUrl);
            }

            // ACTUALIZAR el perfil global
            await refreshProfile();

            toast.success("Perfil guardado exitosamente", { position: 'top-center' });

            if (onProfileSave) {
                onProfileSave();
            }
        } catch (error) {
            console.error("Error al guardar el perfil:", error.response?.data || error.message);
            toast.error("Error al guardar el perfil", { position: 'top-center' });
        }
    };

    return (
        <Card className="w-100">
            <h2 style={styles.titleForm}>Configura tu perfil</h2>
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col>
                        <Form.Group className="mb-3">
                            <Form.Label style={styles.labelForm}>{isCompany ? "Nombre de la empresa" : "Nombre"}</Form.Label>
                            <Form.Control type="text" name="first_name" value={formData.first_name} onChange={handleChange} required />
                            {errors.first_name && <div style={styles.errorMessage}>{errors.first_name}</div>}
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-3">
                            <Form.Label style={styles.labelForm}>{isCompany ? "Siglas de la empresa" : "Apellido"}</Form.Label>
                            <Form.Control type="text" name="last_name" value={formData.last_name} onChange={handleChange} required />
                            {errors.last_name && <div style={styles.errorMessage}>{errors.last_name}</div>}
                        </Form.Group>
                    </Col>
                </Row>

                <Form.Group className="mb-3">
                    <Form.Label style={styles.labelForm}>{isCompany ? "Descripción de la empresa" : "Biografía"}</Form.Label>
                    <Form.Control as="textarea" name="description" value={formData.description} onChange={handleChange} />
                    {errors.description && <div style={styles.errorMessage}>{errors.description}</div>}
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label style={styles.labelForm}>Dirección</Form.Label>
                    <Form.Control type="text" name="address" value={formData.address} onChange={handleChange} required />
                    {errors.address && <div style={styles.errorMessage}>{errors.address}</div>}
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label style={styles.labelForm}>Teléfono</Form.Label>
                    <Form.Control type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} required />
                    {errors.phone_number && <div style={styles.errorMessage}>{errors.phone_number}</div>}
                </Form.Group>

                {!isCompany && (
                    <Form.Group className="mb-3">
                        <Form.Label style={styles.labelForm}>Educación</Form.Label>
                        <Form.Control type="text" name="education" value={formData.education} onChange={handleChange} required placeholder="Separar con comas" />
                        {errors.education && <div style={styles.errorMessage}>{errors.education}</div>}
                    </Form.Group>
                )}

                <Form.Group className="mb-3">
                    <Form.Label style={styles.labelForm}>{isCompany ? "Servicios ofrecidos" : "Experiencia"}</Form.Label>
                    <Form.Control type="text" name="work_experience" value={formData.work_experience} onChange={handleChange} placeholder="Separar con comas" />
                    {errors.experience && <div style={styles.errorMessage}>{errors.experience}</div>}
                </Form.Group>

                <Row>
                    <Col>
                        <Form.Group className="mb-3">
                            <Form.Label style={styles.labelForm}>{isCompany ? "Tecnologías utilizadas" : "Skills"}</Form.Label>
                            <Form.Control as="textarea" name="skills" value={formData.skills} onChange={handleChange} placeholder="Separar con comas" />
                            {errors.skills && <div style={styles.errorMessage}>{errors.skills}</div>}
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-3">
                            <Form.Label style={styles.labelForm}>Enlace de Redes Sociales</Form.Label>
                            <Form.Control as="textarea" name="social_media_links" value={formData.social_media_links} onChange={handleChange} placeholder="Separar con comas" />
                            {errors.social_media_links && <div style={styles.errorMessage}>{errors.social_media_links}</div>}
                        </Form.Group>
                    </Col>
                </Row>

                <Form.Group className="mb-3">
                    <Form.Label style={styles.labelForm}>¿Tienes GitHub? Agrega tu usuario (opcional)</Form.Label>
                    <Form.Control type="text" name="github" value={formData.github} onChange={handleChange} />
                </Form.Group>

                <button className='btn'>Guardar</button>
            </Form>
        </Card>
    );
};

// Exportamos el componente correctamente
export default FormularioPerfil;
