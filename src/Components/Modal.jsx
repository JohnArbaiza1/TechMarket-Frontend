import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FaCheckCircle, FaTimesCircle, FaExclamationCircle } from 'react-icons/fa'; // Importamos los iconos
import '../Styles/Componentes/Modals.css';
import '../Styles/Componentes/ModalAplicants.css';
import { First, Last} from 'react-bootstrap/esm/PageItem';
import { UserCard } from './Card';
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';


const ModalComponent = ({ show, onHide, title,message, variant, onAction}) => {
    // Función para renderizar el icono según el tipo de acción
    const renderIcon = () => {
        switch (variant) {
            case 'success':
                return <FaCheckCircle style={{ color: '#8B5DFF', fontSize: '94px'}} />;
            case 'error':
                return <FaTimesCircle style={{ color: 'BC522B', fontSize: '94px' }} />;
            case 'warning':
                return <FaExclamationCircle style={{ color: '#CB6E5A', fontSize: '94px'}} />;
            default:
                return null;
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton style={{ color: 'white' }}>
            </Modal.Header>
            <Modal.Body style={{ textAlign:'center', padding:'20px'}}>
                {renderIcon()}
                <br /> <br />
                <h3>{title}</h3>
                <p>{message}</p>
            </Modal.Body>
            <Modal.Footer>
                {onAction && (
                    <Button variant="warning" onClick={onAction}>
                        Actualizar Plan
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    );
};

export const ModalPublication = ({ isOpen, title, description, onClose, onApply, onCancel,isApplied,isOwner}) =>{
    if (!isOpen) return null;
    return(
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>{title}</h2>
                <p>{description}</p>
                <div className="container-modal">
                    <button className='close-Modal' onClick={onClose}>
                        Cerrar
                    </button>
                    {/* Mostramos los botones solo si el usuario no es el propietario */}
                    {!isOwner && (
                        <>
                            {!isApplied && (
                                <button className='btnAplicar-proyecto' onClick={onApply} disabled={isApplied}>
                                    Aplicar a Proyecto
                                </button>
                            )}
                            
                            {isApplied && (
                                <button className="btnCancelar-proyecto" onClick={onCancel}>
                                    Quitar solicitud
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>       
    );
}

export const ModalAplicants = ({ isOpen, isClose, applicants, publication, viewApplicants }) => {
    const navigate = useNavigate();
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                { viewApplicants ? (
                    <h2>Solicitudes Aceptadas</h2> ): (
                    <h2>Solicitudes Pendientes</h2>)}
                <div className="applicants-list">
                    {applicants.length == 0 ? (
                        {viewApplicants} ? (
                            <h4 className='no-applicants'>Aun no ha aceptado solicitudes</h4>
                        ) : (
                            <h4 className='no-applicants'>Aun no hay solicitantes</h4>
                        )
                    ) : (
                        applicants.map((applicant) =>
                            !applicant.is_selected ? ( 
                                <UserCard
                                    key={applicant.users.id}
                                    user={applicant.users}
                                    profile={applicant.users.profile}
                                    isFollowing={false} // O alguna lógica si tienes eso
                                    onFollowToggle={() => {}}
                                    viewProfile={(username) => navigate(`/profile/${username}`)}
                                    applicants={true}
                                    sendMessage={(userId) => navigate(`/Pruebas/${userId}`)}
                                    publication={publication}
                                />
                            ) : null 
                        )
                    )}
                </div>
                <button className='close-Modal' onClick={isClose}>
                    Cerrar
                </button>
                
            </div>
        </div>
    );
};
export const ModalAcceptedApplicants = ({ isOpen, onClose, acceptedApplicants, publication }) => {
    if (!isOpen) return null;
    const navigate = useNavigate();
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Solicitantes Aceptados</h2>
                <div className="applicants-list">
                    {acceptedApplicants.length === 0 ? (
                        <h4 className="no-applicants">Aún no hay solicitantes aceptados</h4>
                    ) : (
                        acceptedApplicants.map((applicant) => (
                            <UserCard
                                key={applicant.users.id}
                                user={applicant.users}
                                profile={applicant.users.profile}
                                isFollowing={false}
                                onFollowToggle={() => {}}
                                viewProfile={(username) => navigate(`/profile/${username}`)}
                                publication={publication}
                                applicants={true}
                                inAcceptedView={true}
                            />
                        ))
                    )}
                </div>
                <button className="close-Modal" onClick={onClose}>
                    Cerrar
                </button>
            </div>
        </div>
    );
};

export const MyMembership = ({ show, onHide, currentPlan, onUpdatePlan }) =>{
    const navigate = useNavigate();

    const handleGoToUpdate = () => {
        onHide(); 
        navigate("/update-membership");
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Tu Plan Actual</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ textAlign: 'center' }}>
                <h4>{currentPlan?.membership_name || "Plan Desconocido"}</h4>
                <p><strong>Precio:</strong> {currentPlan?.price ? `$${currentPlan.price}` : "N/A"}</p>
                <p><strong>Descripción:</strong> <br /> {currentPlan?.membership_description || "Sin descripción"}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleGoToUpdate}>
                    Actualizar Plan
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalComponent;
