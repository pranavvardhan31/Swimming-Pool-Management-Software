// Events.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Events.css';
import { useAuth } from '../../AuthContext';
import { IoIosArrowBack } from "react-icons/io";
import { Link, Navigate } from 'react-router-dom';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import BuyTicketsModal from '../../components/BuyTicketsModal'; // Import the BuyTicketsModal component

const Events = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [userParticipation, setUserParticipation] = useState([]);
  const [userTickets, setUserTickets] = useState([]);
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false); // State to control the modal

  useEffect(() => {
    fetchEvents();
     fetchUserParticipation();
  }, []);


  // Your existing code for fetching events and user participation

  const fetchUserParticipation = async () => {
    try {
      // Fetch user participation information from the backend
      const response = await axios.get('https://xwqkcw08-8000.inc1.devtunnels.ms/participations');
      setUserParticipation(response.data.participation);
      setUserTickets(response.data.ticketBookings)
      console.log(userParticipation);
    } catch (error) {
      console.error('Error fetching user participation:', error);
    }
  };


  const fetchEvents = async () => {
    try {
      const response = await axios.get('https://xwqkcw08-8000.inc1.devtunnels.ms/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleParticipate = async (eventId, participants,gender) => {
    if (participants === 0) {
      alert("That participation is over");
    } else if(gender !== user.gender){
      console.log("gender",user.gender);
      console.log("event gender",gender);
      alert( `You cannot partcipate in ${gender} events.`)
    }
    else {
      try{
        await axios.post(`https://xwqkcw08-8000.inc1.devtunnels.ms/events/registerParticipation/${eventId}`);
        const newParticipation = { event_id: eventId }; // Modify as per your response structure
        setUserParticipation(prevState => [...prevState, newParticipation]);

      }catch(error){
        console.error('Error getting participation confirmation:', error);
      }
      // Implement your logic for participating in the event
      console.log('Participating in event:', eventId);
    }
  };

  // Function to open the modal for buying tickets
  const handleOpenModal = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setSelectedEvent(null);
    setShowModal(false);
  };

  // Function to handle payment success
  const handlePaymentSuccess = () => {
    handleCloseModal(); // Close the modal after successful payment
    fetchUserParticipation(); // Refresh user participation data
  };

  return (
    <div className='Events-body'>
      <div className="container-eve">
        <h2>Events</h2>
        <div>
          {events.map((event) => {
            const isParticipating = userParticipation.some((participation) => participation.event_id === event.id);
            const tickets = userTickets.filter((ticket) => ticket.event_id === event.id);
            const totalTickets = tickets.reduce((total, ticket) => total + ticket.quantity, 0); // Calculate total tickets quantity

            {console.log(tickets)};
            return (
              <div key={event.id} className="event">
                <h3>{event.event_name} {event.distance} {event.gender === "Both" ? " " : event.gender}</h3>
              <p>Date: {event.date}</p>
              <p>Start Time: {event.start_time}</p>
              <p>Duration: {event.duration}</p>
              {isParticipating && <p>You are participating in this event.</p>}
                {tickets.length>0   &&  totalTickets !==0  &&  <p>
                  You have {totalTickets} tickets for this event.</p>
                }
                <button className="buy-tickets-btn" onClick={() => handleOpenModal(event)}>Buy Tickets</button>
                {!isParticipating && (
                <button className="participate-btn" onClick={() => handleParticipate(event.id,event.participants,event.gender)}>
                  Participate
                </button>
              )}

              </div>
            );
          })}
        </div>
        <div>
          <Link to="/home" className='Events-back'><IoIosArrowBack /> Back </Link>
        </div>
      </div>

      {showModal && selectedEvent && (
        <BuyTicketsModal event={selectedEvent} onClose={handleCloseModal} onPaymentSuccess={handlePaymentSuccess} />
      )}
    </div>
  );
};

export default Events;
