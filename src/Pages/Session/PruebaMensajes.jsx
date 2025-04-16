import React, { useEffect, useState, useRef } from 'react';
import Echo from '../../Services/laravel-echo.client';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ChatPage = () => {
    const { user } = useParams();
    const [mensajes, setMensajes] = useState([]);
    const [nuevoMensaje, setNuevoMensaje] = useState('');
    const [nombreReceptor, setNombreReceptor] = useState('');

    const mensajesRef = useRef(null);

    //Función para hacer scroll al fondo
    const scrollToBottom = () => {
        const chatContainer = mensajesRef.current;
        if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    };

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
                const userReceiver = await axios.get(`http://localhost:8000/api/user/${user}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json'
                    }
                });
                setNombreReceptor(userReceiver.data.user_name || 'Desconocido');
                setMensajes(res.data);

                const otro = res.data.find(msg => msg.sender?.id !== currentUser);
                if (otro) {
                    setNombreReceptor(otro.sender?.user_name || 'Desconocido');
                }
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
    
        Echo.private(channelName).listen('.MessageSend', (e) => {
            console.log('Mensaje recibido via WebSocket:', e); 
            if (e.message.id_user_one !== currentUser) {
                scrollToBottom();
                setMensajes(prev => [...prev, e.message]);
            }
        });
        console.log(window.Echo.connector.pusher.channels);
        window.Echo.connector.pusher.bind_global((eventName, data) => {
            console.log('🌐 Evento recibido:', eventName, data);
        });
        // Asegúrate de que la autorización esté completa antes de escuchar
        Echo.private(channelName).subscribed(() => {
            console.log(`Suscrito correctamente al canal ${channelName}`);
        });
    
        Echo.private(channelName).error((error) => {
            console.error(`Error de suscripción al canal ${channelName}:`, error);
        });
    
    
        return () => {
            console.log(`Dejando el canal ${channelName}`);
            Echo.leave(channelName); // <-- CORREGIDO: Usa currentUser
        };
        
    }, [currentUser]); // Depende

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
            <h2>Chat en Tiempo Real con <span style={{ color: '#007bff' }}>{nombreReceptor || '...'}</span></h2>
            
            <div
                ref={mensajesRef} // 🟡 Añadimos la referencia aquí
                style={{
                    border: '1px solid #ccc',
                    height: 300,
                    overflowY: 'scroll',
                    padding: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                }}
            >
                {mensajes.map((msg, index) => {
                    const esMio = msg.id_user_one === currentUser;
                    return (
                        <div
                            key={index}
                            style={{
                                display: 'flex',
                                justifyContent: esMio ? 'flex-end' : 'flex-start'
                            }}
                        >
                            <div
                                style={{
                                    backgroundColor: esMio ? '#DCF8C6' : '#F1F0F0',
                                    color: 'black',
                                    padding: '10px 15px',
                                    borderRadius: '15px',
                                    maxWidth: '60%',
                                    wordWrap: 'break-word',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                }}
                            >
                                {msg.message}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div style={{ marginTop: 10 }}>
                <input
                    type="text"
                    value={nuevoMensaje}
                    onChange={(e) => setNuevoMensaje(e.target.value)}
                    placeholder="Escribe un mensaje..."
                    style={{ width: '70%', padding: '10px', fontSize: 16 }}
                />
                <button onClick={enviarMensaje} style={{ marginLeft: 10, padding: '10px 20px', fontSize: 16 }}>
                    Enviar
                </button>
            </div>
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
