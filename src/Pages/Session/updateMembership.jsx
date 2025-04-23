import React, { useState } from 'react';
import { useEffect } from 'react';
import { Container, Row, Col  } from 'react-bootstrap';
import '../../Styles/Logueado/CreditCardForm.css' 
import { getProfile } from "../../Services/profileService";

const CreditCard = () =>{
    const [name, setName] = useState('');
    const [number, setNumber] = useState('');
    const [expiryMonth, setExpiryMonth] = useState('');
    const [expiryYear, setExpiryYear] = useState('');
    const [cvv, setCvv] = useState('');
    const [plan, setPlan] = useState('basic');
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userId = localStorage.getItem("user_id");
                const response = await getProfile(userId);
                setProfile(response.data);
            } catch (err) {
                console.error("Error al cargar el perfil:", err);
            }
        };
    
        fetchProfile();
    }, []);

    return (
        <div className="credit-form-wrapper">

            <div className="card-preview">
            <div className="card-front">
                <div className="card-circle">
                    <img
                        src={profile?.image_url || 'https://unavatar.io/github/defaultuser'}
                        alt="img profile"
                        className="img-profileCard"
                    />
                </div>
                <div className="card-number">{number || '1234 4125 1231 2132'}</div>
                <div className="card-bottom">
                <span className="card-holder">{name || 'JUAN PEREZ'}</span>
                <span className="card-expiry">
                    {(expiryMonth && expiryYear) ? `${expiryMonth}/${expiryYear.slice(2)}` : 'MM/YY'}
                </span>
                </div>
            </div>
    
            <div className="card-back">
                <div className="linea"></div>
                <div className="cvv-box">{cvv || '000'}</div>
            </div>
            </div>
    
            {/* Form */}
            <form className="credit-form">
            <label>NOMBRE DE TARJETA</label>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Juan Perez"
            />
    
            <label>NÚMERO DE TARJETA</label>
            <input
                type="text"
                maxLength="19"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="1234 4125 1231 2132"
            />
    
            <div className="form-row">
                <div>
                <label>EXP. DATE (MM/YY)</label>
                <div className="form-row">
                    <input
                    type="text"
                    placeholder="MM"
                    maxLength="2"
                    value={expiryMonth}
                    onChange={(e) => setExpiryMonth(e.target.value)}
                    />
                    <input
                    type="text"
                    placeholder="YY"
                    maxLength="2"
                    value={expiryYear}
                    onChange={(e) => setExpiryYear(e.target.value)}
                    />
                </div>
                </div>
    
                <div>
                <label>CVV</label>
                <input
                    type="text"
                    maxLength="4"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    placeholder="123"
                />
                </div>
            </div>
    
            <label>SELECCIONAR PLAN</label>
            <select value={plan} onChange={(e) => setPlan(e.target.value)}>
                <option value="pro">Pro</option>
                <option value="pro">Pro Enterprise</option>
                <option value="premium">Todo en Uno</option>
            </select>
    
            <button className='btn-plan' type="submit">Confirmar</button>
            </form>
        </div>
    );
};

export default CreditCard;