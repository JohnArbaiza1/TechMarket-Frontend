import '../Styles/card.css';

// Componente funcional Card para mostrar los planes y sus precios
export function CardPrice ({title,subtitle,texto}){
    return(
        <div className="card">
            <div className="card-body">
                <h4 className="card-title">{title}</h4>
                <h5 className='sub-title'>{subtitle}</h5>
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