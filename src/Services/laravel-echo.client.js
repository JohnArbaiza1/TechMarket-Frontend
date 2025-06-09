import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import axios from 'axios';

window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'reverb',  
    wsHost: window.location.hostname,
    key: '3ankxejwjtcjdmh4glk5',    
    wsPort: 8080,           
    wssPort: 8080,          
    forceTLS: false,        
    enabledTransports: ['ws', 'wss'], 
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