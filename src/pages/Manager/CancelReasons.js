import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CancelReason.css'
import { Link ,useNavigate} from 'react-router-dom';

const CancelReasons = () => {
  const [cancelReasons, setCancelReasons] = useState([]);
  const getUserInfo = async (userId) => {
    try {
      const response = await axios.get(`https://xwqkcw08-8000.inc1.devtunnels.ms/user-info?userId=${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user information:', error);
      return { username: 'N/A', email: 'N/A' }; 
    }
  };

  useEffect(() => {
    const fetchCancelReasons = async () => {
      try {
        const response = await axios.get('https://xwqkcw08-8000.inc1.devtunnels.ms/cancelreasons');
        const reasonsWithUserInfo = await Promise.all(
          response.data.map(async (reason) => ({
            ...reason,
            userInfo: await getUserInfo(reason.user_id),
          }))
        );
        setCancelReasons(reasonsWithUserInfo);
      } catch (error) {
        console.error('Error fetching cancel reasons:', error);
      }
    };
    fetchCancelReasons();
  }, []);


  return (
    <div className='cancel-background'>
        <nav className="manager-navbar">
            <ul className="manager-nav-links">
                <li><Link to="/managerHome" className="manager-nav-link">Home </Link></li>
                <li><Link to="/managerHome/changeRequirements" className='manager-nav-link'>Modify Membership Requirements </Link></li>
                <li><Link to="/managerHome/approvals" className="manager-nav-link">Approvals </Link></li>
                {/* <li><Link to="/managerHome/addCoordinators" className="manager-nav-link">Course Coordinators</Link></li> */}
                <li><Link to="/managerHome/organizeEvents" className="manager-nav-link">Organize Events </Link></li>
                <li><Link to="/managerHome/manageSlots" className="manager-nav-link">Manage Slots </Link></li>
                <li><Link to="/managerHome/notices" className="manager-nav-link">Add Notice </Link></li>
                <li><Link to="/managerHome/cancelreasons" className="nav-cancel">Cancel Reasons</Link></li>
                <li><Link to="/managerHome/managerProfile" className="manager-nav-link">Profile </Link></li>
            </ul>
            </nav>
        <div className="cancel-reasons-container">
        <h1>Cancel Reasons</h1>
        <table className="cancel-reasons-table">
            <thead>
            <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Reason</th>
                <th>Comment</th>
            </tr>
            </thead>
            <tbody>
            {cancelReasons.map((reason, index) => (
                <tr key={index}>
                <td>{reason.userInfo.username}</td>
                <td>{reason.userInfo.email}</td>
                <td>{reason.reason}</td>
                <td>{reason.comment}</td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    </div>
  );
};

export default CancelReasons;
