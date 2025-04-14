import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FaCheckCircle, FaTimesCircle, FaExclamationCircle } from 'react-icons/fa'; // Importamos los iconos
import '../Styles/Componentes/Modals.css';

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

export default ModalComponent;
