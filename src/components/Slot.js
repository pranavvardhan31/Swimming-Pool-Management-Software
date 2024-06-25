import React from 'react';
import './Slot.css';

const Slot = ({ slot, selected, disabled, handleSlotSelect }) => {
  const handleClick = () => {
    if (!disabled) {
      handleSlotSelect(slot);
    }
  };

  return (
    <div
      className={`slot  ${disabled ? 'disabled' : ''} ${selected ? 'selected' : ''}`}
      onClick={handleClick}
    >
      {slot.start_time} - {slot.end_time}
    </div>
  );
};

export default Slot;
