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
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const { register } = useAuth(); // Usamos la función de registro del contexto
    const navigate = useNavigate(); // Usamos useNavigate para redirigir después del registro
    // definimos dos estados para poder controlar la visibilidad de las contraseñas
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    const handleSubmit = async (e) => {
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

        try{
            await register(username, email, password);

            // Si el registro es exitoso, mostramos el mensaje de éxito
            setSuccessMessage('Usuario registrado exitosamente.');
            setErrorMessage('');

            // Redirigimos a la página de login depues de unos segundos
            setTimeout(() => {
                navigate('/login');
            }, 1000);

        }catch(e){
            // Si hay un error, mostramos el mensaje de error
            setErrorMessage(e || 'Error al registrar el usuario.');
            setSuccessMessage('');
        }
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
                            <div className="password-input-container">
                                <Form.Control
                                    type={showPassword ? "text" : "password"} // Cambia el tipo del input dependiendo de showPassword
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Contraseña"
                                    className="custom-input"
                                />
                                <span
                                    className="toggle-password"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} />
                                </span>
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formConfirmPassword">
                            <div className="password-input-container">
                                <Form.Control
                                    type={showConfirmPassword ? "text" : "password"} // Cambia el tipo del input dependiendo de showConfirmPassword
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirmar contraseña"
                                    className="custom-input"
                                />
                                <span
                                    className="toggle-password"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`} />
                                </span>
                            </div>
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