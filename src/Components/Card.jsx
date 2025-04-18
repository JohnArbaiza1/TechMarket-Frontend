import { postAplicationProyect, delApplicantUserPublication, getApplicantByPublication} from '../Services/aplicationsService';
import '../Styles/Componentes/card.css';
import { ModalAplicants, ModalPublication } from './Modal';
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

//Componente Card para las publicaciones
export const CardPublication = ({ image, tags, title, description, date, quota, rating, id_publication, isApplied,isOwner}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenApplicants, setIsModalOpenApplicants] = useState(false);
    const [isAppliedCard, setIsApplied] = useState(isApplied); // Estado para verificar si el usuario ya aplicó al proyecto
    const [dataApplicants, setDataApplicants] = useState([]); // Estado para almacenar los datos de los solicitantes
    const [isLoading, setIsLoading] = useState(false); // Estado para manejar la carga de datos

    // Función para generar un color HEX aleatorio
    const getRandomColor = () => {
        const letters = ["#8B5DFF", "#2E186A", "#5E308C", "#CB6E5A", "#BC522B"];
        return letters[Math.floor(Math.random() * letters.length)];
    };

    const color1 = getRandomColor();
    const color2 = getRandomColor();

    // Función para abrir y cerrar el modal
    const handleModalToggle = () => {
        setIsModalOpen(!isModalOpen);
    };

    // Función para manejar el evento de aplicar a proyecto
    const handleApply = async () => {
        try {
            const response = await postAplicationProyect({
                id_publication: id_publication, // ID de la publicación
            });

            if (response.status === 201) {
                alert('Aplicado al proyecto exitosamente');
                setIsApplied(true); // Cambiar el estado a "aplicado"
            } else if (response.status === 400) {
                alert('Ya estás aplicado a este proyecto');
            } else {
                alert('Ocurrió un error inesperado. Inténtalo nuevamente.');
            }
        } catch (error) {
            console.error('Error al aplicar al proyecto:', error.response?.data || error.message);
            alert('Ocurrió un error al procesar tu solicitud. Inténtalo más tarde.');
        }
    };
    // Función para manejar el evento de cancelar la solicitud
    const handleCancel = async () => {
        try {
            const response = await delApplicantUserPublication(
                id_publication // ID de la publicación
            ); 
            if (response.status === 200) {
                alert('Aplicación cancelada exitosamente');
                setIsApplied(false); // Cambiar el estado a "aplicado"
            } else if (response.status === 203) {
                alert('No se puede cancelar la solicitud porque no existe');
            } else {
                alert('Ocurrió un error inesperado. Inténtalo nuevamente.');
            }
        } catch (error) {
            console.error('Error al cancelar la solicitud:', error.response?.data || error.message);
            alert('Ocurrió un error al cancelar la solicitud. Inténtalo más tarde.');
        }
    };

    // Función para ver las solicitudes 
    const handleViewApplications = async () => {
        setIsLoading(true); // Inicia el estado de carga
        try {
            const response = await getApplicantByPublication(id_publication);
            if (response.status === 200) {
                setDataApplicants(response.data); // Guardar los datos de los solicitantes en el estado
                setIsModalOpenApplicants(true); // Abrir el modal solo después de cargar los datos
            } else if (response.status === 203) {
                alert('No hay solicitudes para este proyecto');
            } else {
                alert('Ocurrió un error inesperado. Inténtalo nuevamente.');
            }
        } catch (error) {
            console.error('Error al cargar las solicitudes:', error.response?.data || error.message);
            alert('Ocurrió un error al cargar las solicitudes. Inténtalo más tarde.');
        } finally {
            setIsLoading(false); // Finaliza el estado de carga
        }
    };
    

    return (
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
                    <p className="card-date">Cupos disponibles: {quota}</p>
                    <p className='card-date'>Rating: {rating}</p>
                    <p className="card-date">{date}</p>
                    <div className="cardButtonContainer">
                        {isOwner ? (
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                <button 
                                    onClick={handleViewApplications} 
                                    className="card-button"
                                >
                                    Ver solicitudes
                                </button>
                                <button onClick={handleModalToggle} className="card-button">
                                    Leer más
                                </button>
                            </div>
                        ) : (
                            <>
                                <p style={{paddingRight: '35%', paddingTop: '1.5vh', fontSize: '14px', color: '#8B5DFF' }}>
                                    {isApplied ? "Ya aplicado" : ""}
                                </p>
                                <button onClick={handleModalToggle} className="card-button">
                                    Leer más
                                </button>
                            </>
                        )}
                    </div>
                </div>
                <ModalPublication
                    isOpen={isModalOpen}
                    title={title}
                    description={description}
                    onClose={handleModalToggle}
                    onApply={handleApply}
                    onCancel={handleCancel}
                    isApplied={isAppliedCard}
                    isOwner={isOwner}
                />
                
                {isLoading ? (
                    <div className="loading-indicator">Cargando solicitudes...</div>
                ) : (
                    <ModalAplicants
                        isOpen={isModalOpenApplicants}
                        isClose={() => setIsModalOpenApplicants(false)}
                        applicants={dataApplicants}
                    />
                )}
            </div>
        </>
    );
};

CardPublication.defaultProps = {
    image: null
};

export const UserCard = ({ user, profile, isFollowing, onFollowToggle, viewProfile, applicants, sendMessage }) => {

    if (!profile) return null;

    const getButtonText = () => {
        return applicants ? 'Ver perfil' : (isFollowing ? "Siguiendo" : "Seguir");
    };

    const getButtonClass = () => {
        return applicants ? 'btn-followCard is-following' :
            (isFollowing ? 'btn-followCard is-following' : 'btn-followCard');
    };

    return (
        <section className='followCard'>
            <header className='followCard-Header'>
                <img src={profile.image_url} alt="img-profile" className='followCard-Profile' />
                <div className="followCard-info">
                    <span className='followCard-name'>{profile.first_name} {profile.last_name}</span>
                    <span className="followCard-info-userName">@{user.user_name}</span>
                </div>

                <div className='followCard-container-buttons'>
                    <button
                        className={getButtonClass()}
                        onClick={applicants
                            ? () => viewProfile(user.user_name)
                            : () => onFollowToggle(user.id)
                        }
                    >
                        {getButtonText()}
                    </button>

                    <button onClick={() => sendMessage(user.id)} className="btn-followCard">
                        Mensaje
                    </button>
                </div>
            </header>
        </section>
    );
};

export const MessageCard = ({image, user, message,notification,onClick}) =>{

    return(
        <section className="chatCard" onClick={onClick}>
            <div className="chatCard-header">
                <img src={image} alt="Profile" className="chatCard-avatar" />

                <div className="chatCard-body">
                    <div className="chatCard-username">@{user}</div>
                    <div className="chatCard-message">{message}</div>
                </div>

                {notification && (
                    <div className="content-noti">
                        <div className="chatCard-notification">
                            <span>{notification}</span>
                        </div>
                    </div>
                )}
            </div>
        </section>

    );
}
export default CardProject;