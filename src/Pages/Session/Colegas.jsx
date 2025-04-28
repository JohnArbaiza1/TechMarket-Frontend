import { useEffect, useState } from 'react';
import { getFollowers, getFollowing } from '../../Services/followersService';
import { toast } from 'sonner';
import { UserCard } from '../../Components/Card';
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

    useEffect(() =>{
        const token = localStorage.getItem('token')

        const fetchData = async () =>{
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
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if(loading) return  toast.dismiss("Cargando Colegas");

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
                                                    <UserCard key={user.id} user={user} profile={user.profile} />
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
                                                    <UserCard key={user.id} user={user} profile={user.profile} />
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
