import { useState } from "react";
import {Card ,Form }from 'react-bootstrap';
import { createProfile } from "../Services/profileService";

const FormularioPerfil = ({ userId, onProfileSave}) => {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        phone_number: "",
        address: "",
        description: "",
        id_user: userId,
        github: ""
    });

    const styles = {
        titleForm: {
            fontFamily: '"Tektur", sans-serif',
            fontWeight: "600",
            color: "#2E186A",
            fontSize: "1.8em",
            marginTop: "10px",
            marginBottom: "40px"
        },
        labelForm:{
            color:"#63318A"
        }
    };

    // Maneja cambios en los inputs
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    

    // Función para manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await createProfile(formData);
            console.log("Perfil guardado:", response.data);
            alert("Perfil guardado exitosamente");

            if (onProfileSave) {
                onProfileSave();
            }
        } catch (error) {
            console.error("Error al guardar el perfil:", error.response?.data || error.message);
            alert("Error al guardar el perfil");
        }
    };

    return (
        <>
            <Card className="w-100">
                <h2 style={styles.titleForm}>Configura tu perfil</h2>
                <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label style={styles.labelForm}>Nombre</Form.Label>
                    <Form.Control type="text" name="first_name" value={formData.first_name} onChange={handleChange} required />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label style={styles.labelForm}>Apellido</Form.Label>
                    <Form.Control type="text" name="last_name" value={formData.last_name} onChange={handleChange} required />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label style={styles.labelForm}>Biografía</Form.Label>
                    <Form.Control as="textarea" name="description" value={formData.description} onChange={handleChange} />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label style={styles.labelForm}>Dirección</Form.Label>
                    <Form.Control type="text" name="address" value={formData.address} onChange={handleChange} required />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label style={styles.labelForm}>Teléfono</Form.Label>
                    <Form.Control type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} required />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label style={styles.labelForm}>Tienes GitHub agrega tu nombre de usuario (opcional)</Form.Label>
                    <Form.Control type="text" name="github" value={formData.github} onChange={handleChange} />
                </Form.Group>

                <button className='btn'>
                    Guardar
                </button>

                </Form>

            </Card>
        </>
    );

};

// Exportamos el componente correctamente
export default FormularioPerfil;
