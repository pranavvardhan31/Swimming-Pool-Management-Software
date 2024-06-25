// MemberHome.js

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './MemberHome.css';
import { useAuth } from '../../AuthContext';
import axios from 'axios';

const MemberHome = ({ handleLogout }) => {
    const { user } = useAuth();
    const [userRole, setUserRole] = useState(null);
    const [approved, setApproved] = useState(null);
    const [notices, setNotices] = useState([]);
    const [newNotifications, setNewNotifications] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('https://xwqkcw08-8000.inc1.devtunnels.ms/getUserRole')
            .then(response => {
                const { role, approved } = response.data;
                setUserRole(role);
                setApproved(approved);
                // console.log(userRole);
            })
            .catch(error => {
                console.error('Error fetching user role:', error);
            });
            console.log(user);
    }, []);

    useEffect(() => {
        fetchNotices();
        fetchNotifications();
    }, []);

    useEffect(() => {
        if (!user) {
            console.log("Going to login page.")
            navigate('/');
        }
    }, [user, navigate]);

    if (!user) {
        return null;
    }

    const handleBookSlots = () => {
        if (user.role === 'member') {
            navigate('/memberHome/bookSlots');
        } else {
            alert('You need to be a member to Book Slots.');
        }
    };

    const handleBookPool = () => {
        if (user.role === 'member') {
            navigate('/memberHome/bookPool');
        } else {
            alert('You need to be a member to Book Pool.');
        }
    };

    const fetchNotices = async () => {
        try {
            const response = await axios.get('https://xwqkcw08-8000.inc1.devtunnels.ms/notices');
            setNotices(response.data);
        } catch (error) {
            console.error('Error fetching notices:', error);
        }
    };

    const fetchNotifications = () => {
        axios.get(`https://xwqkcw08-8000.inc1.devtunnels.ms/newNotifications`)
            .then(response => {
                const { user_specific, general } = response.data;
                // Merge user-specific and general notifications
                const mergedNotifications = [...user_specific, ...general];
                // Sort notifications by date in descending order
                mergedNotifications.sort((a, b) => new Date(b.date_posted) - new Date(a.date_posted));
                // Separate new notifications
                const newNotifs = mergedNotifications.filter(notification => notification.mark_read === 0);
                // const oldNotifs = mergedNotifications.filter(notification => notification.mark_read === 1);

                setNewNotifications(newNotifs);
                
            })
            .catch(error => {
                console.error('Error fetching notifications:', error);
            });
    };

    return (
        <>
        <div className='memberHome-container'>
            <nav className="memberHome-navbar">
                <div className="memberHome-nav-items">
                {user.role === 'non member' && user.approved === 1 && (
                    <Link to="/memberHome/payMembership" className="memberHome-nav-link">Pay Membership</Link>
                )}
                {user.role === 'non member' && user.approved === 0 && (
                    <Link to="/memberHome/getMembership" className="memberHome-nav-link">Get Membership</Link>
                )}
            
                    <button onClick={handleBookSlots} className="memberHome-nav-button">Book Slots</button>
                    <button onClick={handleBookPool} className="memberHome-nav-button">Book Pool</button>
                    
                    <Link to="/memberHome/events" className="memberHome-nav-link">Events</Link>
                    <Link to="/memberHome/notifications" className={`memberHome-nav-link ${newNotifications.length > 0 ? 'has-notifications' : ''}`}>
                    Notifications {newNotifications.length > 0  && <span className='notification-indicator'>{newNotifications.length}  </span>} 
                    </Link>
                    <Link to="/posts" className="memberHome-nav-link">Posts</Link>
                    <Link to="/memberHome/profile" className="memberHome-nav-link">My Profile</Link>
                    
                    <button onClick={handleLogout} className="memberHome-nav-button">Logout</button>

                </div>
            </nav>
            <div className="memberHome-welcome">
                <h1 className='Welcome-Member'>Welcome {user.username}!</h1>
                <div className="notices-container">
                <h2>Notices:</h2>
                <div className="notice-box">
                    {notices.length > 0 && notices.map((notice, index) => (
                        <div key={notice.id} className="notice-item">   
                            <p className= "notice-content">{notice.notice}</p>
                            <p className="date-posted">Date Posted: {new Date(notice.date_posted).toLocaleDateString()}</p>
                        </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
        </>
    );
}


export default MemberHome;
