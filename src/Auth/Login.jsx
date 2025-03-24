import React, { useState } from "react";
import { useAuth } from "./AuthContext"; // Usamos el contexto para manejar el estado de autenticación
import CardProject from "../Components/Card";
import { Form } from 'react-bootstrap';
import '../Styles/login.css';
import Footer from "../Components/Footer";
import { Link } from 'react-router-dom';



const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth(); // Accedemos a la función login del contexto

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí va la lógica para verificar el login, con la API
        // Si el login es exitoso:
        login(); // Cambiamos el estado de autenticación a true
    };

    return (
        <>
            <div className="contenido">
                    <CardProject
                    title={"Te damos la bienvenida a TechMarket"}>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="formBasicUsername">
                                <br />
                                <Form.Control
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Usuario o correo"
                                className="custom-input">
                                </Form.Control>
                            </Form.Group>

                            <br />
                            <Form.Group>
                                <Form.Control 
                                    type="password" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    placeholder="Enter password"
                                    className="custom-input"
                                />
                            </Form.Group>
                            <span className="pregunta"><Link className="opciones-login">¿Ha olvidado su contraseña?</Link></span>
                        </Form>

                        
                            <button onClick={handleSubmit} className="btn-login" type="submit">Ingresar</button>
                            <span className="pregunta">¿No tienes cuenta? <Link className="opciones-login" to="/register">Regístrate.</Link></span>
        
                    </CardProject>
            </div>
            <Footer></Footer>
        </>
    );
};

export default Login;