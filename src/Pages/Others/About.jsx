import Footer from "../../Components/Footer";
import images from "../../JS/images";
import { motion } from 'framer-motion';
import '../../Styles/principal.css'

const AboutPage = () =>{
    return(
        <>
            <div className="container mt-4">
                <div className="row">
                    <div className="col">
                        <motion.h3
                            className="title"
                            initial={{ x: '-100%' }}  
                            animate={{ x: 0 }}  
                            transition={{
                                type: 'spring',
                                stiffness: 50,
                                delay: 0.20
                            }}
                        >
                            Sobre nosotros 🫣
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
                            Somos una plataforma basada en un modelo de suscripción que ofrece distintos niveles de acceso para desarrolladores, empresas 
                            y otros profesionales del ámbito tecnológico. Facilitamos la conexión entre el talento y las oportunidades, creando un espacio
                            donde la innovación y el crecimiento profesional se encuentran.
                        </motion.p>

                        <motion.h3
                            className="title"
                            initial={{ x: '-100%' }}  
                            animate={{ x: 0 }}  
                            transition={{
                                type: 'spring',
                                stiffness: 50,
                                delay: 0.20
                            }}
                        >
                            Por qué lo hacemos 🤨
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
                            Sabemos que el sector tecnológico está creciendo a un ritmo acelerado, lo que ha disparado la demanda de talento calificado.
                            Sin embargo, muchas empresas enfrentan grandes desafíos para encontrar a los profesionales adecuados para sus proyectos.

                            Al mismo tiempo, los profesionales del sector buscan oportunidades que estén alineadas con sus habilidades y aspiraciones, 
                            pero a menudo se enfrentan a barreras para acceder a proyectos relevantes o validar sus competencias en un mercado cada vez más competitivo.
                            <br />
                            Ahí es donde entramos nosotros: como un canal que conecta a empresas y profesionales tecnológicos, facilitamos el encuentro entre
                            el talento y las oportunidades.
                        </motion.p>
                    </div>
                
                    <div className="col">
                        <br />
                        <motion.img
                            src={images['img-5']}  
                            alt="IMG página principal"
                            className="img-fluid"
                            initial={{ y: '100%' }}  
                            animate={{ y: 0 }}  
                            transition={{
                                type: 'spring',
                                stiffness: 50,
                                delay: 0.30 
                            }}
                        />
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </>
    );
}

export default AboutPage;