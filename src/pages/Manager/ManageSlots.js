import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Slot from '../../components/Slot';
import { Link } from 'react-router-dom';
import { IoIosArrowBack } from "react-icons/io";

const ManageSlots = () => {
    const [slots, setSlots] = useState([]);
    const [message, setMessage] = useState('');
    const [slotsForSelectedDay, setSlotsForSelectedDay] = useState([]);
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [specialSlots,setSpecialSlots] = useState([]);

    // const [showAddSlot,setShowAddSlot]= useState(null);
    
    const [showFunction,setShowFunction] = useState(0);
    const [newSlot, setNewSlot] = useState({
        day: '',
        startTime: '',
        endTime: ''
    });
    const [selectedDate,setSelectedDate] = useState('');

    useEffect(() => {
        fetchSlots();
        fetchSpecialSlots();
    }, [showFunction,specialSlots]);

    const fetchSlots = async () => {
        try {
            const response = await axios.get('https://xwqkcw08-8000.inc1.devtunnels.ms/slots');
            setSlots(response.data.slots || []);
        } catch (error) {
            console.error('Error fetching slots:', error);
        }
    };

    const fetchSpecialSlots = async () => {
        try {
            const response = await axios.get('https://xwqkcw08-8000.inc1.devtunnels.ms/specialSlots');
            setSpecialSlots(response.data.slots || []);
        } catch (error) {
            console.error('Error fetching slots:', error);
        }
    }

    const groupSlotsByDay = () => {
        const groupedSlots = {};
        slots.forEach(slot => {
            const day = slot.day;
            if (!groupedSlots[day]) {
                groupedSlots[day] = [];
            }
            groupedSlots[day].push(slot);
        });
        return groupedSlots;
    };

    const getTimeFromString = (timeString) => {
        const [time, meridiem] = timeString.split(' '); // Split the time and meridiem (AM/PM)
        let [hours, minutes] = time.split(':').map((value) => parseInt(value));
        
        // Adjust hours for PM times
        if (meridiem === 'PM' && hours !== 12) {
            hours += 12;
        } else if (meridiem === 'AM' && hours === 12) {
            hours = 0;
        }
    
        return hours * 60 + minutes; // Convert hours and minutes to total minutes
    };

    const renderSlotsByDay = () => {
        const groupedSlots = groupSlotsByDay();
        return Object.keys(groupedSlots).map(day => (
            // <div key={day}>
            //     <h2>{day}</h2>
            //     <ul>

            //         {groupedSlots[day]
            //         .sort((a, b) => {
            //             // Convert time strings to Date objects for comparison
            //             const timeA = getTimeFromString(a.start_time)
            //             const timeB = getTimeFromString(b.start_time)
            //             return timeA - timeB;
            //         })
            //         .map((slot, index) => (
            //             <li key={index}>{slot.start_time} - {slot.end_time}</li>
            //         ))
            //     }
            //     </ul>
            // </div>
            <div key={day}>
            <h2>{day}</h2>
            <ul style={{ listStyleType: 'none' }}> {/* Add inline style to remove list item bullets */}
                {groupedSlots[day]
                    .sort((a, b) => {
                        // Convert time strings to Date objects for comparison
                        const timeA = getTimeFromString(a.start_time)
                        const timeB = getTimeFromString(b.start_time)
                        return timeA - timeB;
                    })
                    .map((slot, index) => (
                        <li key={index}>{slot.start_time} - {slot.end_time}</li>
                    ))}
            </ul>
        </div>

                ));
    };

    const renderSpecialSlots= () => {
        const addSlots = specialSlots.filter(slot => slot.type_of_slot === 'add');
        const deleteSlots = specialSlots.filter(slot => slot.type_of_slot === 'delete');

        return (
            <div>
            <h3>Added Special Slots</h3>
            <ul style={{ listStyleType: 'none' }}>
                {addSlots.map((slot, index) => (
                    <li key={index}>
                        {slot.date} ({slot.day_of_the_week}): {slot.start_time} - {slot.end_time}
                        <button onClick={() => handleRemoveSpecialSlot(index)} className='remove-slot-btn'>Remove</button>
                    </li>
                ))}
            </ul>

            <h3>Deleted Slots</h3>
            <ul style={{ listStyleType: 'none' }}>
                {deleteSlots.map((slot, index) => (
                    <li key={index}>
                        {slot.date} ({slot.day_of_the_week}): {slot.start_time} - {slot.end_time}
                        <button onClick={() => handleRemoveSpecialSlot(slot.id,index)} className='remove-slot-btn'>Remove</button>
                    </li>
                ))}
            </ul>
        </div>

        );
    };
    
    const handleRemoveSpecialSlot = async (slotID,index) => {
        try {
            // const slotToRemove = specialSlots[index];
            const response = await axios.delete(`https://xwqkcw08-8000.inc1.devtunnels.ms/deleteSlot/${slotID}`);
            console.log(response.data); // Log response data for debugging
            // Remove the slot from the specialSlots state
            const updatedSpecialSlots = specialSlots.filter((slot, i) => i !== index);
            setSpecialSlots(updatedSpecialSlots);
        } catch (error) {
            console.error('Error removing special slot:', error);
            setMessage('Error removing special slot');
        }
    };


    const getSlotsByDay = (day) =>{
        const groupedSlots = groupSlotsByDay();
        const selectedDaySlots = groupedSlots[day] || [];
        selectedDaySlots
                    .sort((a, b) => {
                        // Convert time strings to Date objects for comparison
                        const timeA = getTimeFromString(a.start_time)
                        const timeB = getTimeFromString(b.start_time)
                        return timeA - timeB;
                    })

        console.log(selectedDaySlots);
        return selectedDaySlots;
        // Check if slots exist for the selected day
        // setSlotsForSelectedDay(selectedDaySlots);
        // console.log(slotsForSelectedDay);
    }
    
    const addSlot = async () => {
       setShowFunction(1);
    };

    const addSlotOnDay = async () => {
        setShowFunction(2);
    };

    const deleteSlots = async () => {
        setShowFunction(3);
        setSelectedSlots([]);
    };

    const deleteSlotOnDay = async () => {
        setShowFunction(4);
        setSelectedSlots([]);
    };

    const checkSlotOverlap = (newSlot, existingSlots) => {
        const startTime = getTimeFromString(newSlot.startTime);
        const endTime = getTimeFromString(newSlot.endTime);
    
        for (const slot of existingSlots) {
            const slotStartTime = getTimeFromString(slot.start_time);
            const slotEndTime = getTimeFromString(slot.end_time);
    
            if (
                (startTime >= slotStartTime && startTime < slotEndTime) ||
                (endTime > slotStartTime && endTime <= slotEndTime) ||
                (startTime <= slotStartTime && endTime >= slotEndTime)
            ) {
                // Overlapping slot found
                return true;
            }
        }
    
        // No overlapping slot found
        return false;
    };

    const getDayFromDate = (dateString) => {
        if (!dateString) return ''; // Check if dateString is undefined
        const date = new Date(dateString);
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[date.getDay()];
      };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewSlot(prevState => ({
            ...prevState,
            [name]: value
        }));

        if (name === 'day') {
            // const selectedDaySlots = getSlotsByDay[value] || [];
            const slotsForDay = getSlotsByDay(value);
            setSlotsForSelectedDay(getSlotsByDay(value));
            console.log(slotsForSelectedDay);
        }
    
    };

    const handleSlotSelection = (slot) => {
        // Check if the slot is already selected
        if (isSelected(slot)) {
            // If selected, remove it from the list
            setSelectedSlots(selectedSlots.filter(selectedSlot => selectedSlot.id !== slot.id));
        } else {
            // If not selected, add it to the list
            setSelectedSlots([...selectedSlots, {...slot ,  date:selectedDate }]);
            setSelectedSlots(prevSelectedSlots => {
                return prevSelectedSlots.sort((a, b) => {
                    // Compare dates first
                    const dateComparison = new Date(a.date) - new Date(b.date);
                    if (dateComparison !== 0) {
                        return dateComparison;
                    }
                    // If dates are equal, compare times
                    const timeComparison = getTimeFromString(a.start_time) - getTimeFromString(b.start_time);
                    return timeComparison;
                });
            });
        
        }
    };

    const isSelected = (slot) => {
        return selectedSlots.some(selectedSlot => selectedSlot.id === slot.id);
    };
    
    const handleAddSlotSubmit = async (e) => {
        e.preventDefault();
        if(newSlot.day === '' || newSlot.startTime === '' || newSlot.endTime === ''){
            alert("Please fill all the requirements.")
            return;
        }   

        const isOverlapping = checkSlotOverlap(newSlot, slotsForSelectedDay);
        if (isOverlapping) {
            alert("The slot overlaps with existing slots. Please choose a different time.");
            return;
        }

        try {
            const response = await axios.post('https://xwqkcw08-8000.inc1.devtunnels.ms/addslot', newSlot);
            console.log(response.data); // Log response data for debugging
            // setMessage('Slot added successfully');
            // Reset form fields
            setNewSlot({
                day: '',
                startTime: '',
                endTime: ''
            });
            alert("Slot Added sucesfully");
            setShowFunction(0);
        } catch (error) {
            console.error('Error adding slot:', error);
            setMessage('Error adding slot');
        }
    };

    const handleAddSlotOnDaySubmit = async (e) => {
        e.preventDefault();
        if (selectedDate === '' || newSlot.startTime === '' || newSlot.endTime === '') {
            alert("Please fill all the requirements.")
            return;
        }

        const day = getDayFromDate(selectedDate);
        const slotsForDay = getSlotsByDay(day);
        const isOverlapping = checkSlotOverlap(newSlot, slotsForDay);
        if (isOverlapping) {
            alert("The slot overlaps with existing slots. Please choose a different time.");
            return;
        }

        try {
            const slot = {
                day:newSlot.day,
                date: selectedDate,
                startTime: newSlot.startTime,
                endTime : newSlot.endTime
            }
            const response = await axios.post('https://xwqkcw08-8000.inc1.devtunnels.ms/addSlotOnDay', slot);
            console.log(response.data); // Log response data for debugging
            setNewSlot({
                day: '',
                startTime: '',
                endTime: ''
            });
            alert("Slot Added successfully");
            setShowFunction(0);
        } catch (error) {
            console.error('Error adding slot:', error);
            setMessage('Error adding slot');
        }
    };

    const handleDeleteSlots = async () => {
    const slotIds = selectedSlots.map(slot => slot.id);
    if(slotIds.length === 0 ){
        alert("Select slots to be deleted.");
        return;
    }
    try {
        const response = await axios.post('https://xwqkcw08-8000.inc1.devtunnels.ms/deleteSlots', { slotIds });
        console.log(response.data); // Log response data for debugging
        // Optionally, reset selectedSlots state
        setSelectedSlots([]);
        setNewSlot({
            day: '',
            startTime: '',
            endTime: ''
        });
        alert("Slots Deleted successfully.");
        setShowFunction(0);
    } catch (error) {
        console.error('Error deleting slots:', error);
        setMessage('Error deleting slots');
    }
    console.log(selectedSlots);
    };

const handleDeleteSlotOnDay = async () => {
    if(selectedSlots.length === 0){
        alert("Select slots to be deleted");
        return;
    }
    console.log(selectedSlots);
    try {
        const response = await axios.post('https://xwqkcw08-8000.inc1.devtunnels.ms/deleteSlotsOnDay', selectedSlots);
        console.log(response.data); // Log response data for debugging
        // Clear selected slots after successful deletion
        setSelectedSlots([]);
        alert("Selected slots deleted successfully");
        setShowFunction(0);
    } catch (error) {
        console.error('Error deleting slots:', error);
        alert("Error deleting slots");
    }


}
    
const handleCancelBtn = () =>{
        setShowFunction(0);
        setNewSlot({
            day: '',
            startTime: '',
            endTime: ''
        });
        setSelectedDate('');
}

const today = new Date().toISOString().split('T')[0];



    return (
        <div className='manage-background'>
        <nav className="manager-navbar">
              <ul className="manager-nav-links">
                  <li><Link to="/managerHome" className="manager-nav-link">Home </Link></li>
                  <li><Link to="/managerHome/changeRequirements" className='manager-nav-link'>Modify Membership Requirements </Link></li>
                  <li><Link to="/managerHome/approvals" className='manager-nav-link'>Approvals </Link></li>
                  {/* <li><Link to="/managerHome/addCoordinators" className="manager-nav-link">Course Coordinators</Link></li> */}
                  <li><Link to="/managerHome/organizeEvents" className="manager-nav-link">Organize Events </Link></li>
                  <li><Link to="/managerHome/manageSlots" className="nav-manage">Manage Slots </Link></li>
                  <li><Link to="/managerHome/notices" className="manager-nav-link">Add Notice </Link></li>
                  <li><Link to="/managerHome/cancelreasons" className="manager-nav-link">Cancel Reasons</Link></li>
                  <li><Link to="/managerHome/managerProfile" className="manager-nav-link">Profile </Link></li>
              </ul>
              </nav>
        <div className='ManageSlots-container'>
            {showFunction === 0 && 
            <div>
                <h1>Manage Slots</h1>
                {renderSlotsByDay()}
                {renderSpecialSlots()}
                <button onClick={addSlot} className='manage-btn'>Add Slot</button>
                <button onClick={addSlotOnDay} className='manage-btn'>Add Slot on a Particular Day</button>
                <button onClick={deleteSlots} className='manage-btn'>Delete Slots</button>
                <button onClick={deleteSlotOnDay} className='manage-btn'>Delete Slot on a Particular Day</button>
                {/* {message && <p>{message}</p>} */}

                </div>
            }
            
            {showFunction === 1 && 
                <div className='addslot-manage'>
                    <h1>Add Slot</h1>
                <form onSubmit={handleAddSlotSubmit}>
                <label>
                    Day:
                    <select name="day" value={newSlot.day} onChange={handleInputChange}>
                        <option value="">Select Day</option>
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Friday">Friday</option>
                        <option value="Saturday">Saturday</option>
                        <option value="Sunday">Sunday</option>
                    </select>
                </label>

                {newSlot.day !== '' && (
                    <ul>
                        {slotsForSelectedDay.map((slot, index) => (
                            <li key={index}>{slot.start_time} - {slot.end_time}</li>
                        ))}
                    </ul>
                )}

                <label>
                    Start Time:
                    <input type="text" name="startTime" placeholder='HH:MM AM/PM' value={newSlot.startTime} onChange={handleInputChange} />
                </label>
                <label>
                    End Time:
                    <input type="text" name="endTime" placeholder='HH:MM AM/PM' value={newSlot.endTime} onChange={handleInputChange} />
                </label>
                <button type="submit" className='manage-btn'>Add Slot</button>
                <button type ="button" onClick={handleCancelBtn} className='manage-btn'>Cancel</button>
            </form>
            </div>
            }
            {showFunction === 2 && 
            <div className='addslotonaday-manage'>
                <h1>Add Slot on a Day</h1>
                <form onSubmit={handleAddSlotOnDaySubmit}>
                <label>
                    Date:
                        <input type='date' name="date" value={selectedDate}  min={today}  onChange={(e) => {setSelectedDate(e.target.value)
                        newSlot.day=getDayFromDate(e.target.value);
                        setSlotsForSelectedDay(getSlotsByDay(newSlot.day));
                        console.log(newSlot);
                        }}></input>
                </label>
                <label> Day: {newSlot.day}</label>
                {newSlot.day !== '' && (
                    <ul>
                        {slotsForSelectedDay.map((slot, index) => (
                            <li key={index}>{slot.start_time} - {slot.end_time}</li>
                        ))}
                    </ul>
                )}

                <label>
                    Start Time:
                    <input type="text" placeholder='HH:MM AM/PM' name="startTime" value={newSlot.startTime} onChange={handleInputChange} />
                </label>
                <label>
                    End Time:
                    <input type="text" name="endTime" placeholder='HH:MM AM/PM' value={newSlot.endTime} onChange={handleInputChange} />
                </label>
                <button type="submit" className='manage-btn'>Add Slot</button>
                <button type ="button" onClick={handleCancelBtn} className='manage-btn'>Cancel</button>
            </form>
            </div>
            }
            {showFunction ===3 && 
                <div className='addslot-manage'>
                    <h1>Delete slots</h1>
                    <label>
                    Day:
                    <select name="day" value={newSlot.day} onChange={handleInputChange}>
                        <option value="">Select Day</option>
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Friday">Friday</option>
                        <option value="Saturday">Saturday</option>
                        <option value="Sunday">Sunday</option>
                    </select>
                </label>
                {newSlot.day !== '' && (
                    <div>
                        <h3>Select the slots to be deleted</h3>
                        <ul>
                            {slotsForSelectedDay.map((slot, index) => (
                                <Slot
                                    key={index}
                                    slot={slot}
                                    handleSlotSelect={handleSlotSelection}
                                    selected={selectedSlots.some(
                                    (selectedSlot) => selectedSlot.start_time === slot.start_time && 
                                    selectedSlot.end_time === slot.end_time && 
                                    selectedSlot.day === slot.day
                                    )}
                                    // disabled={isDisabledSlot(slot)}
                              />
                            ))}
                        </ul>
                    </div>
                )}
                {
                    <div>
                        {selectedSlots.length >0 && <h3>Selected Slots:</h3>}
                        <ul>
                        {selectedSlots.map((slot,index) => {
                            return <li key={index}> {slot.day} : {slot.start_time} - {slot.end_time}</li>
                        })}
                        </ul>
                    </div>
                }
                    {newSlot.day && <button onClick={handleDeleteSlots} className='manage-btn'>Delete Selected Slots</button>}
                    {<button type ="button" onClick={handleCancelBtn} className='manage-btn'>Cancel</button>}
                </div>
            }
            {showFunction === 4 && 
            <div className='addslot-manage'>
                <h1>Delete slot on a day</h1>
                <label>
                    Date:
                        <input type='date' name="date" value={selectedDate}  min={today} onChange={(e) => {setSelectedDate(e.target.value)
                        newSlot.day=getDayFromDate(e.target.value);
                        setSlotsForSelectedDay(getSlotsByDay(newSlot.day));
                        console.log(newSlot);
                        }}></input>
                </label>
                <label> Day: {newSlot.day}</label>
                {newSlot.day !== '' && (
                    <div>
                        <h3>Select slots be deleted</h3>
                        <ul>
                        {slotsForSelectedDay.map((slot, index) => (
                            <Slot
                                key={index}
                                slot={slot}
                                handleSlotSelect={handleSlotSelection}
                                selected={selectedSlots.some(
                                (selectedSlot) => selectedSlot.start_time === slot.start_time && 
                                selectedSlot.end_time === slot.end_time && 
                                selectedSlot.date === selectedDate
                                )}
                        />
                        ))}
                    </ul>
                </div>
                )}
                {
                    <div>
                        {selectedSlots.length >0 && <h3>Selected Slots:</h3>}
                        <ul>
                        {selectedSlots.map((slot,index) => {
                            return <li key={index}> {slot.date}({slot.day}) : {slot.start_time} - {slot.end_time}</li>
                        })}
                        </ul>
                    </div>
                }

            
                <button type="button" onClick={handleDeleteSlotOnDay} className='manage-btn'>Delete slots</button>
                <button type ="button" onClick={handleCancelBtn} className='manage-btn'>Cancel</button>
            </div>
            }
            
        </div>
        </div>
    );
        };

export default ManageSlots;
