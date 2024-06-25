
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Notices.css'
import { Link ,useNavigate} from 'react-router-dom';

const Notices = () => {
  const [notices, setNotices] = useState([]);
  const [newNotice, setNewNotice] = useState('');

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const response = await axios.get('https://xwqkcw08-8000.inc1.devtunnels.ms/notices');
      setNotices(response.data);
    } catch (error) {
      console.error('Error fetching notices:', error);
    }
  };

  const handleNoticeSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('https://xwqkcw08-8000.inc1.devtunnels.ms/notices', {
        notice: newNotice
      });
      console.log('New notice created:', response.data);
      setNewNotice('');
      fetchNotices();
    } catch (error) {
      console.error('Error creating notice:', error);
    }
  };

  const handleNoticeDelete = async (id) => {
    try {
      await axios.delete(`https://xwqkcw08-8000.inc1.devtunnels.ms/notices/${id}`);
      console.log('Notice deleted successfully');
      fetchNotices();
    } catch (error) {
      console.error('Error deleting notice:', error);
    }
  };

  return (
    <div className="add-notices-container">
    <nav className="manager-navbar">
          <ul className="manager-nav-links">
            <li><Link to="/managerHome" className="manager-nav-link">Home </Link></li>
            <li><Link to="/managerHome/changeRequirements" className='manager-nav-link'>Modify Membership Requirements </Link></li>
            <li><Link to="/managerHome/approvals" className="manager-nav-link">Approvals </Link></li>
            {/* <li><Link to="/managerHome/addCoordinators" className="manager-nav-link">Course Coordinators</Link></li> */}
            <li><Link to="/managerHome/organizeEvents" className="manager-nav-link">Organize Events </Link></li>
            <li><Link to="/managerHome/manageSlots" className="manager-nav-link">Manage Slots </Link></li>
            <li><Link to="/managerHome/notices" className="nav-add-notice">Add Notice </Link></li>
            <li><Link to="/managerHome/cancelreasons" className="manager-nav-link">Cancel Reasons</Link></li>
            <li><Link to="/managerHome/managerProfile" className="manager-nav-link">Profile </Link></li>
          </ul>
        </nav>
      <h2>Manager Notices</h2>
      <form className="add-notice-form" onSubmit={handleNoticeSubmit}>
        <textarea
          className="add-notice-textarea"
          value={newNotice}
          onChange={(e) => setNewNotice(e.target.value)}
          placeholder="Write your notice here..."
          rows="4"
          cols="50"
          required
        ></textarea>
        <br />
        <button className="add-notice-btn" type="submit">Add Notice</button>
      </form>
      <h3>Notices:</h3>
      <ul className="add-notice-list">
        {notices.map(notice => (
          <li className="add-notice-item" key={notice.id}>
            <div>
              <p>{notice.notice}</p>
              <p>Date Posted: {notice.date_posted}</p>
            </div>
            <button className="delete-notice-btn" onClick={() => handleNoticeDelete(notice.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
  

export default Notices;
