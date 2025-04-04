import '../Styles/Componentes/card.css';

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

export default CardProject;