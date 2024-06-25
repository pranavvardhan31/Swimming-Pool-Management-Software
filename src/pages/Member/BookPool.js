import React, { useState ,useEffect} from 'react';
import axios from 'axios';
import './BookPool.css'; // Importing the CSS file
import Slot from '../../components/Slot';
import { useAuth } from '../../AuthContext';
import { IoIosArrowBack } from "react-icons/io";
import { Link, Navigate } from 'react-router-dom';

const BookPool = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [previousBookings, setPreviousBookings] = useState([]);
  const [disabledSlots, setDisabledSlots] = useState([]);
  const [eventsDate,setEventsDate] =useState([]);


  const fetchPreviousBookings = async () => {
    try {
      const response = await axios.get(`https://xwqkcw08-8000.inc1.devtunnels.ms/pool_bookings`);
      setPreviousBookings(response.data);
      setDisabledSlots(response.data);
    } catch (error) {
      console.error('Error fetching previous bookings:', error);
    }
  };

  const fetchAvailableSlots = async (date) => {
    try {
      const day=getDayFromDate(date);
      const response = await axios.get(`https://xwqkcw08-8000.inc1.devtunnels.ms/bookSlots?day=${day}`);
      // console.log(response.data);
      setAvailableSlots(response.data);
      // console.log(response.data);
      console.log(availableSlots);
    } catch (error) {
      console.error('Error fetching available slots:', error);
    }
  };

  const fetchEvents = async () =>{
    try {
      const response = await axios.get(`https://xwqkcw08-8000.inc1.devtunnels.ms/event_dates`);
      setEventsDate(response.data);
      // console.log(eventsDate)
    } catch (error) {
      console.error('Error fetching previous bookings:', error);
    }
  }

  useEffect(() => {
    fetchEvents();
    fetchPreviousBookings();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots(selectedDate);
    }
  }, [selectedDate]);


  

  const handleCancelBtn = async (booking) => {

    const updatedBookings = previousBookings.filter((prevBooking) => (
      !(prevBooking.start_time === booking.start_time &&
        prevBooking.end_time === booking.end_time &&
        prevBooking.date === booking.date)
    ));
    setPreviousBookings(updatedBookings);
    console.log(booking.id);
    await axios.delete(`https://xwqkcw08-8000.inc1.devtunnels.ms/delete_poolbooking?poolid=${booking.id}`)
  };

  
  const getTimeFromString = (timeString) => {
    const [time, meridiem] = timeString.split(' '); // Split the time and meridiem (AM/PM)
    const [hours, minutes] = time.split(':').map((value) => parseInt(value));
    let totalMinutes = hours * 60 + minutes;
    // Adjust for PM times (add 12 hours)
    if (meridiem === 'PM') {
      totalMinutes += 12 * 60;
    }
    return totalMinutes; // Return total minutes for comparison
  };

  // Get today's date in the format YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];

  // Function to handle date selection
  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  // Function to handle slot selection
  const handleSlotSelect = (slot) => {
    const { start_time, end_time } = slot;
    const isSelected = selectedSlots.some(
      (selectedSlot) => selectedSlot.start_time === start_time && 
      selectedSlot.end_time === end_time &&   
      selectedSlot.date === selectedDate
    );
    
    let newSelectedSlots;
  
    if (isSelected) {
      newSelectedSlots = selectedSlots.filter(
        (selectedSlot) => !(selectedSlot.start_time === start_time && selectedSlot.end_time === end_time && selectedSlot.date === selectedDate)
      );
    } else {
      newSelectedSlots = [...selectedSlots, { start_time, end_time, date: selectedDate }];
    }
  
    newSelectedSlots.sort((a, b) => {
      // Compare dates first
      const dateComparison = new Date(a.date) - new Date(b.date);
      if (dateComparison !== 0) {
        return dateComparison;
      }
      // If dates are equal, compare times
      const timeComparison = getTimeFromString(a.start_time) - getTimeFromString(b.start_time);
      return timeComparison;
    });
  
    setSelectedSlots(newSelectedSlots);
  };


  const getDayFromDate = (dateString) => {
    if (!dateString) return ''; // Check if dateString is undefined
    const date = new Date(dateString);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  };

  const handleBookPoolBtn = async ()=>{
    const allBookings = [...selectedSlots, ...previousBookings];
    
    setPreviousBookings(allBookings);
    console.log(previousBookings);

    try {
      await axios.post('https://xwqkcw08-8000.inc1.devtunnels.ms/pool_booking', allBookings);
      console.log('Bookings updated successfully');
      // Clear selected slots after successful update
      setSelectedSlots([]);
    } catch (error) {
      console.error('Error updating pool bookings:', error);
    }
  }

  const getMinDate = () => {
    const today = new Date();
    const twoWeeksLater = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 14);
    return twoWeeksLater.toISOString().split('T')[0];
  };

  // const updateSlotsAvailability = () => {
  //   // Iterate through available slots and check if they are disabled
  //   const updatedAvailableSlots = availableSlots.map((slot) => {
  //     const isDisabled = isDisabledSlot(slot);
  //     return { ...slot, disabled: isDisabled };
  //   });
  //   setAvailableSlots(updatedAvailableSlots);
  // };

  const isDisabledSlot = (slot) => {
    // Check if the slot overlaps with any previous bookings on the selected date
    const overlappingBookings = previousBookings.filter(
      (booking) => booking.date === selectedDate && doSlotsOverlap(booking, slot)
    );
    
    const isEventDate = eventsDate.some(eventDate => eventDate.date === selectedDate);
    // console.log(isEventDate);
    return overlappingBookings.length > 0 || isEventDate;
  };

  const doSlotsOverlap = (slot1, slot2) => {
    const start1 = new Date(`${selectedDate} ${slot1.start_time}`);
    const end1 = new Date(`${selectedDate} ${slot1.end_time}`);
    const start2 = new Date(`${selectedDate} ${slot2.start_time}`);
    const end2 = new Date(`${selectedDate} ${slot2.end_time}`);
    return start1 < end2 && end1 > start2;
  };


  return (
    <div className='BookPool-body'>
      <div className='bookpool-container'>
      <div className='bookpool-container1'>
      <h2 className='BookPoolTitle'>Book Pool</h2>
      <input type="date" className='bookpool-calendar-input' onChange={(e) => handleDateSelect(e.target.value)} min={getMinDate()} />
      {selectedDate && (
        <div>
          <p>Available slots for {selectedDate}:</p>
          <div>
            {availableSlots.map((slot, index) => (
              <Slot
                key={index}
                slot={slot}
                handleSlotSelect={handleSlotSelect}
                selected={selectedSlots.some(
                  (selectedSlot) => selectedSlot.start_time === slot.start_time &&
                  selectedSlot.end_time === slot.end_time &&
                  selectedSlot.date === selectedDate
                )}
                disabled={isDisabledSlot(slot)}
              />
            ))}
          </div>
        </div>
      )}
      {selectedSlots.length > 0 && (
        <div className='bookpool-selected-slots'>
          <h3>Selected Slots:</h3>
          <ul>
            {selectedSlots.map((selectedSlot, index) => (
              <li key={index}>
                {selectedSlot.date} ({getDayFromDate(selectedSlot.date)}): {selectedSlot.start_time} - {selectedSlot.end_time}
              </li>
            ))}
          </ul>
        </div>
      )}

      {previousBookings.length > 0 && (
        <div>
          <h3>My Bookings:</h3>
          <ul>
            {previousBookings.map((booking, index) => (
              <li key={index}>
                {booking.date} ({getDayFromDate(booking.date)}): {booking.start_time} - {booking.end_time}
                <button className='bookpool-cancel-btn' onClick={() => handleCancelBtn(booking)}>Cancel</button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {selectedDate && <button className='bookpool-book-pool-btn' onClick={handleBookPoolBtn}>Book Pool</button>}
      <div>
          <Link to="/home" className='bookpool-back'><IoIosArrowBack /> Back </Link>
      </div>
    </div>
    </div>
    </div>
  );
}; 


export default BookPool;
