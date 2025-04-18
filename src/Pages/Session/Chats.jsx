import { useState, useEffect } from 'react';
import {Container, Row, Col }from 'react-bootstrap';
import '../../Styles/Logueado/ChatLayout.css' 
import { FaSearch, FaPaperPlane, FaArrowLeft } from 'react-icons/fa';
import images from "../../JS/images";
import { MessageCard } from '../../Components/Card';

const ChatsUsers = () =>{
    const [selectedChat, setSelectedChat] = useState(null);
    const [messageInput, setMessageInput] = useState("");
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);


    const handleSelectChat = (chatUser) => {
        setSelectedChat(chatUser);
        setMessageInput("");
    };
    

    return (
        <>
        <Container fluid className="container-chat">
            <Row className="h-100">
                {/* Columna con la lista de Chats */}
                {(!selectedChat || !isMobile) && (
                    <Col xs={12} md={4} className="p-0 chat-sidebar">
                        {/* Barra de busqueda */}
                        <div className='p-3 border-bottom bg-white'>
                            <div className="position-relative">
                                <FaSearch className="search-icon" />
                                <input
                                    type="text"
                                    className="form-control ps-5"
                                    placeholder="Buscar un chat o iniciar uno nuevo"
                                />
                            </div>
                        </div>

                        <div className="list-group">
                            <MessageCard
                            image = {images['img-4']}
                            user = {"John Dev"}
                            message={"Hola que tal"}
                            notification={4}
                            onClick={() =>
                                handleSelectChat({
                                    name: "John Dev",
                                    image: images['img-4'],
                                    message: "Hola que tal "
                                })
                            }
                            >
                            </MessageCard>
                        </div>
                    </Col>
                )}

                {/* Columna donde se Chatea */}
                {(selectedChat || !isMobile) && (
                    <Col xs={12} md={8} className="p-0 chat-panel">
                        {!selectedChat ? (
                            <div className="content-img">
                                <img src={images['img-4']} alt="Imagen bienvenida" className="img-chat mb-4" />
                                <br />
                                <h3 className="text-muted fs-5">¿Listo para hablar? Elige un contacto para empezar. </h3>
                            </div>
                        ) : (
                            <div className="d-flex flex-column cuerpo-chat">
                                {window.innerWidth < 768 && (
                                    <button
                                        className="btn-volver text-decoration-none me-2"
                                        onClick={() => setSelectedChat(null)}
                                    >
                                        <FaArrowLeft/>
                                    </button>
                                )}

                                <div className="p-3 border-bottom bg-white d-flex align-items-center">
                                    <img src={selectedChat.image} alt={selectedChat.name} className="rounded-circle me-2" style={{ width: '40px', height: '40px' }} />
                                    <strong>{selectedChat.name}</strong>
                                </div>
                                
                                {/* Cuerpo del chat - zona de mensajes */}
                                <div className="flex-grow-1 p-3 overflow-auto">
                                    {/* Aquí irían los mensajes */}
                                </div>
                                {/* Input del mensaje */}
                                <div className="p-3 border-top">
                                    <div className="input-group">
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            placeholder="Escribe un mensaje..." 
                                            value={messageInput}
                                            onChange={(e) => setMessageInput(e.target.value)}
                                        />
                                        <button className="btn-enviar" type="button">
                                            <FaPaperPlane />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Col>
                )}
            </Row>
        </Container>
        </>
    );
};

export default ChatsUsers;