import React, { useState ,useEffect} from 'react';
import Slot from '../../components/Slot';
import './BookSlots.css';
import axios from 'axios';
import { useAuth } from '../../AuthContext';
import { IoIosArrowBack } from "react-icons/io";
import { Link, Navigate } from 'react-router-dom';
import { GiConfirmed } from "react-icons/gi";


const BookSlots = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [disabledSlots, setDisabledSlots] = useState([]);
  const [availableSpecialSlots,setAvailableSpecialSlots] = useState([]);
  const [allSlots,setAllSlots] = useState([]);
  const [eventsDate,setEventsDate]= useState([]);

  const fetchPreviousBookings = async () => {
    try {
      const response = await axios.get(`https://xwqkcw08-8000.inc1.devtunnels.ms/slot_bookings`);
      setSelectedSlots(response.data);
      console.log(response.data);

    } catch (error) {
      console.error('Error fetching previous bookings:', error);
    }
  };


  const fetchAvailableSlots = async (date) => {
    try {
      const day = getDayFromDate(date);
      const response = await axios.get(`https://xwqkcw08-8000.inc1.devtunnels.ms/bookSlots?day=${day}`);
      const regularSlots = response.data;
      
      setAvailableSlots(regularSlots);
    } catch (error) {
      console.error('Error fetching available slots:', error);
    }
  };
  


  const fetchAvailableSpecialSlots = async (date) => {
    try {
      console.log(date);
      // const day=getDayFromDate(date);
      const response = await axios.get(`https://xwqkcw08-8000.inc1.devtunnels.ms/getSpecialSlts?date=${date}`);
      // console.log(response.data);
      setAvailableSpecialSlots(response.data);
      console.log(availableSpecialSlots);
      // console.log(date);
    } catch (error) {
      console.error('Error fetching available slots:', error);
    }
  };


  const fetchPoolBookings = async () => {
    try {
      const response = await axios.get(`https://xwqkcw08-8000.inc1.devtunnels.ms/pool_bookings`);
      setDisabledSlots(response.data);
    } catch (error) {
      console.error('Error fetching previous bookings:', error);
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
    // Fetch previous bookings when the component mounts
    fetchEvents();
    fetchPreviousBookings();
    fetchPoolBookings();
  }, []);


  const handleUpdateBtn = async () => {
    {setSelectedDate(null)}
    console.log(selectedSlots);
    try {
      await axios.post('https://xwqkcw08-8000.inc1.devtunnels.ms/update_bookings', selectedSlots);
      console.log('Slots updated successfully');
    } catch (error) {
      console.error('Error updating slots:', error);
    }
  };


  useEffect(() => {
    if (selectedDate) {
      // Fetch special slots first
      fetchAvailableSpecialSlots(selectedDate).then(() => {
        // Once special slots are fetched, fetch regular slots
        fetchAvailableSlots(selectedDate);
      });
    }
  }, [selectedDate]);

  useEffect(() => {
    if (selectedDate) {
      fetchAllSlots();
    }
  }, [selectedDate, availableSlots, availableSpecialSlots, disabledSlots]);

  
  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };
  
  
  
  const handleSlotSelect = (slot) => {
    const { start_time, end_time } = slot;
    const isSelected = selectedSlots.some(
      (selectedSlot) => selectedSlot.start_time === start_time && 
      selectedSlot.end_time === end_time &&   
      selectedSlot.date === selectedDate
    );
    const selectedSlotsThisWeek = selectedSlots.filter(
      (selectedSlot) => getWeekNumber(new Date(selectedSlot.date)) === getWeekNumber(new Date(selectedDate))
    );
    if (selectedSlotsThisWeek.length >= 5 && !isSelected) {
      alert("You can only select 5 slots per week.");
      return; // Do not proceed further if the limit is reached
    }
  
  
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
  

  const getWeekNumber = (date) => {
    const onejan = new Date(date.getFullYear(), 0, 1);
    return Math.ceil(((date - onejan) / 86400000 + onejan.getDay() + 1) / 7);
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
  
  const getDayFromDate = (dateString) => {
    if (!dateString) return ''; // Check if dateString is undefined
    const date = new Date(dateString);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  };

  const isDisabledSlot = (slot) => {
    // Check if the slot overlaps with any previous bookings on the selected date
    const overlappingBookings = disabledSlots.filter(
      (booking) => booking.date === selectedDate && doSlotsOverlap(booking, slot)
    );
    console.log(selectedDate);
    const isEventDate = eventsDate.some(eventDate => eventDate.date === selectedDate);
    console.log(isEventDate);
    return overlappingBookings.length > 0 || isEventDate;
  };

  const doSlotsOverlap = (slot1, slot2) => {
    const start1 = new Date(`${selectedDate} ${slot1.start_time}`);
    const end1 = new Date(`${selectedDate} ${slot1.end_time}`);
    const start2 = new Date(`${selectedDate} ${slot2.start_time}`);
    const end2 = new Date(`${selectedDate} ${slot2.end_time}`);
    return start1 < end2 && end1 > start2;
  };
  

  const today = new Date().toISOString().split('T')[0];


  // const allSlots = availableSlots.concat(
  //   availableSpecialSlots.filter((slot) => {
  //     if (slot.type_of_slot === 'add' && slot.date === selectedDate) {
  //       return true; // Include 'add' special slots as available slots
  //     } else if (slot.type_of_slot === 'delete' && slot.date === selectedDate) {
  //       return false; // Exclude 'delete' special slots for the selected date
  //     }
  //     return false; // Exclude other types of special slots
  //   })
  // );

  const fetchAllSlots= () =>{

    const specialSlotsAdd = availableSpecialSlots.filter(slot => slot.type_of_slot === 'add');
    const specialSlotsDelete = availableSpecialSlots.filter(slot => slot.type_of_slot === 'delete');
    const updatedRegularSlots = availableSlots.map(slot => {
    const isOverlappingDelete = specialSlotsDelete.some(specialSlot => doSlotsOverlap(specialSlot, slot));
      return { ...slot, disabled: isOverlappingDelete };
    });
    const allAvailableSlots = [...updatedRegularSlots, ...specialSlotsAdd];
    setAllSlots(allAvailableSlots);

  }

  // return (
  //   <div className='bookSlt'>
  //     <h1>Welcome {user.username}</h1>
  //     <h2>Book Slots</h2>
  //     <input type="date" className='calendar-input' onChange={(e) => handleDateSelect(e.target.value)} min={today} />
  //     {selectedDate && (
  //       <div>
  //         <p>Available slots for {selectedDate}:</p>
  //         <div>
  //           {allSlots.map((slot, index) => (
  //             <Slot
  //               key={index}
  //               slot={slot}
  //               selected={selectedSlots.some(
  //                 (selectedSlot) => selectedSlot.start_time === slot.start_time && 
  //                 selectedSlot.end_time === slot.end_time && 
  //                 selectedSlot.date === selectedDate
  //               )}
  //               disabled={slot.disabled || isDisabledSlot(slot)}

  //               handleSlotSelect={handleSlotSelect}
  //             />
  //           ))}
  //         </div>
  //       </div>
  //     )}
  //     {selectedSlots.length > 0 && (
  //       <div className='SelctedSlots'>
  //         <h3>Selected Slots:</h3>
  //         <ul>
  //           {selectedSlots.map((selectedSlot, index) => (
  //             <li key={index}>
  //               {selectedSlot.date} ({getDayFromDate(selectedSlot.date)}): {selectedSlot.start_time} - {selectedSlot.end_time}
  //             </li>
  //           ))}
  //         </ul>
  //       </div>
  //     )}
  //     {selectedDate && <button className='UpdatedSlt' onClick={handleUpdateBtn}>Update my slots</button>}
  //   </div>
  // );

  return (
    <div className='bookslot-container'>
        <div className='bookslot-container1'>
        <h2 className='bookslots-book'>Book Slots</h2>
        <input type="date" className='bookslot-calendar-input' onChange={(e) => handleDateSelect(e.target.value)} min={today} />
        {selectedDate && (
            <div>
                <p>Available slots for {selectedDate}:</p>
                <div>
                    {allSlots.map((slot, index) => (
                        <Slot
                            key={index}
                            slot={slot}
                            selected={selectedSlots.some(
                                (selectedSlot) => selectedSlot.start_time === slot.start_time &&
                                selectedSlot.end_time === slot.end_time &&
                                selectedSlot.date === selectedDate
                            )}
                            disabled={slot.disabled || isDisabledSlot(slot)}
                            handleSlotSelect={handleSlotSelect}
                        />
                    ))}
                </div>
            </div>
        )}
        {selectedSlots.length > 0 && (
            <div className='bookslot-selected-slots'>
                <h3>Selected Slots <GiConfirmed />:</h3>
                <ul>
                    {selectedSlots.map((selectedSlot, index) => (
                        <li key={index}>
                            {selectedSlot.date} ({getDayFromDate(selectedSlot.date)}): {selectedSlot.start_time} - {selectedSlot.end_time}
                        </li>
                    ))}
                </ul>
            </div>
        )}
        {selectedDate && <button className='bookslot-update-btn' onClick={handleUpdateBtn}>Update my slots</button>}
        <div>
          <Link to="/home" className='bookslots-back'><IoIosArrowBack /> Back </Link>
        </div>
        </div>
    </div>
);
};

export default BookSlots;
