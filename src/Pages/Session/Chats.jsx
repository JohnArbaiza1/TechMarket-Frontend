import { useState, useEffect, useRef } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaSearch, FaPaperPlane, FaArrowLeft } from 'react-icons/fa';
import { MessageCard } from '../../Components/Card';
import { getChats, sendMessage, changeStateMessage, CreateChatMessage, getChatDetails } from '../../Services/chatService';
import images from "../../JS/images";
import { useLocation } from 'react-router-dom';
import { useChatContext } from '../../GlobalMessageListener'; 

const ChatsUsers = () => {
    const [selectedChat, setSelectedChat] = useState(null);
    const [messageInput, setMessageInput] = useState("");
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [chats, setChats] = useState([]);
    const messagesEndRef = useRef(null);
    const location = useLocation();
    const [chatInitializedFromNavigation, setChatInitializedFromNavigation] = useState(false);
    const processedMessageIds = useRef(new Set()); // Para evitar doble procesamiento de mensajes
    const processedChatIds = useRef(new Set()); // Para evitar doble procesamiento de chats nuevos


    //Obtener datos del contexto
    const { lastMessage, newChatInfo, subscribeToChatChannel } = useChatContext();


    // Información del usuario que viene de la navegación
    const userIdFromNavigation = location.state?.userId;
    const userNameFromNavigation = location.state?.userName;
    const userImageFromNavigation = location.state?.userImage;
    const publicationFromNavigation = location.state?.publication; 

    useEffect(() => {
        console.log("Estado de chats actualizado:", chats);
    }, [chats]);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);


    // Cargar los chats al iniciar la página
    useEffect(() => {
        const fetchChats = async () => {
            try {
                console.log("ChatsUsers: Fetching initial chats...");
                const response = await getChats();
                console.log("ChatsUsers: Initial chats received:", response);

                const sortedChats = response.sort((chatA, chatB) => {
                    const lastMessageTimeA = chatA.messages?.length > 0 ? new Date(chatA.messages[chatA.messages.length - 1].created_at).getTime() : 0;
                    const lastMessageTimeB = chatB.messages?.length > 0 ? new Date(chatB.messages[chatB.messages.length - 1].created_at).getTime() : 0;
                    return lastMessageTimeB - lastMessageTimeA;
                });
                

                setChats(sortedChats);

                console.log("ChatsUsers: Initial chats set and sorted.");
            } catch (error) {
                console.error("ChatsUsers: Error al cargar los chats:", error);
            }
        };

        fetchChats();
    }, []); 


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
                    id_publication: publicationFromNavigation?.id || null,
                    messages: [],
                };

                setSelectedChat({
                    id: newChat.id,
                name: (userNameFromNavigation +" ° "+ publicationFromNavigation.title) || "Nuevo Chat",
                    image: userImageFromNavigation || "https://via.placeholder.com/150",
                    messages: [],
                });
            }

         console.log("ChatsUsers: Initializing chat from navigation state.");
         setChatInitializedFromNavigation(true);
    }, [chats, userIdFromNavigation, chatInitializedFromNavigation]); 


    //para reaccionar a NUEVOS CHATS desde el contexto
    useEffect(() => {
        if (newChatInfo && newChatInfo.id && !processedChatIds.current.has(newChatInfo.id)) {
            console.log("ChatsUsers: Procesando newChatInfo desde contexto:", newChatInfo);
            processedChatIds.current.add(newChatInfo.id); // Marcar como procesado

            const processNewChat = async (chatData) => {
                 try {
                    // Verificar si ya existe en el estado local
                    const chatExists = chats.some((chat) => chat.id === chatData.id);
                    if (chatExists) {
                        console.warn(`ChatsUsers: Chat ${chatData.id} (del contexto) ya existe localmente.`);
                        return;
                    }
                    console.log(`ChatsUsers: Obteniendo detalles para nuevo chat ID: ${chatData.id}`);
                    const chatDetails = await getChatDetails(chatData.id);

                    if (!chatDetails || !chatDetails.id || !chatDetails.user_one || !chatDetails.user_two) {
                        console.warn("ChatsUsers: Detalles inválidos para nuevo chat:", chatDetails);
                        return;
                    }
                     console.log("ChatsUsers: Detalles obtenidos:", chatDetails);

                    // Agregar el nuevo chat al estado (al principio)
                    setChats((prevChats) => {
                        if (prevChats.some(c => c.id === chatDetails.id)) return prevChats;
                         console.log("ChatsUsers: Añadiendo nuevo chat a la lista.");
                        return [chatDetails, ...prevChats];
                    });

                 } catch (error) {
                     console.error("ChatsUsers: Error procesando nuevo chat desde contexto:", error);
                 } finally {
                 }
            };
            processNewChat(newChatInfo);
        }
    }, [newChatInfo, chats]); // Depende de newChatInfo y chats (para la verificación de existencia)

    //para reaccionar a NUEVOS MENSAJES desde el contexto
    useEffect(() => {
        // Usar el lastMessage del contexto
        if (lastMessage && lastMessage.id && !processedMessageIds.current.has(lastMessage.id)) {
             console.log("ChatsUsers: Procesando lastMessage desde contexto:", lastMessage);
             processedMessageIds.current.add(lastMessage.id); // Marcar como procesado

            setChats((prevChats) => {
                let chatToUpdate = null;
                const otherChats = prevChats.filter((chat) => {
                    // Comprobar si el chat_id del mensaje coincide
                    if (chat.id === lastMessage.id_chat) {
                        chatToUpdate = chat;
                        return false;
                    }
                    return true;
                });

                if (!chatToUpdate) {
                    console.warn(`ChatsUsers: Chat con ID ${lastMessage.id_chat} no encontrado para mensaje ${lastMessage.id}. Quizás es un chat nuevo aún no procesado?`);
                    
                     processedMessageIds.current.delete(lastMessage.id); // Permitir re-procesamiento si el chat aparece luego
                    return prevChats;
                }

                const messageExists = chatToUpdate.messages.some((message) => message.id === lastMessage.id);
                if (messageExists) {
                     console.warn(`ChatsUsers: Mensaje ${lastMessage.id} ya existe en chat ${chatToUpdate.id}.`);
                    return prevChats;
                }

                const updatedChat = {
                    ...chatToUpdate,
                    messages: [...chatToUpdate.messages, lastMessage],
                };
                 console.log(`ChatsUsers: Mensaje ${lastMessage.id} añadido y chat ${updatedChat.id} movido al principio.`);
                return [updatedChat, ...otherChats]; // Mover chat actualizado al principio
            });

            // Actualizar el chat seleccionado si coincide
            if (selectedChat && selectedChat.id === lastMessage.id_chat) {
                 console.log(`ChatsUsers: Actualizando mensajes del chat seleccionado ${selectedChat.id} con mensaje ${lastMessage.id}`);
                setSelectedChat((prevChat) => {
                    // Doble verificación aquí también por si acaso
                    const messageExists = prevChat.messages.some((message) => message.id === lastMessage.id);
                    if (messageExists) return prevChat;
                    return {
                        ...prevChat,
                        messages: [...prevChat.messages, lastMessage],
                    };
                });
            }
        }
         // Limpiar IDs antiguos del set para evitar que crezca indefinidamente
         if (processedMessageIds.current.size > 1000) {
             const oldIds = Array.from(processedMessageIds.current).slice(0, 500);
             oldIds.forEach(id => processedMessageIds.current.delete(id));
         }

    }, [lastMessage, selectedChat]); 


    // useEffect para scroll 
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [selectedChat?.messages]);

    const handleSendMessage = () => {
        if (messageInput.trim()) {
            if (!selectedChat?.id) {
                // Crear nuevo chat
                console.log("ChatsUsers: Creando nuevo chat y enviando primer mensaje...");
                CreateChatMessage(userIdFromNavigation, messageInput, publicationFromNavigation.id)
                    .then((response) => {
                        const newChat = {
                            id: response.id_chat,
                            user_one: { id: parseInt(localStorage.getItem("user_id")) },
                            user_two: { id: userIdFromNavigation, user_name: userNameFromNavigation, profile: { image_url: userImageFromNavigation } },
                            messages: [{ ...response, message: messageInput }],
                            publication:{ id: publicationFromNavigation.id, title: publicationFromNavigation.title },
                        };

                        // Agregar el nuevo chat a la lista de chats y moverlo al inicio
                        setChats((prevChats) => [newChat, ...prevChats]);

                        // Seleccionar automáticamente el nuevo chat
                        setSelectedChat({
                            id: response.id_chat,
                            name: userNameFromNavigation + (publicationFromNavigation? " ° " + publicationFromNavigation.title : ""),
                            image: userImageFromNavigation || "https://via.placeholder.com/150",
                            messages: [{ ...response, message: messageInput }],
                        });

                        // Suscribirse al canal del nuevo chat
                        subscribeToChatChannel(response.id_chat);
                        setMessageInput("");
                    })
                    .catch((error) => {
                        console.error("ChatsUsers: Error al crear/enviar primer mensaje:", error);
                    });
            } else {
                // Enviar mensaje a chat existente
                 console.log(`ChatsUsers: Enviando mensaje a chat existente ${selectedChat.id}...`);
                sendMessage(selectedChat.id, messageInput)
                    .then((response) => {
                         console.log("ChatsUsers: Mensaje enviado via API. Esperando que ChatContext lo reciba.");
                        setMessageInput("");
                    })
                    .catch((error) => {
                        console.error("ChatsUsers: Error al enviar mensaje:", error);
                    });
            }
        }
    };

     // handleSelectChat 
     const handleSelectChat = async (chat) => {
        console.log(`ChatsUsers: Seleccionando chat ${chat.id}`);
        const currentUserId = parseInt(localStorage.getItem("user_id"));
        const otherUser = chat.user_one.id === currentUserId ? chat.user_two : chat.user_one;

        const chatToSelect = {
            id: chat.id,
            name: otherUser.user_name + (chat.publication? " ° " + chat.publication.title : ""),
            image: otherUser.profile?.image_url || "https://via.placeholder.com/150",
            messages: chat.messages || [],
        };

         try {
             const hasUnread = chat.messages?.some(msg => !msg.message_status && msg.id_user !== currentUserId);
             if (chat.id && hasUnread) {
                 await changeStateMessage(chat.id);
                  console.log(`ChatsUsers: Llamado a changeStateMessage para ${chat.id}`);
                 setChats(prevChats => prevChats.map(c => { c.message_status = true; return c; }));
                 chatToSelect.messages = chatToSelect.messages.map(msg => { msg.message_status = true; return msg; });
             }
         } catch (error) {
            console.error("ChatsUsers: Error marcando mensajes como leídos:", error);
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
                                                user={otherUser.user_name + (chat.publication? " ° " + chat.publication.title : "")}
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