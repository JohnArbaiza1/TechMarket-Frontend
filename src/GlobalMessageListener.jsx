// src/contexts/ChatContext.js (o como lo hayas llamado, ej: GlobalMessageListener.js)
import React, { createContext, useState, useContext, useEffect, useRef, useCallback } from 'react';
import Echo from './Services/laravel-echo.client'; // Ajusta ruta
import { getChatIds } from './Services/chatService'; 
import { useAuth } from './Auth/AuthContext'; 
const ChatContext = createContext();

export const useChatContext = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
    const [lastMessage, setLastMessage] = useState(null);
    const [newChatInfo, setNewChatInfo] = useState(null);
    const subscribedChannels = useRef(new Set()); // Almacena nombres de canales de chat: "chat.123"
    const userChannelName = useRef(null); // Almacena nombre del canal de usuario: "user.456"

    // +++ AÑADIR: Consumir el contexto de autenticación +++
    const { isAuth } = useAuth();

    // Función interna para desuscribirse de todos los canales conocidos
    const unsubscribeAll = useCallback(() => {
        // Desuscribirse del canal de usuario si existe
        if (userChannelName.current) {
            //console.log(`ChatContext: Dejando canal de usuario ${userChannelName.current}`);
            Echo.leave(userChannelName.current);
            userChannelName.current = null; // Resetear
        }
        // Desuscribirse de todos los canales de chat
        if (subscribedChannels.current.size > 0) {
            //console.log("ChatContext: Dejando canales de chat:", Array.from(subscribedChannels.current));
            subscribedChannels.current.forEach(channelName => {
                Echo.leave(channelName);
            });
            subscribedChannels.current.clear(); // Limpiar el set
        }
    }, []); // No tiene dependencias externas

    // Función para suscribirse a un canal de chat específico
    const subscribeToChatChannel = useCallback((idChat) => {
        if (!idChat) {
            console.warn("ChatContext: Intento de suscripción a chat con ID inválido:", idChat);
            return;
        }
        const channelName = `chat.${idChat}`;

        if (!subscribedChannels.current.has(channelName)) {
             //console.log(`ChatContext: Intentando suscribir a ${channelName}`);
            Echo.private(channelName)
                .listen(".MessageSend", (e) => {
                    //console.log(`ChatContext [${channelName}]: Mensaje recibido:`, e.message);
                    setLastMessage({ ...e.message, receivedAt: Date.now() });
                    
                })
                .subscribed(() => {
                    //console.log(`ChatContext: Suscrito exitosamente a ${channelName}`);
                    subscribedChannels.current.add(channelName); // Añadir al set al suscribirse
                })
                .error((err) => console.error(`ChatContext: Error en ${channelName}`, err));
        } else {
            // console.log(`ChatContext: Ya suscrito a ${channelName}`);
        }
    }, []); // Sin dependencias, definición estable

    // Efecto para manejar la suscripción/desuscripción general basada en isAuth
    useEffect(() => {
        if (isAuth) {
            // --- Lógica de Suscripción ---
            const userId = localStorage.getItem("user_id");
            if (!userId) {
                console.error("ChatContext: Autenticado pero no se encontró user_id en localStorage.");
                return; // No podemos suscribir sin ID
            }

            // 1. Suscribirse al canal del usuario
            const currentUserChannel = `user.${userId}`;
            if (!userChannelName.current) { // Solo si no estamos ya suscritos
                 //console.log(`ChatContext: Intentando suscribir al canal de usuario ${currentUserChannel}`);
                Echo.private(currentUserChannel)
                    .listen(".ChatCreated", (e) => {
                        //console.log(`ChatContext [${currentUserChannel}]: Nuevo chat creado:`, e.chat);
                        setNewChatInfo({ ...e.chat, receivedAt: Date.now() });
                        subscribeToChatChannel(e.chat.id); // Suscribirse al nuevo chat
                    })
                     .subscribed(() => {
                        // console.log(`ChatContext: Suscrito exitosamente a ${currentUserChannel}`);
                         userChannelName.current = currentUserChannel; // Guardar nombre del canal suscrito
                     })
                    .error((err) => console.error(`ChatContext: Error en ${currentUserChannel}`, err));
            }

            // 2. Suscribirse a los canales de chats existentes
            const fetchAndSubscribe = async () => {
                // Solo obtener y suscribir si el set está vacío (primera vez en esta sesión auth)
                 if (subscribedChannels.current.size === 0) {
                    try {
                        //console.log("ChatContext: Obteniendo IDs de chats existentes...");
                        const chatIds = await getChatIds(); // Asume que usa el ID correcto implícitamente
                        //console.log("ChatContext: IDs obtenidos:", chatIds);
                        chatIds.forEach(id => subscribeToChatChannel(id));
                    } catch (error) {
                        console.error("ChatContext: Error obteniendo/suscribiendo a chats existentes", error);
                    }
                } else {
                     //console.log("ChatContext: Ya suscrito a los chats existentes previamente.");
                }
            };
            fetchAndSubscribe();

        } else {
            // --- Lógica de Desuscripción ---
            //console.log("ChatContext: isAuth es false. Desuscribiendo de todos los canales...");
            unsubscribeAll();
        }

        // La función de cleanup de este efecto principal también llama a unsubscribeAll
        // para manejar el caso de que el ChatProvider se desmonte por completo.
        return () => {
           // console.log("ChatContext: Cleanup del efecto principal (isAuth cambió o desmontaje). Desuscribiendo...");
            unsubscribeAll();
        };

    // Dependencias: isAuth para reaccionar a login/logout
    // y las funciones de useCallback para asegurar que son estables.
    }, [isAuth, subscribeToChatChannel, unsubscribeAll]);


    // El valor del contexto (sin cambios)
    const value = {
        lastMessage,
        newChatInfo,
        subscribeToChatChannel,
    };

    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};