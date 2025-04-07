import '../Styles/Componentes/card.css';
import { ModalPublication } from './Modal';
import { useState } from 'react';

// Componente funcional Card para mostrar los planes y sus precios
export function CardPrice ({title,subtitle,texto,description}){
    // Filtramos los elementos vacíos o undefined
    const filteredDescription = description.filter(item => item && item.trim() !== "");
    const isGratis = Math.abs(subtitle) < 0.01;
    return(
        <div className="cardPrice">
            <div className="card-bodyPrice">
                <h4 className="card-titlePrice">{title}</h4>
                <h5 className="card-price">
                    {isGratis ? "Gratuito" : `$${subtitle}`} 
                    {!isGratis && <span>/ Mes</span>}
                </h5>
                <div className="separator"></div>
                {/* Mostrar la descripción como lista */}
                <ul className="card-benefits">
                    {filteredDescription.map((item, index) => (
                        // Muestra cada elemento de la descripción como un item de lista
                        <li key={index}>
                        {/* Ícono de check */}
                        <i className="fa-solid fa-circle-check"></i> 
                        {item}
                    </li>
                    ))}
                </ul>
                <button className='btn'> {texto}</button>
            </div>
        </div>
    );
};

// Componente funcional Card, que recibe varias props
const CardProject = ({ title, image, description, children }) =>{
    return(
        <div className="card">
            {image && <img src={image} alt={title} className="card-image" />}
            <div className="card-body">
            {title && <h2 className="card-title">{title}</h2>}
            {description && <p className="card-description">{description}</p>}
            {children && <div className="card-text">{children}</div>}
            </div>
        </div>
    );
};

// Definición de valores por defecto para las props del componente Card
CardProject.defaultProps = {
    title: null,
    image: null,
    description: null,
};

//Componente Card para las punlicaciones
export const CardPublication = ({image, tags, title, description, date}) =>{
    //Definimos un estado para controlar el modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Función para generar un color HEX aleatorio
    const getRandomColor = () => {
        const letters = ["#8B5DFF", "#2E186A", "#5E308C","#CB6E5A","#BC522B"];
        return letters[Math.floor(Math.random() * letters.length)];
    };

    // const placeholderColor = getRandomColor();
    const color1 = getRandomColor();
    const color2 = getRandomColor();

    // Función para abrir y cerrar el modal
    const handleModalToggle = () => {
        setIsModalOpen(!isModalOpen);
    };

    // Función para manejar el evento de aplicar a proyecto
    const handleApply = () => {
        alert('Aplicado al proyecto');
        handleModalToggle();  // Cerramos el modal después de aplicar
    };
    
    return(
        <>
        <div className="cardPublication">
        {image ? (
                <img src={image} alt="card" className="card-imagePublication" />
            ) : (
                <div
                    className="card-imagePublication"
                    style={{
                        backgroundImage: `linear-gradient(to right, ${color1}, ${color2})`,
                        width: '100%',
                        height: '200px',
                        borderRadius: '8px',
                        filter: "drop-shadow(2px 2px 2px rgb(80, 73, 99)"
                    }}
                />
            )}
            <div className="card-content">
                <div className="card-tags">
                    {tags.map((tag, index) => (
                        <span key={index} className="card-tag">{tag}</span>
                    ))}
                </div>
                <h3 className="card-titlePublication">{title}</h3>
                <p className="card-date">{date}</p>

                <div className="cardButtonContainer">
                    <button onClick={handleModalToggle} className="card-button">
                        Leer más
                    </button>
                </div>
            </div>
            <ModalPublication 
                isOpen={isModalOpen} 
                title={title} 
                description={description} 
                onClose={handleModalToggle} 
                onApply={handleApply} 
            />
        </div>
        </>
    );
}

CardPublication.defaultProps = {
    image: null
};

export default CardProject;