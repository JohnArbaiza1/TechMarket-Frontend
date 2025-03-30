import { useState } from "react";
import {Card ,Form }from 'react-bootstrap';

const FormularioPerfil = () => {
    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        biografia: "",
        direccion: "",
        telefono: "",
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
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Datos del usuario:", formData);
        alert("Perfil guardado exitosamente");
    };

    return (
        <>
            <Card style={{ width: '30rem' }}>
                <h2 style={styles.titleForm}>Configura tu perfil</h2>
                <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label style={styles.labelForm}>Nombre</Form.Label>
                    <Form.Control type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label style={styles.labelForm}>Apellido</Form.Label>
                    <Form.Control type="text" name="apellido" value={formData.apellido} onChange={handleChange} required />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label style={styles.labelForm}>Biografía</Form.Label>
                    <Form.Control as="textarea" name="biografia" value={formData.biografia} onChange={handleChange} />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label style={styles.labelForm}>Dirección</Form.Label>
                    <Form.Control type="text" name="direccion" value={formData.direccion} onChange={handleChange} required />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label style={styles.labelForm}>Teléfono</Form.Label>
                    <Form.Control type="tel" name="telefono" value={formData.telefono} onChange={handleChange} required />
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
