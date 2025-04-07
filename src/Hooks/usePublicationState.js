import { useState } from 'react';

export const usePublicationState = () => {
        //Definimos todos los estados a emplear
        //--------------------------------------------------
        //Estados para los datos de la publicación
        const [title, setTitle] = useState('');
        const [description, setDescription] = useState('');
        const [image, setImage] = useState(null);
        const [quota, setQuota] = useState(1); 
        const [rating, setRating] =  useState(0.00);
        const [tags, setTags] = useState('');
        const [tagColor, setTagColor] = useState('#000000');
        //--------------------------------------------------
        //Estados para manejo de carga, vista previa, errores y mensajes
        const [preview, setPreview] = useState(null);
        const [loading, setLoading] = useState(false); 
        const [error, setError] = useState(null);
        const [success, setSuccess] = useState(null);

        //Funciones para cambio de imagen y quitar imagen 
        const handleImageChange = (e) =>{
            e.preventDefault(); 
            const file = e.target.files[0];

            //Valiadmos si el archivo subido es una imagen
            if (file && !file.type.startsWith('image/')) {
                alert('Por favor, selecciona un archivo de imagen.');
                return;
            }

            //Validamos el tamaño de la imagen
            if (file && file.size > 5 * 1024 * 1024) {
                alert('El archivo es demasiado grande. El tamaño máximo es 5MB.');
                return;
            }

            //Para la vista previa
            setImage(file);
            setPreview(URL.createObjectURL(file));
        };

        //Funcipon para quitar la imagen
        const handleRemoveImage = (e) => {
            e.preventDefault();
            setImage(null);
            setPreview(null);
        };

        return {
            title, setTitle,
            description, setDescription,
            image, setImage,
            quota, setQuota,
            rating, setRating,
            tags, setTags,
            preview, setPreview,
            loading, setLoading,
            error, setError,
            success, setSuccess,
            handleImageChange,
            handleRemoveImage,
            tagColor, setTagColor
        };
}