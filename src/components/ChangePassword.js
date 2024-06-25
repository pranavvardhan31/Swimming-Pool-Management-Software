// ChangePassword.js

import React from 'react';
import axios from 'axios';
import { useAuth } from '../AuthContext';

const ChangePassword = () => {
    const {user} = useAuth();
  const [passwordData, setPasswordData] = React.useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [passwordError, setPasswordError] = React.useState(null);

  const handlePasswordInputChange = (e) => {
    e.persist();
    const { name, value } = e.target;
    setPasswordData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if(passwordData.currentPassword !== user.password){
        setPasswordError("Your current password is incorrect.");
        return;
    }

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    axios
      .put(`https://xwqkcw08-8000.inc1.devtunnels.ms/password`, passwordData)
      .then((response) => {
        console.log(response.data);
        alert('Password changed successfully.');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: '',
        });
      })
      .catch((error) => {
        console.error('Error changing password:', error);
        alert('Error changing password. Please try again.');
      });
  };

  return (
    <div id="change-password" className="content-section">
      <h2>Change Password</h2>
      <form onSubmit={handlePasswordChange}>
        <label>
          Current Password:
          <input
            type="password"
            name="currentPassword"
            value={passwordData.currentPassword}
            onChange={handlePasswordInputChange}
          />
        </label>
        <label>
          New Password:
          <input
            type="password"
            name="newPassword"
            value={passwordData.newPassword}
            onChange={handlePasswordInputChange}
          />
        </label>
        <label>
          Confirm New Password:
          <input
            type="password"
            name="confirmNewPassword"
            value={passwordData.confirmNewPassword}
            onChange={handlePasswordInputChange}
          />
        </label>
        {passwordError && <p className="error-message">{passwordError}</p>}
        <button type="submit">Change Password</button>
      </form>
    </div>
  );
};

export default ChangePassword;
