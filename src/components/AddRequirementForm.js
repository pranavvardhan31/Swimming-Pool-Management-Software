import React, { useState } from 'react';

function AddRequirementForm({ onAddRequirement, onClose }) {
    const [text, setText] = useState('');
    const [type, setType] = useState('text'); // Default to TEXT type
  
    const handleSubmit = (e) => {
      e.preventDefault();
  
      if (!text) {
        return alert('Please enter a text requirement.');
      }
  
      // Construct new requirement object
      const newRequirement = {
        label: text,
        type: type
      };
  
      // Pass newly added requirement to parent component
      onAddRequirement(newRequirement);
  
      // Clear form fields after successful submission
      setText('');
      setType('text'); // Reset type to TEXT after submission
      // Close the modal
      onClose();
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <h2>Add Requirement</h2>
        <label htmlFor="text">Label for Requirement:</label>
        <input
          type="text"
          id="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
        <label htmlFor="type">Requirement Type:</label>
        <select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="text">Text</option>
          <option value="date"> Date</option>
        </select>
        <div>
          <button type="submit">Add Requirement</button>
          {/* <button type="button" onClick={onClose}>Cancel</button> */}
        </div>
      </form>
    );
  
}

export default AddRequirementForm;
