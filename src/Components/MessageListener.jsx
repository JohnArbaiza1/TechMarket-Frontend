import { useEffect, useState, useRef } from "react";
import Echo from "../Services/laravel-echo.client";
import { getChatIds } from "../Services/chatService";

export const messageListener = () => {
    const [idChats, setIdChats] = useState([]);
    const [messages, setMessages] = useState(null);
    const subscribedChannels = useRef(new Set()); // Persistente entre renders

    // Obtener los IDs de los chats al cargar
    useEffect(() => {
        const fetchIdChats = async () => {
            try {
                const response = await getChatIds();
                setIdChats(response);
                console.log("IDs de chats:", response);
            } catch (error) {
                console.error("Error al obtener los IDs de chats:", error.message);
            }
        };

        fetchIdChats();
    }, []);

    // Suscribirse a los canales de chat
    useEffect(() => {
        if (idChats.length > 0) {
            idChats.forEach((idCanal) => {
                const channelName = `chat.${idCanal}`;

                // Verificar si ya estamos suscritos al canal
                if (subscribedChannels.current.has(channelName)) {
                    console.log(`Ya suscrito al canal ${channelName}, omitiendo...`);
                    return; // Saltar este canal
                }

                // Suscribirse al canal y agregarlo al Set
                Echo.private(channelName)
                    .listen(".MessageSend", (e) => {
                        console.log("Mensaje recibido via WebSocket:", e);
                        setMessages(e.message); // Actualizar el estado con el mensaje recibido
                    })
                    .subscribed(() => {
                        console.log(`Suscrito correctamente al canal ${channelName}`);
                        subscribedChannels.current.add(channelName); // Agregar al Set
                    })
                    .error((error) => {
                        console.error(`Error de suscripción al canal ${channelName}:`, error);
                    });
            });
        }
    }, [idChats]);

    return messages; // Retornar los mensajes recibidos
};