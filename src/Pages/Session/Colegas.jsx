import { useEffect, useState } from 'react';
import { getFollowers, getFollowing, unfollowUser } from '../../Services/followersService';
import { toast } from 'sonner';
import { CardSeguidos } from '../../Components/FollowCard';
import '../../Styles/Logueado/misColegas.css';
import { Row, Col, Accordion } from 'react-bootstrap';
import { FaUsers} from 'react-icons/fa'; 
import { RiUserFollowFill } from 'react-icons/ri';

const MisColegas = () => {
    //Definimos los Estados a emplear
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleUnfollow = async (userId) => {
        const token = localStorage.getItem('token');
        try {
            await unfollowUser(userId, token); // llamada al backend
            setFollowing((prev) => prev.filter((user) => user.id !== userId)); // actualiza el estado
            toast.success("Has dejado de seguir al usuario.");
        } catch (error) {
            console.error("Error al dejar de seguir:", error);
            toast.error(error || "No se pudo dejar de seguir al usuario.");
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
    
        const fetchData = async () => {
            // Mostrar toast de carga
            const loadingToastId = toast.loading("Cargando colegas...",{position:'top-center'});
    
            try {
                const [followersData, followingData] = await Promise.all([
                    getFollowers(token),
                    getFollowing(token),
                ]);
    
                setFollowers(followersData);
                setFollowing(followingData);
            } catch (error) {
                setError("Error al cargar tus colegas");
                toast.error("No se pudo cargar la información de tus colegas.");
                console.error(error);
            } finally {
                // Cerrar toast de carga
                toast.dismiss(loadingToastId);
                setLoading(false);
            }
        };
    
        fetchData();
    }, []);

    if (loading) return null;

    if (error) {
        return <div> 😬 Parece que hubo un tropiezo. Pero no te preocupes, los ingenieros están al mando.</div>;
    }
    
    return(
        <>
            <section className="container-colegas">
                <h2 className="title text-center">Mis Colegas</h2><br />
                <div className="mis-colegas">
                    <Row>
                        <Col> 
                            <h3 className='subtitle-colegas text-center'>Usuarios que sigues</h3>
                            <Accordion>
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header> <FaUsers  className='icon-colegas'/> Ver más</Accordion.Header> 
                                        <Accordion.Body>
                                            <div className="users-list">
                                                {following.length > 0 ? (
                                                    following.map((user) => (
                                                    <CardSeguidos key={user.id} user={user} profile={user.profile} onFollowToggle={handleUnfollow}/>
                                                    ))
                                                ) : (
                                                    <p>No sigues a ningún usuario aún.</p>
                                                )}
                                            </div>
                                        </Accordion.Body>
                                    
                                </Accordion.Item>
                            </Accordion>
                        </Col>
                        <Col>
                            <h3 className='subtitle-colegas text-center'>Usuarios que te siguen</h3>
                            <Accordion>
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header> <RiUserFollowFill className='icon-colegas' /> Ver más</Accordion.Header> 
                                        <Accordion.Body>
                                            <div className="users-list">
                                                {followers.length > 0 ? (
                                                    followers.map((user) => (
                                                    <CardSeguidos key={user.id} user={user} profile={user.profile} showButtons={{ profile: true, message: true, unfollow: false }}/>
                                                    ))
                                                ) : (
                                                    <p>Nadie te sigue todavía.</p>
                                                )}
                                            </div>

                                        </Accordion.Body>                               
                                </Accordion.Item>
                            </Accordion>
                        </Col>
                    </Row>

                </div>

            </section>
        </>
    );
};

export default MisColegas;
