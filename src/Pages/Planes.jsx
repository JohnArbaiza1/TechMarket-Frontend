import Footer from "../Components/Footer"
import { CardPrice } from "../Components/Card";
import '../Styles/planes.css';


export function Planes(){
    return(
        <>
        <div className="planes-contenido">
            <div className="pricing-header p-3 pb-md-4 mx-auto text-center">
                <h1 className="mt-4 title-planes">¡Da el siguiente paso en tu carrera o proyecto!</h1>
                <p className="fs-5 info-planes">
                    Elige el plan que mejor se adapte a tus necesidades y empieza a aprovechar todas las oportunidades
                    que nuestra plataforma tiene para ofrecer. Ya seas un desarrollador en busca de más proyectos o una
                    empresa con ideas innovadoras, aquí encontrarás el plan perfecto para ti.
                </p>
                <br />

                <h3 className="titulo-planes">Para Desarroladores y otros Profesionales</h3>
                <div className="planes">
                    <CardPrice
                    title={"Inicial"}
                    subtitle={"Gratuito"}
                    texto={"Seleccionar Plan"}> 
                    </CardPrice>

                    <CardPrice
                    title={"Premium"}
                    subtitle={"$22/mes"}
                    texto={"Seleccionar Plan"}>

                    </CardPrice>
                </div>

                <h3 className="titulo-planes">Para Empresas</h3>
                <div className="planes">
                    <CardPrice
                    title={"Inicial Enterprise"}
                    subtitle={"Gratuito"}
                    texto={"Seleccionar Plan"}> 
                    </CardPrice>

                    <CardPrice
                    title={"Premium Enterprise"}
                    subtitle={"$50/mes"}
                    texto={"Seleccionar Plan"}>

                    </CardPrice>
                </div>
            </div>
        </div>

            <Footer></Footer>
        </>
    )
}