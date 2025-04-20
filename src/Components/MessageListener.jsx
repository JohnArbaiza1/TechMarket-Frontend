import { useEffect, useState, useRef, useCallback } from "react";
import Echo from "../Services/laravel-echo.client";

export const messageListener = (onNewChat) => {
    const [messages, setMessages] = useState(null);
    const subscribedChannels = useRef(new Set()); // Persistente entre renders
    const isSubscribedToUserChannel = useRef(false); // Evitar múltiples suscripciones al canal del usuario

    // Suscribirse al canal del usuario para escuchar nuevos chats
    useEffect(() => {
        const userId = localStorage.getItem("user_id");
        if (!userId || isSubscribedToUserChannel.current) return;

        Echo.private(`user.${userId}`)
            .listen(".ChatCreated", (e) => {
                console.log("Nuevo chat creado:", e.chat);

                // Llamar a la función de callback para manejar el nuevo chat
                if (onNewChat) {
                    onNewChat(e.chat);
                }
            })
            .error((err) => console.error("Error al suscribirse al canal del usuario:", err));

        isSubscribedToUserChannel.current = true; // Marcar como suscrito
    }, [onNewChat]);

    // Memorizar la función `subscribeToChannel`
    const subscribeToChannel = useCallback((idChat) => {
        const channelName = `chat.${idChat}`;

        if (!subscribedChannels.current.has(channelName)) {
            Echo.private(channelName)
                .listen(".MessageSend", (e) => {
                    console.log("Mensaje recibido en canal nuevo:", e);
                    setMessages(e.message);
                })
                .subscribed(() => {
                    console.log(`Suscrito dinámicamente al nuevo canal: ${channelName}`);
                    subscribedChannels.current.add(channelName);
                })
                .error((err) => console.error(`Error suscribiendo al nuevo canal ${channelName}`, err));
        }
    }, []);

    return { messages, subscribeToChannel };
};