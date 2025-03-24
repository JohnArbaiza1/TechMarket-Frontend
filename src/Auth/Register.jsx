import CardProject from "../Components/Card"
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Footer from "../Components/Footer";
import '../Styles/login.css';  // Reutilizamos el CSS de login
import { Form } from 'react-bootstrap';

const Register = () =>{

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { register } = useAuth(); // Usamos la función de registro del contexto
    const navigate = useNavigate(); // Usamos useNavigate para redirigir después del registro


    const handleSubmit = (e) => {
        e.preventDefault();

        //Pequeña Validación para confirmar la contraseña y que no hayan vampos vacios
        if (username === "" || email === "" || password === "" || confirmPassword === "") {
            alert("Todos los campos son obligatorios.");
            return;
        }
        
        if (password !== confirmPassword) {
            alert("Las contraseñas no coinciden.");
            return;
        }
        

        // Llamamos a la función de registro con los datos que se piden ingresar
        register(username, email, password);

        //Se encarga de redirigir al login después del registro
        navigate('/login'); 
    };


    return(
        <>
        <div className="contenido">
            <CardProject title={"Regístrate en TechMarket"}>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formBasicUsername">
                        <br />
                        <Form.Control
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Nombre de usuario"
                            className="custom-input"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Control
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Correo electrónico"
                            className="custom-input"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Control
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Contraseña"
                            className="custom-input"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formConfirmPassword">
                        <Form.Control
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirmar contraseña"
                            className="custom-input"
                        />
                    </Form.Group>
                </Form>

                <button onClick={handleSubmit} className="btn-login" type="submit">Registrarse</button>
                <span className="pregunta">¿Ya tienes cuenta? <Link className="opciones-login" to="/login">Inicia sesión</Link></span>
            </CardProject>
        </div>
        <Footer />
    </>
    )

}

export default Register;