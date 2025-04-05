//Importamos los componentes a emplear y los estilos
import { Container }from 'react-bootstrap';
import '../../Styles/Logueado/publicaciones.css' 
import React, { useState } from 'react';

const Publicaciones = () =>{

    //Definimos los estados a emplear
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [quota, setQuota] = useState('');
    const [rating, setRating] = useState('');
    const [tags, setTags] = useState('');
    const [preview, setPreview] = useState(null);
    
    // Función para manejar el cambio de imagen
    const handleImageChange = (e) => {
        const file = e.target.files[0];

        // Validar si es un archivo de imagen
        if (file && !file.type.startsWith('image/')) {
            alert('Por favor, selecciona un archivo de imagen.');
            return;
        }

        // Validar el tamaño del archivo (máximo 5MB)
        if (file && file.size > 5 * 1024 * 1024) {
            alert('El archivo es demasiado grande. El tamaño máximo es 5MB.');
            return;
        }

        // Establecer la imagen y vista previa
        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    return (
        <>
            <Container>
                        <h2 className='mensaje'>Crear Nueva Publicación</h2>
                        <div className="container2">
                            <form>
                                <div className="form-group">
                                    <label className='title-input' htmlFor="title">Título</label>
                                    <input
                                    type="text"
                                    className="form-control"
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    />
                                </div>
                                <br />

                                <div className="form-group">
                                    <label className='title-input' htmlFor="description">Descripción</label>
                                    <textarea
                                    className="form-control"
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows="4"
                                    required
                                    />
                                </div>

                                <br />

                                <div className="form-group">
                            <label className='title-input' htmlFor="image">Imagen </label>
                            <input
                                type="file"
                                className="form-control-file"
                                id="image"
                                onChange={handleImageChange}
                                accept="image/*"
                                required
                                style={{ display: 'none' }} // Ocultar el input real
                            />
                            <button
                                className="custom-upload-button"
                                onClick={() => document.getElementById('image').click()} // Activar el input de archivo
                            >
                                Seleccionar Imagen
                            </button>
                            {/* Vista previa de la imagen */}
                            {preview && (
                                <div>
                                    <p>Vista previa:</p>
                                    <img
                                        src={preview}
                                        alt="Vista previa"
                                        style={{ maxWidth: '100%', maxHeight: '200px', marginTop: '10px' }}
                                    />
                                </div>
                            )}
                                </div>
                                <br />

                                <div className="form-group">
                                    <label className='title-input' htmlFor="tags">Etiquetas</label>
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

                                <div className="publicar">
                                    <button type="submit" className="btn btn-publiacion">Crear Publicación</button>
                                </div>
                            </form>
                        </div>


            </Container>
        </>
    );
}

export default Publicaciones;