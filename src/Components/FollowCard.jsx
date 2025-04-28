import { useNavigate } from 'react-router-dom'
import '../Styles/Componentes/followCard.css';
import { FiMessageCircle } from 'react-icons/fi'; 
import { FaUserMinus } from 'react-icons/fa';
import { MdPersonSearch } from 'react-icons/md';

export const CardSeguidos = ({ user, profile, onFollowToggle, showButtons = { unfollow: true, profile: true, message: true } }) => {
    const navigate = useNavigate();
    if (!profile) return null;

    const handleViewProfile = () => {
        navigate(`/profile/${user.user_name}`);
    };

    const handleSendMessage = () => {
        navigate("/techMarket-Chat", { state: { userId: user.id, userName: user.user_name, userImage: profile.image_url } });
    };

    return (
        <div className="follow-card">
            <div className="follow-card-header">
                <img src={profile.image_url} alt="img-profile" className='followCard-Profile' />
                <div className="followCard-info">
                    <span className='followCard-name'>{profile.first_name} {profile.last_name}</span>
                    <span className="followCard-info-userName">@{user.user_name}</span>
                </div>
                <div className="followCard-container-buttons">
                    {showButtons.unfollow && (
                        <button
                            className="btn-followCard is-following"
                            onClick={() => onFollowToggle(user.id)}
                            title="Dejar de seguir"
                        >
                            <FaUserMinus size={18} />
                        </button>
                    )}
                    {showButtons.profile && (
                        <button
                            className="btn-followCard"
                            onClick={handleViewProfile}
                            title="Ver perfil"
                        >
                            <MdPersonSearch size={18} />
                        </button>
                    )}
                    {showButtons.message && (
                        <button
                            className="btn-followCard"
                            onClick={handleSendMessage}
                            title="Enviar mensaje"
                        >
                            <FiMessageCircle size={18} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
