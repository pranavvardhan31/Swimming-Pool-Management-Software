import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { useAuth } from '../../AuthContext';
import { useNavigate } from 'react-router-dom';
import './PayMembership.css'

const PayMembership = () => {
  const { user ,loginUser} = useAuth();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);



    const handleSubmit = async (event) => {
      event.preventDefault();
      
      if (!stripe || !elements) {
        // Stripe.js has not loaded yet
        return;
      }
  
      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
      });
  
      if (error) {
        setError(error.message);
        return;
      }
  
      try {
        await axios.put(`https://xwqkcw08-8000.inc1.devtunnels.ms/payMembership`, {
          paymentMethodId: paymentMethod.id,
          // Add any other necessary data here
        });
        loginUser({ ...user, role: 'member' ,approved: 1}); 
        alert("Your membership has been activated");
        navigate(-1);
      } catch (error) {
        console.error('Error approving membership:', error);
      }
    };
  

    
  return (

    <div className='pay-background'>
      <div className='payment-container'>
      <h1 className='payment-heading'>Hi {user.username}</h1>
      <h2 className='payment-subheading'>Your membership has been Approved!</h2>
      <p className='payment-info'>Your membership has been approved. Please proceed with the payment to activate your membership.</p>
          <form onSubmit={handleSubmit}>
          <h3>Membership Plan:</h3>
          <p>Price: 200 Rupees per month</p>  
          <label>
            Card details:
            <CardElement />
          </label>
          {error && <div>{error}</div>}
          <button type="submit" disabled={!stripe}>Pay</button>
        </form>

    </div>
    </div>

  );
};

export default PayMembership;
