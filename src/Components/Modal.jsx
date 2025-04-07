import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FaCheckCircle, FaTimesCircle, FaExclamationCircle } from 'react-icons/fa'; // Importamos los iconos
import '../Styles/Componentes/Modals.css';

const ModalComponent = ({ show, onHide, title, message, variant, onAction }) => {
    // Función para renderizar el icono según el tipo de acción
    const renderIcon = () => {
        switch (variant) {
            case 'success':
                return <FaCheckCircle style={{ color: 'white', fontSize: '24px', marginLeft: '10px' }} />;
            case 'error':
                return <FaTimesCircle style={{ color: 'white', fontSize: '24px', marginLeft: '10px' }} />;
            case 'warning':
                return <FaExclamationCircle style={{ color: 'white', fontSize: '24px', marginLeft: '10px' }} />;
            default:
                return null;
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton style={{ backgroundColor: variant === 'success' ? '#5E308C' : variant === 'error' ? '#BC522B' : '#CB6E5A', color: 'white' }}>
                <Modal.Title>
                    {title}
                    {/* Aquí se muestra el icono al lado del título */}
                    {renderIcon()}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{message}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant={variant} onClick={onHide}>
                    Cerrar
                </Button>
                {onAction && (
                    <Button variant="warning" onClick={onAction}>
                        Actualizar Plan
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    );
};

export const ModalPublication = ({ isOpen, title, description, onClose, onApply }) =>{
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
                    <button className='btnAplicar-proyecto' onClick={onApply}>
                        Aplicar a Proyecto
                    </button>
                </div>
            </div>
        </div>       
    );

}

export default ModalComponent;
