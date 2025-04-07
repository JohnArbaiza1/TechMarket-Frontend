import { useState } from 'react';

export const useModalState = () =>{
        // Estados para los modales
        const [showSuccessModal, setShowSuccessModal] = useState(false);
        const [showErrorModal, setShowErrorModal] = useState(false);
        const [showLimitModal, setShowLimitModal] = useState(false);
        const [modalMessage, setModalMessage] = useState('');

        // Funciones para cerrar los modales
        const handleCloseSuccessModal = () => setShowSuccessModal(false);
        const handleCloseErrorModal = () => setShowErrorModal(false);
        const handleCloseLimitModal = () => setShowLimitModal(false);

        return {
            showSuccessModal, setShowSuccessModal,
            showErrorModal, setShowErrorModal,
            showLimitModal, setShowLimitModal,
            modalMessage, setModalMessage,
            handleCloseSuccessModal,
            handleCloseErrorModal,
            handleCloseLimitModal
        };
}