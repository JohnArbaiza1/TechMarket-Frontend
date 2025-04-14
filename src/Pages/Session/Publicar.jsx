//Importamos los componentes, Hooks a emplear y los estilos
import { Container, Row, Col }from 'react-bootstrap';
import '../../Styles/Logueado/publicaciones.css' 
import React, { useEffect, useState } from 'react';
import { createPublication, getUserPublicationLimit } from '../../Services/publicationServices';
import axios from 'axios';
import ModalComponent from '../../Components/Modal';
import { usePublicationState } from '../../Hooks/usePublicationState';
import { useModalState } from '../../Hooks/useModalState';

const Publicaciones = () =>{
    // Usamos el hook usePublicationState para manejar los estados de la publicación
    const{
        title, setTitle,
        description, setDescription,
        image, setImage,
        quota, setQuota,
        rating,
        tags, setTags,
        preview, setPreview,
        loading, setLoading,
        setError,
        setSuccess,
        handleImageChange,
        handleRemoveImage , 
        API_URL
    }= usePublicationState();

    //Estados para trabajar la cantidad de publicaciones segun el plan
    const [maxPublications, setMaxPublications] = useState(0);  // Maximo de publicaciones según el plan
    const [currentPublications, setCurrentPublications] = useState(0); // Publicaciones actuales
    const now = new Date();

    // Usamos el hook useModalState para manejar los estados y funciones de los modales
    const{
        showSuccessModal, setShowSuccessModal,
        showErrorModal, setShowErrorModal,
        showLimitModal, setShowLimitModal,
        setModalMessage,
        handleCloseSuccessModal,
        handleCloseErrorModal,
        handleCloseLimitModal       
    }= useModalState();
    
    // Función para obtener el límite de publicaciones y las publicaciones actuales del usuario
    useEffect(() => {
        const userId = localStorage.getItem("user_id");

        if (userId) {
            const fetchPublicationLimit = async () => {
                try {
                    const data = await getUserPublicationLimit(userId);
                    setMaxPublications(data.maxPublications);
                    setCurrentPublications(data.currentPublications);
                } catch (error) {
                    setError("Error al obtener el límite de publicaciones.");
                    console.log(error);
                    
                }
            };

            fetchPublicationLimit();
        }
    }, [setMaxPublications, setCurrentPublications, setError]);   
    
    // Función para el envío de los datos de la publicación
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || !description || !tags) {
            setError("Por favor, completa todos los campos.");
            return;
        }

        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("user_id");
        if (!token || !userId) {
            setError("No se encontró información de autenticación.");
            return;
        }

        if (currentPublications >= maxPublications) {
            setModalMessage("No puedes crear más publicaciones. Has alcanzado tu límite.");
            setShowLimitModal(true);
            return;
        }

        let imageUrl = "default_image.jpg";
        if (image) {
            const imageFormData = new FormData();
            imageFormData.append("file", image);

            try {
                const imageResponse = await axios.post(
                    `${API_URL}upload-image`,
                    imageFormData,
                    { headers: { "Authorization": `Bearer ${token}` } }
                );

                imageUrl = imageResponse.data.url;
            // eslint-disable-next-line no-unused-vars
            } catch (error) {
                setError("Error al subir la imagen. Usando imagen predeterminada.");
            }
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("publication_description", description);
        formData.append("tags", tags);
        formData.append("quota", quota.toString());
        formData.append("publication_rating", rating.toString());
        formData.append("publication_status", "Disponible");
        formData.append("id_user", userId);
        formData.append("publication_image", imageUrl);
        setLoading(true);
        setError(null);

        try {
            const response = await createPublication(formData);
            setSuccess("Publicación creada con éxito");
            setShowSuccessModal(true);
            setCurrentPublications(currentPublications + 1);
            setTitle('');
            setDescription('');
            setTags('');
            setQuota(1);
            setImage(null);
            setPreview(null);
            console.log(response);
        // eslint-disable-next-line no-unused-vars
        } catch (error) {
            setShowErrorModal(true);
        } finally {
            setLoading(false);
        }
    };

    return(
        <>
            <Container>
                <div className="container2">
                    <h2 className='mensaje'>Crear Nueva Publicación</h2>
                    <br />
                    <div className="title-input text-center mb-3">
                        <p>Publicaciones: {currentPublications} de {maxPublications} disponibles</p>
                    </div>

                    <Row>
                        <Col className="col-publication">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label className="title-input" htmlFor="title">Título</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="title-input" htmlFor="description">Descripción</label>
                                    <textarea
                                        className="form-control"
                                        id="description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows="4"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                        <label className="title-input" htmlFor="tags">Etiquetas</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="tags"
                                            value={tags}
                                            onChange={(e) => setTags(e.target.value)}
                                            placeholder="Comas separadas"
                                            required
                                        />
                                </div>

                                <div className="form-group">
                                    <label className="title-input" htmlFor="quota">Ingrese el número de Cupos</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="quota"
                                        value={quota}
                                        min="1"
                                        onChange={(e) => setQuota(Number(e.target.value))}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className='title-input' htmlFor="image">Imagen </label>
                                    <input
                                        type="file"
                                        className="form-control-file"
                                        id="image"
                                        onChange={handleImageChange}
                                        accept="image/*"
                                        style={{ display: 'none' }} 
                                    />
                                    <div className="buttonsIMG">
                                        <button
                                            type="button" // Cambiado a type="button" para evitar submit del formulario
                                            className="btn-img"
                                            onClick={() => document.getElementById('image').click()} 
                                        >
                                            Seleccionar Imagen
                                        </button>
                                        <button
                                            type="button" // Cambiado a type="button" para evitar submit del formulario
                                            className="btn-img"
                                            onClick={handleRemoveImage}
                                        >
                                            Quitar Imagen
                                        </button>
                                    </div>
                                </div>
                                <button type="submit" className="btn"
                                    disabled={loading || currentPublications >= maxPublications}>
                                    {loading ? 'Procesando...' : 'Crear Publicación'}
                                </button>
                            </form>
                        </Col>
                        
                        <Col className="d-flex flex-column align-items-center">
                            <div className="text-center mb-3">
                                <h2 className="title-input">Vista Previa</h2>
                            </div>
                            <br />
                            <div className="cardPublicationPrevia">
                                {preview && (
                                        <img
                                            src={preview}
                                            alt="Vista previa"
                                            className="card-imagePublication"
                                        />
                                )}

                            <div className="contenidoPrevia">
                                {/* Mostrar etiquetas con el color seleccionado */}
                                {tags && (
                                    <div>
                                        <p>
                                            {tags.split(',').map((tag, index) => (
                                                <span
                                                    key={index}
                                                    style={{
                                                        backgroundColor: '#169976', // Color de fondo de la etiqueta
                                                        color: '#fff',  // Color del texto de la etiqueta
                                                        padding: '5px 10px',
                                                        borderRadius: '15px',
                                                        marginRight: '8px',
                                                        display: 'inline-block',
                                                        marginBottom: '5px',
                                                    }}
                                                >
                                                    {tag.trim()}
                                                </span>
                                            ))}
                                        </p>
                                    </div>
                                    )}
                                    <br />
                                    {title && (
                                        <div>
                                            <p className='card-titlePublication'>{title}</p>
                                        </div>
                                    )}
                                    <br />
                                    {description && (
                                        <div>
                                            <p>{description}</p>
                                        </div>
                                    )}
                                    <p className="card-date">{now.toLocaleDateString()}</p>
                            </div>                          
                            </div>
                        </Col>
                    </Row>
                </div>
            </Container>

            <ModalComponent
                show={showSuccessModal}
                onHide={handleCloseSuccessModal}
                title="Publicación Exitosa"
                message={"¡Listo! Tu proyecto ya está publicado y listo para recibir postulaciones."}
                variant="success"
            />
            {/* Modal de Error */}
            <ModalComponent
                show={showErrorModal}
                onHide={handleCloseErrorModal}
                title="Oops..."
                message={"¡Algo salió mal!"}
                variant="error"
            />
            {/* Modal de Límite alcanzado */}
            <ModalComponent
                show={showLimitModal}
                onHide={handleCloseLimitModal}
                title="Límite de Publicaciones"
                message={"No puedes crear más publicaciones. Te recomendamos actualizar tu plan para continuar publicando."}
                variant="warning"
                onAction={() => {
                
                }}  
                ></ModalComponent>
        </>
    );
}

export default Publicaciones;