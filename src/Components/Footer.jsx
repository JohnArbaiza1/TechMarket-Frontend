const Footer = () =>{
    return(
        <>
            <style>
                {`
                    .nav-link.p-0 {
                        color: #63318A;
                    }

                    .titulo {
                        color: #2E186A;
                    }
                `}
            </style>
            <div className="container" >
                <footer className="row row-cols-1 row-cols-sm-2 row-cols-md-5 py-5 my-5 border-top">
                    <div className="col mb-3">
                        <a className="navbar-brand" href="#">
                        TechMarket 
                        </a>
                        <p style={{color:' #2E186A '}}>&copy; 2025</p>
                    </div>
                    <div className="col mb-3"></div>

                    <div className="col mb-3">
                        <h5 className="titulo">Acerca de</h5>
                        <ul className="nav flex-column">
                            <li className="nav-item mb-2"><a href="#" className="nav-link p-0 ">¿Quiénes somos?</a></li>
                            <li className="nav-item mb-2"><a href="#" className="nav-link p-0 ">Visión y Misión</a></li>
                            <li className="nav-item mb-2"><a href="#" className="nav-link p-0 ">Precios</a></li>
                            <li className="nav-item mb-2"><a href="#" className="nav-link p-0 ">Noticias</a></li>
                        </ul>
                    </div>

                    <div className="col mb-3">
                        <h5 className="titulo">Políticas</h5>
                        <ul className="nav flex-column">
                            <li className="nav-item mb-2"><a href="#" className="nav-link p-0 ">Términos y condiciones</a></li>
                        </ul>
                    </div>
                </footer>
            </div>
        </>
    )
}

export default Footer;
