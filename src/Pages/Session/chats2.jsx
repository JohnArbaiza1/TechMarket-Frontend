import { useState, useEffect, useRef } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaSearch, FaPaperPlane, FaArrowLeft } from 'react-icons/fa';
import { MessageCard } from '../../Components/Card';
import { getChats, sendMessage, changeStateMessage, CreateChatMessage, getChatDetails } from '../../Services/chatService';
import images from "../../JS/images";
import { messageListener } from "../../Components/MessageListener";
import { useLocation } from 'react-router-dom';

const ChatsUsers = () => {
    const [selectedChat, setSelectedChat] = useState(null);
    const [messageInput, setMessageInput] = useState("");
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [chats, setChats] = useState([]);
    const messagesEndRef = useRef(null);
    const location = useLocation();
    const [chatInitializedFromNavigation, setChatInitializedFromNavigation] = useState(false);

    // Información del usuario que viene de la navegación desde el componente de UserCard
    const userIdFromNavigation = location.state?.userId;
    const userNameFromNavigation = location.state?.userName;
    const userImageFromNavigation = location.state?.userImage;

    // Manejar nuevos chats creados
    const handleNewChat = async (newChat) => {
        try {
            // Verificar si el chat ya existe en el estado
            setChats((prevChats) => {
                const chatExists = prevChats.some((chat) => chat.id === newChat.id);
                if (chatExists) {
                    console.warn(`El chat con ID ${newChat.id} ya existe. No se agregará de nuevo.`);
                    return prevChats; // No agregar el chat si ya existe
                }
    
                return prevChats; // Dejar que el flujo continúe
            });
    
            // Obtener los detalles completos del chat desde el backend
            const chatDetails = await getChatDetails(newChat.id);
    
            // Validar que el chat tenga la estructura esperada
            if (!chatDetails || !chatDetails.id || !chatDetails.user_one || !chatDetails.user_two) {
                console.warn("Detalles del chat inválidos:", chatDetails);
                return; // Ignorar chats inválidos
            }
    
            // Agregar el nuevo chat al estado
            setChats((prevChats) => {
                const chatExists = prevChats.some((chat) => chat.id === chatDetails.id);
                if (chatExists) {
                    console.warn(`El chat con ID ${chatDetails.id} ya existe después de obtener detalles.`);
                    return prevChats; // No agregar el chat si ya existe
                }
    
                return [chatDetails, ...prevChats];
            });
    
            // Suscribirse al canal del nuevo chat
            subscribeToChannel(chatDetails.id);
        } catch (error) {
            console.error("Error al manejar el nuevo chat:", error);
        }
    };
    useEffect(() => {
        console.log("Estado de chats actualizado:", chats);
    }, [chats]);

    // Extraer `messages` y `subscribeToChannel` del hook `messageListener`
    const { messages: lastMessage, subscribeToChannel } = messageListener(handleNewChat);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    

    // Cargar los chats al iniciar la página
    useEffect(() => {
        const fetchChats = async () => {
            try {
                const response = await getChats();
    
                // --- MODIFICACIÓN INICIO: Ordenar chats iniciales ---
                const sortedChats = response.sort((chatA, chatB) => {
                    // Obtener la fecha del último mensaje, si existe
                    const lastMessageTimeA = chatA.messages?.length > 0
                        ? new Date(chatA.messages[chatA.messages.length - 1].created_at).getTime()
                        : 0; // Chats sin mensajes van al final o principio, según prefieras (aquí al final)
                    const lastMessageTimeB = chatB.messages?.length > 0
                        ? new Date(chatB.messages[chatB.messages.length - 1].created_at).getTime()
                        : 0;
    
                    // Ordenar descendente (más reciente primero)
                    return lastMessageTimeB - lastMessageTimeA;
                });
                // --- MODIFICACIÓN FIN ---
    
                setChats(sortedChats); // Usar la lista ordenada
    
                // Suscribirse dinámicamente a los canales de los chats cargados
                sortedChats.forEach((chat) => { // Usar sortedChats aquí también
                    subscribeToChannel(chat.id);
                });
            } catch (error) {
                console.error("Error al cargar los chats:", error);
            }
        };
    
        fetchChats();
    }, [subscribeToChannel]);

    // Crear un nuevo chat si no existe uno ya creado
    useEffect(() => {
        if (!userIdFromNavigation || chats.length === 0 || chatInitializedFromNavigation) return;

        const currentUserId = parseInt(localStorage.getItem("user_id"));

        const existingChat = chats.find(chat =>
            (chat.user_one.id === currentUserId && chat.user_two.id === userIdFromNavigation) ||
            (chat.user_two.id === currentUserId && chat.user_one.id === userIdFromNavigation)
        );

        if (existingChat) {
            const otherUser = existingChat.user_one.id === currentUserId
                ? existingChat.user_two
                : existingChat.user_one;

            setSelectedChat({
                id: existingChat.id,
                name: otherUser.user_name,
                image: otherUser.profile?.image_url || "https://via.placeholder.com/150",
                messages: existingChat.messages,
            });
        } else {
            const newChat = {
                id: null,
                user_one: { id: currentUserId },
                user_two: { id: userIdFromNavigation },
                messages: [],
            };

            setSelectedChat({
                id: newChat.id,
                name: userNameFromNavigation || "Nuevo Chat",
                image: userImageFromNavigation || "https://via.placeholder.com/150",
                messages: [],
            });
        }

        setChatInitializedFromNavigation(true); // Para que no se repita
    }, [chats, userIdFromNavigation, chatInitializedFromNavigation]);

    useEffect(() => {
        if (!lastMessage) return;
    
        setChats((prevChats) => {
            let chatToUpdate = null;
            // Filtrar el chat que necesita actualizarse y el resto
            const otherChats = prevChats.filter((chat) => {
                if (chat.id === lastMessage.id_chat) {
                    chatToUpdate = chat;
                    return false; // No incluirlo en otherChats
                }
                return true;
            });
    
            // Si no se encontró el chat (podría ser un chat nuevo manejado por handleNewChat), no hacer nada aquí
            if (!chatToUpdate) {
                console.warn(`Chat con ID ${lastMessage.id_chat} no encontrado para actualizar con mensaje.`);
                 // Opcionalmente, podrías buscar y agregarlo si handleNewChat falló, pero debería ser manejado allí.
                return prevChats;
            }
    
            // Verificar si el mensaje ya existe en el chat encontrado
            const messageExists = chatToUpdate.messages.some((message) => message.id === lastMessage.id);
            if (messageExists) {
                console.warn(`El mensaje con ID ${lastMessage.id} ya existe en el chat ${chatToUpdate.id}. No se reordenará ni agregará.`);
                return prevChats; // No hacer cambios si el mensaje ya está
            }
    
            // Crear el chat actualizado con el nuevo mensaje
            const updatedChat = {
                ...chatToUpdate,
                messages: [...chatToUpdate.messages, lastMessage],
            };
    
            // --- MODIFICACIÓN: Devolver el chat actualizado al PRINCIPIO de la lista ---
            return [updatedChat, ...otherChats];
        });
    
        // Actualizar el chat seleccionado si es el que recibió el mensaje
        if (selectedChat && selectedChat.id === lastMessage.id_chat) {
            setSelectedChat((prevChat) => {
                const messageExists = prevChat.messages.some((message) => message.id === lastMessage.id);
                if (messageExists) {
                     console.warn(`El mensaje con ID ${lastMessage.id} ya existe en el chat seleccionado (actualización interna).`);
                    return prevChat;
                }
                return {
                    ...prevChat,
                    messages: [...prevChat.messages, lastMessage],
                };
            });
        }
    }, [lastMessage, selectedChat]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [selectedChat?.messages]);

    const handleSendMessage = () => {
        if (messageInput.trim()) {
            if (!selectedChat?.id) {
                // Crear un nuevo chat y enviar el primer mensaje
                CreateChatMessage(userIdFromNavigation, messageInput, null)
                    .then((response) => {
                        const newChat = {
                            id: response.id_chat,
                            user_one: { id: parseInt(localStorage.getItem("user_id")) },
                            user_two: { id: userIdFromNavigation, user_name: userNameFromNavigation, profile: { image_url: userImageFromNavigation } },
                            messages: [{ ...response, message: messageInput }],
                        };

                        // Agregar el nuevo chat a la lista de chats y moverlo al inicio
                        setChats((prevChats) => [newChat, ...prevChats]);

                        // Seleccionar automáticamente el nuevo chat
                        setSelectedChat({
                            id: response.id_chat,
                            name: userNameFromNavigation,
                            image: userImageFromNavigation || "https://via.placeholder.com/150",
                            messages: [{ ...response, message: messageInput }],
                        });

                        // Suscribirse al canal del nuevo chat
                        subscribeToChannel(response.id_chat);

                        setMessageInput("");
                    })
                    .catch((error) => {
                        console.error("Error al enviar el mensaje:", error);
                    });
            } else {
                // Enviar un mensaje en un chat existente
                sendMessage(selectedChat.id, messageInput)
                    .then((response) => {
                        const newMessage = {
                            id: response.id_message,
                            id_chat: selectedChat.id,
                            id_user: parseInt(localStorage.getItem("user_id")),
                            message: messageInput,
                            message_status: false,
                            created_at: new Date().toISOString(),
                        };

                       /* // Actualizar el estado de selectedChat
                        setSelectedChat((prevChat) => ({
                            ...prevChat,
                            messages: [...prevChat.messages, newMessage],
                        }));

                        // Actualizar el estado de chats
                        setChats((prevChats) =>
                            prevChats.map((chat) =>
                                chat.id === selectedChat.id
                                    ? {
                                          ...chat,
                                          messages: [...chat.messages, newMessage],
                                      }
                                    : chat
                            )
                        );*/

                        setMessageInput("");
                    })
                    .catch((error) => {
                        console.error("Error al enviar el mensaje:", error);
                    });
            }
        }
    };
    const handleSelectChat = async (chat) => {
        const currentUserId = parseInt(localStorage.getItem("user_id"));
        const otherUser = chat.user_one.id === currentUserId ? chat.user_two : chat.user_one;
    
        const chatToSelect = {
            id: chat.id,
            name: otherUser.user_name,
            image: otherUser.profile?.image_url || "https://via.placeholder.com/150",
            messages: chat.messages || [],
        };
    
        try {
        
            const hasUnread = chat.messages?.some(msg => !msg.message_status && msg.id_user !== currentUserId);
            if (chat.id && hasUnread) {
                 await changeStateMessage(chat.id);
    
                 setChats(prevChats => prevChats.map(c => {
                     if (c.id === chat.id) {
                         return {
                             ...c,
                             messages: c.messages.map(msg => {
                                 if (!msg.message_status && msg.id_user !== currentUserId) {
                                     return { ...msg, message_status: true };
                                 }
                                 return msg;
                             })
                         };
                     }
                     return c;
                 }));
    
                  chatToSelect.messages = chatToSelect.messages.map(msg => {
                     if (!msg.message_status && msg.id_user !== currentUserId) {
                         return { ...msg, message_status: true };
                     }
                     return msg;
                 });
    
            }
        } catch (error) {
            console.error("Error al marcar mensajes como leídos:", error);
        }
    
        setSelectedChat(chatToSelect);
    };
    

    return (
        <Container fluid className="container-chat">
            <Row className="h-100">
                {(!selectedChat || !isMobile) && (
                    <Col xs={12} md={4} className="p-0 chat-sidebar">
                        <div className="p-3 border-bottom bg-white">
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
                            {chats.map((chat, index) => {
                                // Validar que el chat y sus propiedades estén definidos
                                if (!chat || !chat.id || !chat.user_one || !chat.user_two) {
                                    console.warn(`Chat inválido en el índice ${index}:`, chat);
                                    return null; // Ignorar chats inválidos
                                }

                                const currentUserId = parseInt(localStorage.getItem("user_id"));
                                const otherUser = chat.user_one.id === currentUserId ? chat.user_two : chat.user_one;

                                // Validar que `otherUser` esté definido
                                if (!otherUser) {
                                    console.warn(`Usuario no encontrado en el chat:`, chat);
                                    return null; // Ignorar chats sin usuario válido
                                }

                                const lastMessage = chat.messages?.length > 0
                                    ? chat.messages[chat.messages.length - 1].message
                                    : "No hay mensajes";

                                const unreadMessages = chat.messages?.filter(
                                    (message) => !message.message_status && message.id_user !== currentUserId
                                ).length || 0;

                                return (
                                    <MessageCard
                                        key={chat.id} // Asegúrate de que `chat.id` sea único
                                        image={otherUser.profile?.image_url || "https://via.placeholder.com/150"}
                                        user={otherUser.user_name}
                                        message={lastMessage}
                                        notification={unreadMessages > 0 ? unreadMessages : null}
                                        onClick={() =>
                                            handleSelectChat(chat)
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
                                <img src={images["img-4"]} alt="Imagen bienvenida" className="img-chat mb-4" />
                                <br />
                                <h3 className="text-muted fs-5">¿Listo para hablar? Elige un contacto para empezar.</h3>
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
                                    <img
                                        src={selectedChat.image}
                                        alt={selectedChat.name}
                                        className="rounded-circle me-2"
                                        style={{ width: "40px", height: "40px" }}
                                    />
                                    <strong>{selectedChat.name}</strong>
                                </div>

                                <div className="flex-grow-1 p-3 overflow-auto">
                                    {selectedChat.messages.map((message, index) => {
                                        const isMine = message.id_user === parseInt(localStorage.getItem("user_id"));
                                        return (
                                            <div
                                                key={index}
                                                style={{
                                                    display: "flex",
                                                    justifyContent: isMine ? "flex-end" : "flex-start",
                                                    marginBottom: "10px",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        backgroundColor: isMine ? "#DCF8C6" : "#F1F0F0",
                                                        color: "black",
                                                        padding: "10px 15px",
                                                        borderRadius: "15px",
                                                        maxWidth: "60%",
                                                        wordWrap: "break-word",
                                                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                                                    }}
                                                >
                                                    {message.message}
                                                    {isMine && (
                                                        <small
                                                            style={{
                                                                display: "block",
                                                                marginTop: "5px",
                                                                fontSize: "12px",
                                                                color: "#888",
                                                                textAlign: "right",
                                                            }}
                                                        >
                                                            {message.message_status ? "Leído" : "Enviado"}
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
                                        <button className="btn-enviar" type="button" onClick={handleSendMessage}>
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