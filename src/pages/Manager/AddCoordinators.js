import React from 'react';
import { Link } from 'react-router-dom';
import './AddCoordinators.css';

const AddCoordinators = () => {
  return (
    <div className="coordinators-container">
      <h1>Course Coordinators</h1>
      <div className="buttons-container">
        <Link to="/add">
          <button className="button">Add Course Coordinators</button>
        </Link>
        <Link to="/remove">
          <button className="button">Remove Course Coordinators</button>
        </Link>
      </div>
    </div>
  );
};

export default AddCoordinators;
