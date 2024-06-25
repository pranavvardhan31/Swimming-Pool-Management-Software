import React, { useState } from 'react';
import './OrganizeEvents.css'
import axios from 'axios';
import { Link } from 'react-router-dom';

const OrganizeEvents = () => {
  // State variables to manage form inputs
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState(15);
  const [gender, setGender] = useState('Both' );
  const [distance, setDistance] = useState('');
  const [ticketCost,setTicketCost] = useState(' ');


  // Event handler for submitting form
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!eventName || !eventDate || !startTime || !gender || !distance || !ticketCost) {
      alert('Please fill in all fields.');
      return;
    }

    // Data to be sent to the backend
    const eventData = {
      event_name:eventName,
      date:eventDate,
      start_time:startTime,
      duration:duration,
      distance:distance,
      gender : gender,
      ticket_cost : ticketCost,
    };
    console.log(eventData);

    try {
      const response = await axios.post('https://xwqkcw08-8000.inc1.devtunnels.ms/events', eventData);
      setEventName('');
      setEventDate('');
      setStartTime('');
      setDuration(15);
      setGender('');
      setDistance('');

    } catch (error) {
      console.error('Error during adding events:', error);
      // Handle error, e.g., display error message to user
    }
  };

  const incrementDuration = () => {
    setDuration(prevDuration => prevDuration + 15);
  };

  // Function to handle duration decrement
  const decrementDuration = () => {
    if (duration > 15) {
      setDuration(prevDuration => prevDuration - 15);
    }
  };
  const formatDuration = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    if(hours === 0 ){
      return  `${minutes} min`;
    }
    else if(minutes === 0) {
    return `${hours} hr`;
    }
    else {
      return `${hours} hr ${minutes} min `;
    }
  };


  // return (
  //   <div className="organize-events-container">
  //     <h2>Organize Events</h2>
  //     <form onSubmit={handleSubmit}>
  //       <div className="form-group">
  //         <label htmlFor="eventName">Name of the Event:</label>
  //         <input
  //           type="text"
  //           id="eventName"
  //           value={eventName}
  //           onChange={(e) => setEventName(e.target.value)}
  //           placeholder="Enter event name"
  //         />
  //       </div>
  //       <div className="form-group">
  //         <label htmlFor="gender">Gender:</label>
  //         <select
  //           id="gender"
  //           value={gender}
  //           onChange={(e) => setGender(e.target.value)}
  //         >
  //           <option value="Both">Both</option>
  //           <option value="Male">Male</option>
  //           <option value="Female">Female</option>
  //         </select>
  //       </div>
  //       <div className="form-group">
  //         <label htmlFor="distance">Distance:</label>
  //         <input
  //           type="text"
  //           id="distance"
  //           value={distance}
  //           onChange={(e) => setDistance(e.target.value)}
  //           placeholder="Enter distance"
  //         />
  //       </div>
  //       <div className="form-group">
  //         <label htmlFor="eventDate">Date of Event:</label>
  //         <input
  //           type="date"
  //           id="eventDate"
  //           value={eventDate}
  //           className='calendar-input'
  //           onChange={(e) => setEventDate(e.target.value)}
  //         />
  //       </div>
  //       <div className="form-group">
  //         <label htmlFor="startTime">Start Time:</label>
  //         <input
  //           type="text"
  //           id="startTime"
  //           value={startTime}
  //           onChange={(e) => setStartTime(e.target.value)}
  //           placeholder="HH:MM AM/PM"
  //         />
  //       </div>
  //       <div className="form-group">
  //         <label htmlFor="duration">Duration:</label>
  //         <div>
  //           <button type="button" onClick={decrementDuration}>-</button>
  //           <span>{formatDuration(duration)}</span>
  //           <button type="button" onClick={incrementDuration}>+</button>
  //         </div>
  //       </div>

  //       <button className=" MakeChangesBtn"type="submit">Make Changes</button>
  //     </form>
  //   </div>
  // );


  return (
    <div className='organizeEvents-background'>
      <nav className="manager-navbar">
          <ul className="manager-nav-links">
            <li><Link to="/managerHome" className="manager-nav-link">Home </Link></li>
            <li><Link to="/managerHome/changeRequirements" className='manager-nav-link'>Modify Membership Requirements </Link></li>
            <li><Link to="/managerHome/approvals" className="manager-nav-link">Approvals </Link></li>
            <li><Link to="/managerHome/organizeEvents" className="nav-Org">Organize Events </Link></li>
            <li><Link to="/managerHome/manageSlots" className="manager-nav-link">Manage Slots </Link></li>
            <li><Link to="/managerHome/notices" className="manager-nav-link">Add Notice </Link></li>
            <li><Link to="/managerHome/cancelreasons" className="manager-nav-link">Cancel Reasons</Link></li>            
            <li><Link to="/managerHome/managerProfile" className="manager-nav-link">Profile </Link></li>
          </ul>
        </nav>
        {/* <h2 className='Organize-Title'>Organize Events</h2> */}
      <div className="organizeEvents-container">
        <form onSubmit={handleSubmit}>
          <div className="organizeEvents-form-group">
            <label htmlFor="eventName">Name of the Event:</label>
            <input
              type="text"
              id="eventName"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="Enter event name"
            />
          </div>
          <div className="organizeEvents-form-group">
            <label htmlFor="gender">Gender:</label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="Both">Both</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <div className="organizeEvents-form-group">
            <label htmlFor="distance">Distance:</label>
            <input
              type="text"
              id="distance"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              placeholder="Enter distance"
            />
          </div>
          <div className="organizeEvents-form-group">
            <label htmlFor="distance">Ticket cost:</label>
            <input
              type="text"
              id="ticketCost"
              value={ticketCost}
              onChange={(e) => setTicketCost(e.target.value)}
              placeholder="Enter Ticket Cost"
            />
          </div>
          <div className="organizeEvents-form-group">
            <label htmlFor="eventDate">Date of Event:</label>
            <input
              type="date"
              id="eventDate"
              value={eventDate}
              className="calendar-input"
              onChange={(e) => setEventDate(e.target.value)}
            />
          </div>
          <div className="organizeEvents-form-group">
            <label htmlFor="startTime">Start Time:</label>
            <input
              type="text"
              id="startTime"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              placeholder="HH:MM AM/PM"
            />
          </div>
          <div className="organizeEvents-form-group">
            <label htmlFor="duration">Duration:</label>
            <div>
              <button type="button" onClick={decrementDuration}>-</button>
              <span>{formatDuration(duration)}</span>
              <button type="button" onClick={incrementDuration}>+</button>
            </div>
          </div>

          <button className="organizeEvents-MakeChangesBtn" type="submit">Make Changes</button>
        </form>
      </div>
    </div>
  ); 
};

export default OrganizeEvents;
