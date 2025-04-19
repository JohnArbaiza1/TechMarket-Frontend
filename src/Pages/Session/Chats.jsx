import { useState, useEffect, useRef } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaSearch, FaPaperPlane, FaArrowLeft } from 'react-icons/fa';
import { MessageCard } from '../../Components/Card';
import { getChats, sendMessage, changeStateMessage } from '../../Services/chatService';
import images from "../../JS/images";
import { messageListener } from "../../Components/MessageListener";

const ChatsUsers = () => {
    const [selectedChat, setSelectedChat] = useState(null);
    const [messageInput, setMessageInput] = useState("");
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [chats, setChats] = useState([]);
    const messagesEndRef = useRef(null);

    const lastMessage = messageListener();

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const response = await getChats();
                setChats(response);
            } catch (error) {
                console.error("Error al cargar los chats:", error);
            }
        };

        fetchChats();
    }, []);

    useEffect(() => {
        if (!lastMessage) return;

        setChats((prevChats) => {
            // Actualizar el chat correspondiente
            const updatedChats = prevChats.map((chat) => {
                if (chat.id === lastMessage.id_chat) {
                    return {
                        ...chat,
                        messages: [...chat.messages, lastMessage], // Agregar el mensaje al chat correspondiente
                    };
                }
                return chat;
            });

            // Mover el chat actualizado al inicio de la lista
            return updatedChats.sort((a, b) => {
                if (a.id === lastMessage.id_chat) return -1; // Mover el chat con el mensaje recibido al inicio
                if (b.id === lastMessage.id_chat) return 1;
                return 0;
            });
        });

        // Si el chat seleccionado es el mismo del mensaje recibido, actualizarlo también
        if (selectedChat && selectedChat.id === lastMessage.id_chat) {
            setSelectedChat((prevChat) => ({
                ...prevChat,
                messages: [...prevChat.messages, lastMessage],
            }));
        }
    }, [lastMessage]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [selectedChat?.messages]);

    // Marcar mensajes como leídos al entrar al chat
    useEffect(() => {
        if (selectedChat) {
            const unreadMessages = selectedChat.messages.filter(
                (message) => !message.message_status && message.id_user !== parseInt(localStorage.getItem("user_id"))
            );

            if (unreadMessages.length > 0) {
                changeStateMessage(selectedChat.id)
                    .then((response) => {
                        if (response.status === 200) {
                            // Actualizar el estado de los chats para marcar los mensajes como leídos
                            setChats((prevChats) =>
                                prevChats.map((chat) => {
                                    if (chat.id === selectedChat.id) {
                                        return {
                                            ...chat,
                                            messages: chat.messages.map((message) => ({
                                                ...message,
                                                message_status: true, // Marcar todos los mensajes como leídos
                                            })),
                                        };
                                    }
                                    return chat;
                                })
                            );
                        }
                    })
                    .catch((error) => {
                        console.error("Error al cambiar el estado de los mensajes:", error);
                    });
            }
        }
    }, [selectedChat]);

    const handleSelectChat = (chat) => {
        setSelectedChat(chat);
        setMessageInput("");
    };

    return (
        <Container fluid className="container-chat">
            <Row className="h-100">
                {(!selectedChat || !isMobile) && (
                    <Col xs={12} md={4} className="p-0 chat-sidebar">
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
                            {chats.map((chat) => {
                                const currentUserId = parseInt(localStorage.getItem("user_id"));
                                const otherUser = chat.user_one.id === currentUserId ? chat.user_two : chat.user_one;

                                const lastMessage = chat.messages.length > 0
                                    ? chat.messages[chat.messages.length - 1].message
                                    : "No hay mensajes";

                                const unreadMessages = chat.messages.filter(
                                    (message) => !message.message_status && message.id_user !== currentUserId
                                ).length;

                                return (
                                    <MessageCard
                                        key={chat.id}
                                        image={otherUser.profile?.image_url || "https://via.placeholder.com/150"}
                                        user={otherUser.user_name}
                                        message={lastMessage}
                                        notification={unreadMessages > 0 ? unreadMessages : null}
                                        onClick={() =>
                                            handleSelectChat({
                                                id: chat.id,
                                                name: otherUser.user_name,
                                                image: otherUser.profile?.image_url || "https://via.placeholder.com/150",
                                                messages: chat.messages
                                            })
                                        }
                                    />
                                );
                            })}
                        </div>
                    </Col>
                )}

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
                                        <FaArrowLeft />
                                    </button>
                                )}

                                <div className="p-3 border-bottom bg-white d-flex align-items-center">
                                    <img src={selectedChat.image} alt={selectedChat.name} className="rounded-circle me-2" style={{ width: '40px', height: '40px' }} />
                                    <strong>{selectedChat.name}</strong>
                                </div>

                                <div className="flex-grow-1 p-3 overflow-auto">
                                {selectedChat.messages.map((message, index) => {
                                    const isMine = message.id_user === parseInt(localStorage.getItem("user_id"));
                                    return (
                                        <div
                                            key={index}
                                            style={{
                                                display: 'flex',
                                                justifyContent: isMine ? 'flex-end' : 'flex-start',
                                                marginBottom: '10px'
                                            }}
                                        >
                                            <div
                                                style={{
                                                    backgroundColor: isMine ? '#DCF8C6' : '#F1F0F0',
                                                    color: 'black',
                                                    padding: '10px 15px',
                                                    borderRadius: '15px',
                                                    maxWidth: '60%',
                                                    wordWrap: 'break-word',
                                                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                                    position: 'relative'
                                                }}
                                            >
                                                {message.message}
                                                {isMine && (
                                                    <small
                                                        style={{
                                                            display: 'block',
                                                            marginTop: '5px',
                                                            fontSize: '12px',
                                                            color: '#888',
                                                            textAlign: 'right'
                                                        }}
                                                    >
                                                        {message.message_status ? 'Leído' : 'Enviado'}
                                                    </small>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                                <div className="p-3 border-top">
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Escribe un mensaje..."
                                            value={messageInput}
                                            onChange={(e) => setMessageInput(e.target.value)}
                                        />
                                        <button className="btn-enviar" type="button" onClick={() => {
                                            if (messageInput.trim()) {
                                                sendMessage(selectedChat.id, messageInput)
                                                    .then(() => {
                                                        setMessageInput("");
                                                    })
                                                    .catch((error) => {
                                                        console.error("Error al enviar el mensaje:", error);
                                                    });
                                            }
                                        }}>
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
    );
};

export default ChatsUsers;