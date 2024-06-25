import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Approvals.css'; // Import the CSS file for styling
// import { Link } from 'react-router-dom';

const Approvals = () => {
  const [approvals, setApprovals] = useState([]);
  const [labels, setLabels] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [reason, setReason] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [selectedApprovalId, setSelectedApprovalId] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');


  useEffect(() => {
    // Fetch all user approvals from the backend
    axios.get(`https://xwqkcw08-8000.inc1.devtunnels.ms/user-approvals`)
      .then(res => {
        setApprovals(res.data);
        fetchUserInfoForApprovals(res.data); 
      })

      .catch(error => {
        console.error('Error fetching user approvals:', error);
      });
    fetchLabels();
  }, []);


  const fetchUserInfoForApprovals = async (approvalsData) => {
    const userInfoPromises = approvalsData.map(approval => fetchUserInfo(approval.user_id));
    Promise.all(userInfoPromises)
      .then(userInfos => {
        // Update userInfo using the previous state to avoid overwriting
        setUserInfo(prevUserInfo => ({
          ...prevUserInfo,
          ...Object.assign({}, ...userInfos)
        }));
      })
      .catch(error => {
        console.error('Error fetching user info for approvals:', error);
      });
  };


  const fetchUserInfo = async (user_id) => {
    try {
      const response = await axios.get(`https://xwqkcw08-8000.inc1.devtunnels.ms/user-info?userId=${user_id}`);
      return { [user_id]: response.data }; // Using user_id as key for userInfo object
    } catch (error) {
      console.error('Error fetching user info:', error);
      return {};
    }
  };

  const fetchLabels = async () => {
    try {
      const res = await axios.get('https://xwqkcw08-8000.inc1.devtunnels.ms/labels');
      setLabels(res.data);
    } catch (error) {
      console.error('Error fetching labels:', error);
    }
  };

  const handleApproveTheMemBtn = async (approvalId, userId) => {
    try {
      await axios.put(`https://xwqkcw08-8000.inc1.devtunnels.ms/approve-membership/${userId}`);
      setApprovals(prevApprovals => prevApprovals.filter(approval => approval.id !== approvalId));
      await axios.delete(`https://xwqkcw08-8000.inc1.devtunnels.ms/delete-approval/${approvalId}`);
    } catch (error) {
      console.error('Error approving membership:', error);
    }
  };

  const handleDisapprove = (approvalId,user_id) => {
    setSelectedApprovalId(approvalId);
    setSelectedUserId(user_id);
    setShowPopup(true);
  };

  const handlePopupConfirm = async () => {
    // console.log(disapproved);
    try {
      // Send notification with reason for disapproval
      await axios.post('https://xwqkcw08-8000.inc1.devtunnels.ms/notifications', {
        userId: selectedUserId,
        message: `Your Approval has not been aproved due to : \n\n\n ${reason}`,
      });

      await axios.delete(`https://xwqkcw08-8000.inc1.devtunnels.ms/delete-approval/${selectedApprovalId}`);
      setApprovals(prevApprovals => prevApprovals.filter(approval => approval.id !== selectedApprovalId));
      setShowPopup(false);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  const handlePopupCancel = () => {
    setShowPopup(false);
    setReason('');
  };

  return (
    <div className='approvals-background'>
      <nav className="manager-navbar">
              <ul className="manager-nav-links">
                  <li><Link to="/managerHome" className="manager-nav-link">Home </Link></li>
                  <li><Link to="/managerHome/changeRequirements" className='manager-nav-link'>Modify Membership Requirements </Link></li>
                  <li><Link to="/managerHome/approvals" className="nav-approvals">Approvals </Link></li>
                  {/* <li><Link to="/managerHome/addCoordinators" className="manager-nav-link">Course Coordinators</Link></li> */}
                  <li><Link to="/managerHome/organizeEvents" className="manager-nav-link">Organize Events </Link></li>
                  <li><Link to="/managerHome/manageSlots" className="manager-nav-link">Manage Slots </Link></li>
                  <li><Link to="/managerHome/notices" className="manager-nav-link">Add Notice </Link></li>
                  <li><Link to="/managerHome/cancelreasons" className="manager-nav-link">Cancel Reasons</Link></li>
                  <li><Link to="/managerHome/managerProfile" className="manager-nav-link">Profile </Link></li>
              </ul>
              </nav>
      <div className="approvals-container">

        <h2 className="approvals-heading">Membership  Approvals</h2>
        {approvals.map(approval => (
          <div key={approval.id} className="approval-card">
            <h3 className="approval-id">Approval ID: {approval.id}</h3>
            <p className="approval-info"><strong>Name</strong>: {userInfo[approval.user_id] && userInfo[approval.user_id].username}</p>
            <p className="approval-info"><strong>Email</strong>: {userInfo[approval.user_id] && userInfo[approval.user_id].email}</p>
            <p className="approval-info"><strong>Approval Date</strong>: {approval.approval_date}</p>
            {labels.map(label => (
              <p key={label} className="approval-info"><strong>{label.replace(/_/g, ' ')}</strong>: {approval[label]}</p>
            ))}
            <button className="approve-btn" onClick={() => handleApproveTheMemBtn(approval.id, approval.user_id)}>Approve Membership</button>
            <button className="disapprove-btn" onClick={() => handleDisapprove(approval.id,approval.user_id)}>Disapprove Membership</button>
          </div>
        ))}
        {showPopup && (
          <div className="popup">
            <h2 className="popup-heading">Confirm Disapproval</h2>
            <label htmlFor="reason" className="popup-label">Reason:</label>
            <input type="text" id="reason" className="popup-input" value={reason} onChange={(e) => setReason(e.target.value)} />
            <div className="popup-buttons">
              <button className="popup-confirm-btn" onClick={handlePopupConfirm}>Confirm Disapprove</button>
              <button className="popup-cancel-btn" onClick={handlePopupCancel}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Approvals;
