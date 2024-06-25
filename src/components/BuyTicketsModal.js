// BuyTicketsModal.js

import React, { useState, useEffect } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import axios from 'axios';

const BuyTicketsModal = ({ event, onClose, onPaymentSuccess }) => {
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [totalCost, setTotalCost] = useState(event.ticket_cost);

  useEffect(() => {
    setTotalCost(event.ticket_cost * ticketQuantity);
  }, [ticketQuantity, event.ticket_cost]);

  const handleTicketQuantityChange = (e) => {
    const quantity = parseInt(e.target.value);
    if (quantity >= 1) {
      setTicketQuantity(quantity);
    }
  };

  const handleBuyTickets = async () => {
    if (!stripe || !elements || !elements.getElement(CardElement)) {
      alert("Card information is missing.");
      return;
    }

    try {
      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
      });

      if (error) {
        console.error('Error creating payment method:', error);
        alert('Error processing payment. Please try again.');
        return;
      }

      const totalAmount = totalCost;

      // Make a request to your backend to initiate payment with Stripe
      const response = await axios.post(`https://xwqkcw08-8000.inc1.devtunnels.ms/events/buyTickets/${event.id}`, { amount: totalAmount, paymentMethodId: paymentMethod.id, ticketsBought: ticketQuantity });

      // Assuming payment is successful
      alert(`Payment successful. You have purchased ${ticketQuantity} tickets for the event.`);
      onPaymentSuccess();

    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Payment failed. Please try again later.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <span className="close-btn" onClick={onClose}>&times;</span>
        <h2>Buy Tickets</h2>
        <p>Event: {event.event_name}</p>
        <label htmlFor="ticketQuantity">Number of Tickets:</label>
        <input type="number" id="ticketQuantity" value={ticketQuantity} min="1" onChange={handleTicketQuantityChange} />
        
        <span>Cost: {totalCost}</span>
        <CardElement />
        <button onClick={handleBuyTickets}>Buy Tickets</button>
      </div>
    </div>
  );
};

export default BuyTicketsModal;
