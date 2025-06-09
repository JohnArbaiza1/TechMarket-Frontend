//Importamos los componentes a usar
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import images from "../JS/images";
import { motion } from 'framer-motion';
import '../Styles/principal.css'

const Principal = () =>{
    return(
        <>
            <div className="container mt-4 inicio">
                <h3 className="title text-center">El futuro de la tecnología empieza aquí</h3>
                <div className="container text-center">
                <img
                    src={images["img-6"]}
                    alt="Imagen bienvenida"
                    className="img-banner img-fluid d-block mx-auto"
                />
                </div>

                <p className="texto-info text-center">
                Únete a una comunidad donde los expertos tecnológicos encuentran inspiración, colaboración y crecimiento. <br />
                Aquí, cada conexión es una oportunidad para aprender, avanzar y construir el futuro juntos.
                </p>
            </div>

            <div className="container mt-4">
                <div className="row">
                    <div className="col">
                        <motion.h3
                            className="title"
                            initial={{ x: '100%' }}  
                            animate={{ x: 0 }}  
                            transition={{
                                type: 'spring',
                                stiffness: 50,
                                delay: 0.20
                            }}
                        >
                            TechMarket: Conectando <br /> con los profesionales de la tecnología
                        </motion.h3>


                        <motion.p
                                className="texto-info"
                                initial={{ x: '100%' }}  
                                animate={{ x: 0 }}  
                                transition={{
                                    type: 'spring',
                                    stiffness: 50,
                                    delay: 0.25
                                }}
                            >
                                TechMarket una plataforma diseñada para ayudar a empresas y emprendedores a encontrar rápidamente el talento adecuado.
                                Ofrecemos oportunidades para desarrolladores y otros profesionales, permitiéndoles ganar experiencia y mejorar sus
                                habilidades a través de proyectos desafiantes y flexibles.
                            </motion.p>
                        </div>

                        <div className="col">
                        <motion.img
                            src={images['img_principal']}  
                            alt="IMG página principal"
                            className="img-fluid"
                            initial={{ x: '100%' }}  
                            animate={{ x: 0 }}  
                            transition={{
                                type: 'spring',
                                stiffness: 50,
                                delay: 0.30  // Retraso antes de iniciar la animación
                            }}
                        />
                    </div>
                </div>

                <div>
                    <p className="texto-info2">
                    Estás comenzando y quieres ganar experiencia. Vamos a desarrollar tu futuro juntos. Todo lo que necesitas, en un solo lugar.
                    </p>
                </div>
                <br /> <br />

                <div className="row mt-4">
                    <div className="col">
                        <img src={images['img-secundaria']} alt="IMG página principal" className="img-fluid" />
                    </div>
                    <div className="col mt-4">
                        <h3 className="title "> Conoce a nuevos desarrolladores o invita a tus amigos. </h3>

                        <p className="texto-info mt-4">
                        Nuestra plataforma está diseñada para ser un canal de comunicación efectivo para la ejecución de proyectos
                        y la validación de habilidades. No se trata solo de crear un perfil profesional, sino de un espacio donde
                        los desarrolladores pueden conectarse, aprender de los demás y postularse a proyectos..
                        </p>
                    </div>
                </div>
            </div>

            <Footer></Footer>
        </>
        
    )
}

export default Principal;