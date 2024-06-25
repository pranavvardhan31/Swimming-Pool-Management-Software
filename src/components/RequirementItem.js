import React from 'react'

export const RequirementItem = ({requirement}) => {
    const { label } = requirement; // Access only `text` for text requirements

    return (
      <li>
        <label htmlFor={`requirement-${requirement.id}`}>
          {requirement.id}. {label}
        </label>
        <input
          type="text"
          id={`requirement-${requirement.id}`}
           // Pre-fill with text from database
          disabled // Disable inputs for display purposes (optional)
        />
      </li>
    );
  
}
