import Footer from '../../Components/Footer';

const TerminosCondicions = () =>{
    return(
        <>
            <div className="container mt-4">
                <div className="row">
                    <div className="col">
                        <h2 className="title text-center"> Términos y Condiciones de Uso</h2>

                        <p className='texto-info'>Bienvenido(a) a TechMarket. Al acceder y utilizar nuestros servicios, aceptas cumplir con los siguientes Términos y Condiciones. Te recomendamos leerlos detenidamente.</p>

                        <h2 className="title" style={{fontSize:'20px'}}> 1. Aceptación de los Términos</h2>
                        <p className='texto-info'>
                            Al registrarte o utilizar esta plataforma, declaras que has leído, entendido y aceptado estos Términos y Condiciones.
                            Si no estás de acuerdo con alguno de ellos, por favor no utilices nuestros servicios.
                        </p>

                        <h2 className="title" style={{fontSize:'20px'}}>2. Descripción del Servicio</h2>
                        <p className='texto-info'>
                            TechMarket ofrece un espacio digital para conectar empresas y emprendedores con profesionales del sector tecnológico. 
                            A través de un modelo de suscripción, los usuarios pueden acceder a proyectos, publicar ofertas, y participar en oportunidades
                            de desarrollo profesional.
                        </p>

                        <h2 className="title" style={{fontSize:'20px'}}>3. Registro de Usuario</h2>
                        <p className='texto-info'>
                            Para acceder a ciertas funcionalidades, deberás registrarte y proporcionar información veraz y actualizada.
                            Es tu responsabilidad mantener la confidencialidad de tus credenciales y notificar cualquier uso no autorizado.
                        </p>

                        <h2 className="title" style={{fontSize:'20px'}}>4. Uso Aceptable</h2>
                        <p className='texto-info'>
                        Te comprometes a utilizar la plataforma de manera legal, ética y conforme a las buenas prácticas. Está prohibido:
                            <br />
                            • Proporcionar información falsa.
                            <br />
                            • Utilizar la plataforma para actividades fraudulentas o no autorizadas.
                            <br />
                            • Compartir contenido ofensivo, discriminatorio o que viole derechos de terceros.
                        </p>

                        <h2 className="title" style={{fontSize:'20px'}}>5. Suscripciones y Pagos</h2>
                        <p className='texto-info'>
                            Los servicios se ofrecen bajo distintos planes de suscripción. Al suscribirte, aceptas los términos de pago
                            correspondientes. Las tarifas están sujetas a cambios con previo aviso.
                        </p>

                        <h2 className="title" style={{fontSize:'20px'}}>6. Responsabilidades y Limitaciones</h2>
                        <p className='texto-info'>
                            TechMarket no garantiza que el uso del servicio sea ininterrumpido o libre de errores. No nos
                            responsabilizamos por acuerdos o relaciones comerciales entre usuarios surgidas fuera del alcance de la
                            plataforma.
                        </p>

                        <h2 className="title" style={{fontSize:'20px'}}>7. Cancelación y Terminación</h2>
                        <p className='texto-info'>
                            Los usuarios pueden cancelar su cuenta en cualquier momento. La plataforma se reserva el derecho de
                            suspender o cancelar cuentas que violen estos términos.
                        </p>

                        <h2 className="title" style={{fontSize:'20px'}}>8. Cambios en los Términos</h2>
                        <p className='texto-info'>
                            Nos reservamos el derecho de modificar estos Términos en cualquier momento. Te notificaremos con
                            antelación sobre cambios importantes.
                        </p>

                        <h2 className="title" style={{fontSize:'20px'}}>9. Contacto</h2>
                        <p className='texto-info'>
                            Para cualquier duda o solicitud relacionada con estos términos, puedes contactarnos por medio del chat integrado
                            en la plataforma
                        </p>

                    </div>
                </div>
            </div>
            <Footer></Footer>
        </>
    );
}

export default TerminosCondicions;