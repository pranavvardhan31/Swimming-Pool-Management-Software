import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ManagerProfile.css';
import EditProfile from '../../components/EditProfile';
import ChangePassword from '../../components/ChangePassword';
// import Slot from '../../components/Slot';
import {Link} from 'react-router-dom';

function ManagerProfile() {
  const [userInfo, setUserInfo] = useState({});
  const [activeComponent, setActiveComponent] = useState('user-info'); // Default active component


  useEffect(() => {
    fetchUserData(); // Assuming user ID is 1, change as needed
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`https://xwqkcw08-8000.inc1.devtunnels.ms/userInfo`);
      setUserInfo(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  return (
    <div className='manager-profile'>
    <nav className="manager-navbar">
            <ul className="manager-nav-links">
                <li><Link to="/managerHome" className="manager-nav-link">Home </Link></li>
                <li><Link to="/managerHome/changeRequirements" className="manager-nav-link">Modify Membership Requirements </Link></li>
                <li><Link to="/managerHome/approvals" className="manager-nav-link">Approvals </Link></li>
                {/* <li><Link to="/managerHome/addCoordinators" className="manager-nav-link">Course Coordinators</Link></li> */}
                <li><Link to="/managerHome/organizeEvents" className="manager-nav-link">Organize Events </Link></li>
                <li><Link to="/managerHome/manageSlots" className="manager-nav-link">Manage Slots </Link></li>
                <li><Link to="/managerHome/notices" className="manager-nav-link">Add Notice </Link></li>
                <li><Link to="/managerHome/cancelreasons" className="manager-nav-link">Cancel Reasons</Link></li>
                <li><Link to="/managerHome/managerProfile" className="nav-profile">Profile </Link></li>
            </ul>
            </nav>
    <div className="flex">
      {/* Sidebar */}
      <div className="manager-sidebar">
      <ul style={{ listStyleType: 'none' }}>
         
        <li><button className = {`manager-sidebar-btn ${activeComponent === 'user-info' ? 'active' : ''}`} onClick={() => setActiveComponent('user-info')} >User Information</button> </li>
        <li><button className={`manager-sidebar-btn ${activeComponent === 'edit-profile' ? 'active' : ''}`} onClick={() => setActiveComponent('edit-profile')}>Edit Profile</button></li>
        <li><button className={`manager-sidebar-btn ${activeComponent === 'change-password' ? 'active' : ''}`} onClick={() => setActiveComponent('change-password')}>Change Password</button></li>
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

        {activeComponent === 'edit-profile' && <EditProfile userInfo={userInfo} setUserInfo={setUserInfo} />}


        {activeComponent === 'change-password' && <ChangePassword />}
      </div>
    </div>
    </div>
  );
}

export default ManagerProfile;
