import React, { useEffect, useState } from 'react';
import echo from '../../Services/laravel-echo.client';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ChatPage = () => {
    const { user } = useParams();
    const [mensajes, setMensajes] = useState([]);
    const [nuevoMensaje, setNuevoMensaje] = useState('');

    // 🔹 Obtener token
    const token = localStorage.getItem('token');
    const currentUser = JSON.parse(localStorage.getItem('user_id'));

    // 🔹 Cargar mensajes anteriores
    useEffect(() => {
        const obtenerMensajes = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/api/messages/${user}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json'
                    }
                });
                setMensajes(res.data);
            } catch (error) {
                console.error('Error al cargar mensajes:', error);
            }
        };

        obtenerMensajes();
    }, [user]);

    // 🔹 Suscribirse al canal privado
    useEffect(() => {
        
        const idCanal = ordenarMayorMenor(user, currentUser); 
        const channelName = `chat.${idCanal}`;
        const canal = echo.private(channelName);
    
        canal.listen('MessageSend', (e) => {
            console.log('Mensaje recibido via WebSocket:', e); // Log para diferenciar
            // Solo añade si el mensaje no es propio (opcional, si no quieres duplicados si cambias broadcast)
            // if (e.message.id_user_one !== currentUser) {
               setMensajes(prev => [...prev, e.message]);
            // }
        });
    
        // Asegúrate de que la autorización esté completa antes de escuchar
         canal.subscribed(() => {
            console.log(`Suscrito correctamente al canal ${channelName}`);
        });
    
        canal.error((error) => {
            console.error(`Error de suscripción al canal ${channelName}:`, error);
        });
    
    
        return () => {
            console.log(`Dejando el canal ${channelName}`);
            echo.leave(channelName); // <-- CORREGIDO: Usa currentUser
        };
    }, [user]); // Depende

    // 🔹 Enviar mensaje
    const enviarMensaje = async () => {
        if (!nuevoMensaje.trim()) return;

        try {
            // Enviar el mensaje al backend
            const res = await axios.post(`http://localhost:8000/api/messages/${user}`, {
                message: nuevoMensaje,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json'
                }
            });

            // Agregar el nuevo mensaje al estado
            setMensajes(prev => [...prev, res.data]);

            // Limpiar el campo de mensaje
            setNuevoMensaje('');
        } catch (error) {
            console.error('Error al enviar el mensaje:', error);
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <h2>Chat en Tiempo Real</h2>
            <div style={{ border: '1px solid #ccc', height: 300, overflowY: 'scroll', padding: 10 }}>
                {mensajes.map((msg, index) => (
                    <div key={index}>
                        <strong>{msg.sender?.user_name ?? 'Yo'}:</strong> {msg.message}
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={nuevoMensaje}
                onChange={(e) => setNuevoMensaje(e.target.value)}
                placeholder="Escribe un mensaje..."
                style={{ width: '80%', marginTop: 10 }}
            />
            <button onClick={enviarMensaje} style={{ marginLeft: 10 }}>
                Enviar
            </button>
        </div>
    );
};
function ordenarMayorMenor(a, b) {
    let resultado;
    if (a > b) {
        resultado = a + "-" + b;
    } else {
        resultado = b + "-" + a;
    }
    return resultado;
}
export default ChatPage;
