import Accordion from 'react-bootstrap/Accordion';
import FormularioEditPerfil from "../../Components/FormEdit";

const SettingsPage = () =>{
    const userId = localStorage.getItem("user_id");
    return(
        <>
            <div className="cuerpo-profile">
                <h2 className="title-Profile text-center">Configuración</h2>
                <br />
                <Accordion>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header><i className="fa-solid fa-pen-to-square"></i> Editar Perfil</Accordion.Header> 
                        <Accordion.Body>
                            <FormularioEditPerfil userId={userId} mode="edit" />
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>

            </div>
        </>
    );
}

export default SettingsPage;