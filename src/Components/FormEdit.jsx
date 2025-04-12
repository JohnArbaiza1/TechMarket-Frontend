import { useState, useEffect } from "react";
import { Card, Form, Button, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; 
import {getProfile, updateProfile} from "../Services/profileService";
import {toast } from "sonner";

const FormularioEditPerfil = ({ userId, mode }) => {
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        phone_number: "",
        address: "",
        description: "",
        education: "",
        work_experience:"",
        skills:"",
        social_media_links:"",
        github: "",
        image: null,
    });

    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate(); // Hook para redirigir
    const membershipId = parseInt(localStorage.getItem("id_membership")); // 1 = Profesional, 3 = Empresa
    const isCompany = membershipId === 3;

    useEffect(() => {
        if (mode === "edit" && userId) {
            (async () => {
                try {
                    const { data } = await getProfile(userId);
                    setFormData({
                        first_name: data.first_name || "",
                        last_name: data.last_name || "",
                        phone_number: data.phone_number || "",
                        address: data.address || "",
                        description: data.description || "",
                        education: data.education || "",
                        work_experience: data.work_experience || "",
                        skills: data.skills || "",
                        social_media_links: data.social_media_links || "",
                        github: data.github || "",
                        image: null,
                    });

                    if (data.image_url) setImagePreview(data.image_url);
                } catch (error) {
                    console.error("Error al obtener el perfil:", error);
                    toast.error("Error al cargar el perfil", { position: "top-center" });
                }
            })();
        }
    }, [mode, userId]);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === "file") {
            const file = files[0];
            setFormData((prev) => ({ ...prev, image: file }));
            setImagePreview(URL.createObjectURL(file));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }

        // Limpiar errores al escribir
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const validarCampos = () => {
        const newErrors = {};
        const requiredFields = ["first_name", "last_name", "description", "phone_number", "address", "education"];

        requiredFields.forEach((field) => {
            if (!formData[field]?.trim()) {
                newErrors[field] = "Este campo es obligatorio.";
            }
        });

        if (formData.phone_number && !/^\d{1,9}$/.test(formData.phone_number)) {
            newErrors.phone_number = "Solo números, máximo 8 dígitos.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validarCampos()) {
            toast.error("Completa los campos obligatorios.", { position: "top-center" });
            return;
        }

        let imageUrl = "";

        if (formData.image) {
            try {
                imageUrl = URL.createObjectURL(formData.image);
            } catch (err) {
                toast.error("Error al subir la imagen.", { position: "top-center" });
                console.log(err);       
            }
        } else if (formData.github) {
            imageUrl = `https://unavatar.io/github/${formData.github.trim()}`;
        } else if (imagePreview) {
            imageUrl = imagePreview;
        }

        const payload = {
            ...formData,
            image_url: imageUrl,
        };

        try {
            const response = await updateProfile(userId, payload);
            toast.success("Perfil actualizado exitosamente", { position: "top-center" });
            // Actualizar el localStorage con la nueva imagen
            localStorage.setItem("image_url", imageUrl);
            // Redirigir a la vista de perfil
            navigate("/profile"); // Redirige a la vista de perfil
            return response;
        } catch (error) {
            console.error("Error al guardar el perfil:", error);
            toast.error("Error al guardar el perfil", { position: "top-center" });
        }
    };

    const renderInput = (label, name, type = "text", as = "input") => (
        <Form.Group className="mb-3">
            <Form.Label>{label}</Form.Label>
            <Form.Control
                as={as}
                type={type}
                name={name}
                value={formData[name] || ""}
                onChange={handleChange}
                isInvalid={!!errors[name]}
            />
            <Form.Control.Feedback type="invalid">{errors[name]}</Form.Control.Feedback>
        </Form.Group>
    );

    return (
        <Card className="w-100 p-4">
            <h2 className="mb-4">Configura tu perfil</h2>
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col>{renderInput(isCompany ? "Nombre de la empresa" : "Nombre", "first_name")}</Col>
                    <Col>{renderInput(isCompany ? "Siglas de la empresa" : "Apellido", "last_name")}</Col>
                </Row>
                {renderInput(isCompany ? "Descripción de la empresa" : "Biografía", "description", "text", "textarea")}
                {renderInput("Dirección", "address")}
                {renderInput("Teléfono", "phone_number")}
                {!isCompany && renderInput("Educación", "education")}
                {renderInput(isCompany ? "Servicios ofrecidos" : "Experiencia", "work_experience")}
                <Row>
                    <Col>{renderInput(isCompany ? "Tecnologías utilizadas" : "Skills", "skills", "text", "textarea")}</Col>
                    <Col>{renderInput("Enlaces de redes sociales", "social_media_links", "text", "textarea")}</Col>
                </Row>
                {renderInput("GitHub (opcional)", "github")}

                <Form.Group className="mb-3">
                    <Form.Label>Imagen de perfil</Form.Label>
                    <Form.Control type="file" name="image" onChange={handleChange} disabled/>
                    {imagePreview && (
                        <img
                            src={imagePreview}
                            alt="Vista previa"
                            style={{ width: "150px", height: "150px", marginTop: "10px", objectFit: "cover", borderRadius: "10px" }}
                        />
                    )}
                </Form.Group>
                <Button type="submit">Guardar</Button>
            </Form>
        </Card>
    );
};

export default FormularioEditPerfil;