import { motion } from 'framer-motion';
import '../../Styles/principal.css'
import Footer from '../../Components/Footer';

const MisionVision = () =>{
        return(
            <>
                <div className="container mt-4">
                    <div className="row">
                        <div className="col">
                            <motion.h3
                                className="title text-center"
                                initial={{ x: '-100%' }}  
                                animate={{ x: 0 }}  
                                transition={{
                                    type: 'spring',
                                    stiffness: 50,
                                    delay: 0.20
                                }}
                            >
                                Misión 
                            </motion.h3>
                    
                            <motion.p
                                className="texto-info text-center"
                                initial={{ x: '100%' }}  
                                animate={{ x: 0 }}  
                                transition={{
                                    type: 'spring',
                                    stiffness: 50,
                                    delay: 0.25
                                }}
                            >
                                Conectar a empresas y emprendedores con el talento tecnológico adecuado, ofreciendo una plataforma dinámica donde desarrolladores
                                y profesionales puedan acceder a proyectos relevantes, ganar experiencia y potenciar sus habilidades.
                            </motion.p>
    
                            <motion.h3
                                className="title text-center"
                                initial={{ x: '-100%' }}  
                                animate={{ x: 0 }}  
                                transition={{
                                    type: 'spring',
                                    stiffness: 50,
                                    delay: 0.20
                                }}
                            >
                                Visión
                            </motion.h3>
    
                            <motion.p
                                className="texto-info text-center"
                                initial={{ x: '100%' }}  
                                animate={{ x: 0 }}  
                                transition={{
                                    type: 'spring',
                                    stiffness: 50,
                                    delay: 0.25
                                }}
                            >
                                Ser la plataforma líder en la conexión entre talento tecnológico y oportunidades reales, transformando la
                                forma en que las empresas acceden a profesionales calificados y brindando a los desarrolladores un entorno
                                donde puedan crecer, destacar y construir el futuro del sector tecnológico.
                            </motion.p>
                        </div>
                    </div>
                </div>
                <Footer></Footer>
            </>
        );
}

export default MisionVision;