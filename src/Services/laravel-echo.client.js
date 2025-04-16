import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import axios from 'axios';

window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'reverb',  // Esto debería estar correcto si estás usando Reverb como broadcaster
    wsHost: "localhost",
    key: 'h3sqchfut0tiu8cexujr',    // Dirección de tu servidor WebSocket (si está en local)
    wsPort: 8080,           // Puerto donde el WebSocket está corriendo
    wssPort: 8080,          // Puerto seguro (en caso de que estés usando WSS)
    forceTLS: false,        // En producción puede ser true si usas HTTPS
    enabledTransports: ['ws', 'wss'], // Transportes habilitados
    authorizer: (channel, options) => {
        return {
            authorize: (socketId, callback) => {
                axios.post('http://localhost:8000/api/broadcasting/auth', {
                    socket_id: socketId,
                    channel_name: channel.name
                }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                })
                .then(response => {
                    callback(false, response.data); // Enviar la respuesta si la autorización fue exitosa
                })
                .catch(error => {
                    callback(true, error); // Enviar el error si la autorización falla
                });
            }
        };
    },
});

window.Echo.connector.pusher.connection.bind('connected', function() {
    console.log('Conectado a Reverb/Pusher');
});

window.Echo.connector.pusher.connection.bind('disconnected', function() {
    console.log('Desconectado de Reverb/Pusher');
});


export default window.Echo; // ✅ en lugar de return