// Notifications.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NotificationItem from '../../components/NotificationItem';
import { useAuth } from '../../AuthContext';
import './Notifications.css';
import { IoIosArrowBack } from "react-icons/io";
import { Link } from 'react-router-dom';

const Notifications = () => {
    const { user } = useAuth();
    const [oldNotifications, setOldNotifications] = useState([]);
    const [newNotifications, setNewNotifications] = useState([]);
    const [isComponentMounted, setIsComponentMounted] = useState(true); // Track component mount status

    useEffect(() => {
        fetchNotifications();

        // Cleanup function for removing event listener
        return () => {
            console.log("return ", isComponentMounted);
            if (isComponentMounted) { // Check if the component is mounted before calling markAllAsRead
                markAllAsRead();
            }
            setIsComponentMounted(false); // Set component mount status to false when unmounting
        };
    }, []); 



    const fetchNotifications = () => {
        axios.get(`https://xwqkcw08-8000.inc1.devtunnels.ms/notifications`)
            .then(response => {
                const { user_specific, general } = response.data;
                
                const mergedNotifications = [...user_specific, ...general];
                // console.log(mergedNotifications);
                mergedNotifications.sort((a, b) => new Date(b.date_posted) - new Date(a.date_posted));
                const newNotifs = mergedNotifications.filter(notification => notification.mark_read === 0);
                const oldNotifs = mergedNotifications.filter(notification => notification.mark_read === 1);
                // console.log(oldNotifs);
                // console.log(newNotifs);
                setNewNotifications(newNotifs);
                setOldNotifications(oldNotifs);
            })
            .catch(error => {
                console.error('Error fetching notifications:', error);
            });
    };

    const handleDeleteNotification = (notificationId) => {
        axios.delete(`https://xwqkcw08-8000.inc1.devtunnels.ms/notifications/${notificationId}`)
            .then(response => {
                console.log('Notification deleted successfully:', response.data);
                const updatedNewNotifications = newNotifications.filter(notification => notification.id !== notificationId);
                const updatedOldNotifications = oldNotifications.filter(notification => notification.id !== notificationId);
                setNewNotifications(updatedNewNotifications);
                setOldNotifications(updatedOldNotifications);
            })
            .catch(error => {
                console.error('Error deleting notification:', error);
            });
    };

    const markAllAsRead = () => {
        const updatedOldNotifications = [...oldNotifications, ...newNotifications];
        axios.put(`https://xwqkcw08-8000.inc1.devtunnels.ms/mark-read`)
            .then(response => {
                console.log('Notifications marked as read:', response.data);
            })
            .catch(error => {
                console.error('Error marking notifications as read:', error);
            });
    };

    const handleMarkAsRead = (notificationId) => {
        const updatedNewNotifications = newNotifications.filter(notification => notification.id !== notificationId);
        setNewNotifications(updatedNewNotifications);
        const markedNotification = newNotifications.find(notification => notification.id === notificationId);
        if (markedNotification) {
            setOldNotifications(prevState => [markedNotification, ...prevState]);
        }
    };

    return (
        <div className='Notify'>
            <div className="notifications-page">
                <h1>Hi {user.username}</h1>
                <h1>Your Notifications</h1>
                <div className="new-notifications">
                    {newNotifications.length > 0 && <h2>New Notifications</h2>}
                    {newNotifications.map(notification => (
                        <NotificationItem key={notification.id} notification={notification} onDelete={() => handleDeleteNotification(notification.id)} />
                    ))}
                    {newNotifications.length > 0 && <hr />}
                </div>

                {oldNotifications.length > 0 && <h2>All Notifications</h2>}
                {oldNotifications.map(notification => (
                    <NotificationItem key={notification.id} notification={notification} onDelete={() => handleDeleteNotification(notification.id)} />
                ))}
                <div>
                    <Link to="/home" className='bookslots-back'><IoIosArrowBack /> Back </Link>
                </div>
            </div>
        </div>
    );
};

export default Notifications;
