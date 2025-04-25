import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { viewPlanes } from "../../Services/planesService";
import authService from "../../Services/authservice";
import '../../Styles/Logueado/CreditCardForm.css';
import { toast } from "sonner";

const CreditCard = () => {
    const [name, setName] = useState('');
    const [number, setNumber] = useState('');
    const [expiryMonth, setExpiryMonth] = useState('');
    const [expiryYear, setExpiryYear] = useState('');
    const [cvv, setCvv] = useState('');
    const [plan, setPlan] = useState('');
    const [planes, setPlanes] = useState([]); // Estado para almacenar los planes
    const navigate = useNavigate();

    // Cargar los planes al montar el componente
    useEffect(() => {
        const fetchPlanes = async () => {
            try {
                const response = await viewPlanes();
                setPlanes(response.data); 
                if (response.data.length > 0) {
                    setPlan(response.data[0].id);
                }
            } catch (error) {
                console.error("Error al cargar los planes:", error);
                toast.error("Error al cargar los planes. Inténtalo más tarde.");
            }
        };

        fetchPlanes();
    }, []);

    // Manejar la actualización del plan
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Llamar a la función para actualizar la membresía
            await authService.updateMembership(plan);
            toast.success("Plan actualizado con éxito.");
            navigate("/home");
        } catch (error) {
            console.error("Error al actualizar el plan:", error);
            toast.error(error || "Error al actualizar el plan. Inténtalo más tarde.");
        }
    };

    return (
        <div className="credit-form-wrapper">
            <div className="card-preview">
                <div className="card-front">
                    <div className="card-circle">
                        <img
                            src="https://unavatar.io/github/defaultuser"
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
            <form className="credit-form" onSubmit={handleSubmit}>
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
                    {planes.map((p) => (
                        <option key={p.id} value={p.id}>
                            {p.membership_name} - ${p.price}
                        </option>
                    ))}
                </select>

                <button className="btn-plan" type="submit">Confirmar</button>
            </form>
        </div>
    );
};

export default CreditCard;