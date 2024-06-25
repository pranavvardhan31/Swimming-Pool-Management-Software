import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';
import EditProfile from '../../components/EditProfile';
import ChangePassword from '../../components/ChangePassword';
// import Slot from '../../components/Slot';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import { MdDisplaySettings } from 'react-icons/md';

function Profile() {
  const [userInfo, setUserInfo] = useState({});
  const [activeComponent, setActiveComponent] = useState('user-info'); // Default active component
  const [slots,setSlots] = useState([]);
  const [poolBookings,setPoolBookings]= useState([]);
  const [participations,setParticipations] =useState([]);
  const [tickets,setTickets] =useState([]);
  const [events, setEvents] = useState([]);
  const [reason,setReason] =useState("Personal");
  const [comments,setComments] =useState("");
  const navigate = useNavigate();
  const {user,loginUser} = useAuth();
  const [cancelInputVisible, setCancelInputVisible] = useState(false);
  const [cancelQuantity, setCancelQuantity] = useState(0);






  useEffect(() => {
    fetchPreviousBookings();
    fetchUserData(); 
    fetchPoolBookings();
    fetchParticipations();
    fetchEvents();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`https://xwqkcw08-8000.inc1.devtunnels.ms/userInfo`);
      setUserInfo(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchPoolBookings = async () => {
    try {
      const response = await axios.get(`https://xwqkcw08-8000.inc1.devtunnels.ms/pool_bookings`);
      setPoolBookings(response.data);
      
    } catch (error) {
      console.error('Error fetching previous bookings:', error);
    }
  };

  const fetchPreviousBookings = async () => {
    try {
      const response = await axios.get(`https://xwqkcw08-8000.inc1.devtunnels.ms/slot_bookings`);
      setSlots(response.data);
      console.log(response.data);

    } catch (error) {
      console.error('Error fetching previous bookings:', error);
    }
  };

  const fetchParticipations = async () => {
    try {
      const response = await axios.get(`https://xwqkcw08-8000.inc1.devtunnels.ms/participations`);
      setParticipations(response.data.participation);
      setTickets(response.data.ticketBookings);
      console.log(response.data);

    } catch (error) {
      console.error('Error fetching previous bookings:', error);
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

  const getDayFromDate = (dateString) => {
    if (!dateString) return ''; // Check if dateString is undefined
    const date = new Date(dateString);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  };

  const cancelParticipation = async (participationId) => {
    try {
      // Make a DELETE request to your backend API to delete the participation
      await axios.delete(`https://xwqkcw08-8000.inc1.devtunnels.ms/participations/${participationId}`);
      // Remove the canceled participation from the state
      console.log("Participation cancelled succesfully");
      setParticipations(participations.filter(participation => participation.id !== participationId));
    } catch (error) {
      console.error('Error canceling participation:', error);
    }
  };
  
  const cancelTicket = async (ticketId, quantity) => {
    try {
      // Make a DELETE request to your backend API to delete the ticket
      console.log(quantity);
      await axios.delete(`https://xwqkcw08-8000.inc1.devtunnels.ms/tickets/${ticketId}`, {
        data: { quantity }, // Send the quantity in the request body
      });
      alert("Tickets cancelled succesfully");
      setCancelInputVisible(false);
      // Remove the canceled ticket from the state
      const updatedTickets = tickets.map(ticket => {
        if (ticket.id === ticketId) {
          return { ...ticket, quantity: ticket.quantity - quantity }; // Reduce the quantity
        }
        return ticket;
      });
  
      // Remove the ticket if its quantity becomes zero
      const filteredTickets = updatedTickets.filter(ticket => ticket.quantity > 0);
      setTickets(filteredTickets);
      
      console.log("Tickets canceled successfully");
  
    } catch (error) {
      console.error('Error canceling ticket:', error);
    }
  };
  

  const getEventDetails = (eventId) => {
    const event = events.find((e) => e.id === eventId);
    return event ? event : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://xwqkcw08-8000.inc1.devtunnels.ms/cancel-membership', {
        reason,
        comments,
      });
      console.log(response.data); // Assuming the backend sends a success message
      // Add any additional logic after successful cancellation
      loginUser({ ...user, role: 'non member' ,approved: 0}); 
      alert("Your membership has been cancelled succesfully.");
      navigate(-1);
    } catch (error) {
      console.error('Error cancelling membership:', error);
      // Handle error message or display a notification
    }
  };

  const toggleCancelInput = () => {
    setCancelInputVisible(!cancelInputVisible);
  };

  const handleCancelQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value); // Parse the input value as an integer
    if (!isNaN(newQuantity) && newQuantity >= 0) {
      setCancelQuantity(newQuantity); // Update the cancel quantity only if it's valid
    }
    };

  const handleCancelClick = (ticketId) => {
    // You can implement your cancel logic here
    // For demonstration, I'll just toggle the input visibility
    toggleCancelInput();
  };





  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="sidebar">
        <ul>
        <li><button className = {`sidebar-btn ${activeComponent === 'user-info' ? 'active' : ''}`} onClick={() => setActiveComponent('user-info')}>User Information</button> </li>
        <li><button className={`sidebar-btn ${activeComponent === 'slot-bookings' ? 'active' : ''}`} onClick={() => setActiveComponent('slot-bookings')}>Your Slot Bookings</button></li>
        <li><button className={`sidebar-btn ${activeComponent === 'pool-bookings' ? 'active' : ''}`} onClick={() => setActiveComponent('pool-bookings')}>Your Pool Bookings</button></li>
        <li><button className={`sidebar-btn ${activeComponent === 'participations' ? 'active' : ''}`} onClick={() => setActiveComponent('participations')}>Your Participations</button></li>
        <li><button className={`sidebar-btn ${activeComponent === 'tickets' ? 'active' : ''}`} onClick={() => setActiveComponent('tickets')}>Your Tickets</button></li>
        {userInfo.role === 'member' &&  <li><button className={`sidebar-btn ${activeComponent === 'cancel-membership' ? 'active' : ''}`} onClick={() => setActiveComponent('cancel-membership')}>Cancel Membership</button></li>}
        <li><button className={`sidebar-btn ${activeComponent === 'edit-profile' ? 'active' : ''}`} onClick={() => setActiveComponent('edit-profile')}>Edit Profile</button></li>
        <li><button className={`sidebar-btn ${activeComponent === 'change-password' ? 'active' : ''}`} onClick={() => setActiveComponent('change-password')}>Change Password</button></li>
        </ul>
      </div>
      

      {/* Profile content */}
      <div className="profile-content">
        {activeComponent === 'user-info' && (
          <div className="content-section">
            <h2>User Information</h2>
            <p>Name: {userInfo.username}</p>
            <p>Email: {userInfo.email}</p>
            <p>Gender: {userInfo.gender}</p>
            <p>Phone Number: {userInfo.phone_number}</p>
          </div>
        )}

        {activeComponent === 'slot-bookings'  && 
          <div>
            {slots.length === 0  && <h2>You did not book any slots</h2>}
            {slots.length >0 &&  (
              <div className='bookslot-selected-slots'>
                  <ul>
                      {slots.map((selectedSlot, index) => (
                          <li key={index}>
                              {selectedSlot.date} ({getDayFromDate(selectedSlot.date)}): {selectedSlot.start_time} - {selectedSlot.end_time}
                          </li>
                      ))}
                  </ul>
              </div>
          )}

            
          </div>
        }

        {activeComponent === 'pool-bookings'  && 
          <div>
            {poolBookings.length === 0  && <h2>You did not book pool.</h2>}
            {poolBookings.length >0 &&  (
              <div className='bookslot-selected-slots'>
                  <ul>
                      {poolBookings.map((selectedSlot, index) => (
                          <li key={index}>
                              {selectedSlot.date} ({getDayFromDate(selectedSlot.date)}): {selectedSlot.start_time} - {selectedSlot.end_time}
                          </li>
                      ))}
                  </ul>
              </div>
          )}
          </div>
        }

        {activeComponent === 'participations' && (
          <div>
            <h2>Your Participations</h2>
            <ul>
              {participations.map((participation, index) => {
                const event = getEventDetails(participation.event_id);
                return (
                  <li key={index}>
                    {event ? (
                      <div>
                        <h3>{event.event_name}</h3>
                        <p>
                          <strong>Start time:</strong> {event.start_time}
                        </p>
                        <p>
                          <strong>Date:</strong> {event.date}
                        </p>
                        <p>
                          <strong>Duration:</strong> {event.duration} minutes
                        </p>
                        <p>
                          <strong>Distance:</strong> {event.distance}
                        </p>
                        <p>
                          <strong>Gender:</strong> {event.gender}
                        </p>  
                        <button onClick={() => cancelParticipation(participation.id)}>Cancel</button>
                      </div>
                    ) : (
                      <p>Event details not found</p>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {activeComponent === 'tickets'  && 
          <div>
            {tickets.length === 0  && <h2>You dont have any tickets.</h2>}
            {tickets.length >0 &&  (
              <div >
                  <ul>
                      {tickets.map((ticket, index) => {
                          const event = getEventDetails(ticket.event_id);
                          return (
                          
                            <li key={index}>
                              {event ? (
                                <div>
                                  <h3>{event.event_name}</h3>
                                  <p>
                                    <strong>Start time:</strong> {event.start_time}
                                  </p>
                                  <p>
                                    <strong>Date:</strong> {event.date}
                                   </p>
                                  <p>
                                    <strong>Duration:</strong> {event.duration} minutes
                                  </p>
                                  <p>
                                    <strong>Distance:</strong> {event.distance}
                                  </p>
                                  <p>
                                    <strong>Quantity:</strong>{ticket.quantity}
                                  </p>
                                  <p>
                                    <strong>Gender:</strong> {event.gender}
                                  </p>
                                  
                                  {!cancelInputVisible && <button onClick={() => handleCancelClick(ticket.id)}>Cancel</button>}
                                  {cancelInputVisible && (
                                    <input
                                      type="number"
                                      value={cancelQuantity}
                                      onChange={handleCancelQuantityChange}
                                      placeholder="Enter quantity to cancel"
                                    />
                                  )}
                                  {cancelInputVisible && <button onClick={() => cancelTicket(ticket.id,cancelQuantity)}>Cancel</button>}
                                </div>
                              ) : (
                                <p>Event details not found</p>
                              )}
                            </li>
                          );
                              })}
                  </ul>
              </div>
          )}
          </div>
        }

{activeComponent === 'cancel-membership' && 
  <div className="content-section">
    <h2>Cancel Membership</h2>
    <form onSubmit={handleSubmit}>
        <div>
          <label>Select Reason:</label>
          <select value={reason} onChange={(e) => setReason(e.target.value)}>
            <option value="Personal">Personal Reasons</option>
            <option value="Financial">Financial Reasons</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label>Additional Comments:</label>
          <textarea
            rows="4"
            cols="50"
            placeholder="Enter your reason for canceling"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
          ></textarea>
        </div>
        <button type="submit">Cancel Membership</button>
      </form>

  </div>
}

        {activeComponent === 'edit-profile' && <EditProfile userInfo={userInfo} setUserInfo={setUserInfo} />}


        {activeComponent === 'change-password' && <ChangePassword />}
      </div>
    </div>
  );
}

export default Profile;
