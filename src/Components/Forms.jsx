import { useState } from "react";
import {Card ,Form }from 'react-bootstrap';
import { createProfile } from "../Services/profileService";
import {toast } from "sonner";

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

    //Evento para los errores
    const [errors, setErrors] = useState({
        first_name: "",
        last_name: "",
        phone_number: "",
        address: "",
        description: ""
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
        },
        errorMessage: {
            color: "red",
            fontSize: "0.9em",
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
            [e.target.name]:""
        });
    };

    //Validaciones
    const validacionesForm = () =>{

        let formIsValid = true;
        const newErrors = {};

        if (!formData.first_name.trim()) {
            formIsValid = false;
            newErrors.first_name = "El nombre es obligatorio.";
        }

        if (!formData.last_name.trim()) {
            formIsValid = false;
            newErrors.last_name = "El apellido es obligatorio.";
        }

        if (formData.description.trim() === "") {
            formIsValid = false;
            newErrors.description = "La biografía es obligatoria.";
        }

        if (!formData.phone_number.trim()) {
            formIsValid = false;
            newErrors.phone_number = "El teléfono es obligatorio.";
        }else if(!/^\d+$/.test(formData.phone_number)){
            formIsValid = false;
            newErrors.phone_number = "El teléfono solo puede contener números.";
        }

        if (!formData.address.trim()) {
            formIsValid = false;
            newErrors.address = "La dirección es obligatoria.";
        }

        setErrors(newErrors);
        return formIsValid;
    }

    // Función para manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validacionesForm()) {
            toast.error("Por favor, complete los campos obligatorios.", {position:'top-center'});
            return;
        }

        let imageUrl = "";
        if (formData.github.trim() !== "") {
            imageUrl = `https://unavatar.io/github/${formData.github.trim()}`;
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
            toast.success("Perfil guardado exitosamente", {position:'top-center'});

            if (onProfileSave) {
                onProfileSave();
            }
        } catch (error) {
            console.error("Error al guardar el perfil:", error.response?.data || error.message);
            toast.error("Error al guardar el perfil", {position:'top-center'});
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
                    {errors.first_name && <div style={styles.errorMessage}>{errors.first_name}</div>}
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label style={styles.labelForm}>Apellido</Form.Label>
                    <Form.Control type="text" name="last_name" value={formData.last_name} onChange={handleChange} required />
                    {errors.last_name && <div style={styles.errorMessage}>{errors.last_name}</div>}
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label style={styles.labelForm}>Biografía</Form.Label>
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
