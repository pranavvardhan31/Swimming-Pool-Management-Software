// EditProfile.js

import React,{useState} from 'react';
import axios from 'axios';

const EditProfile = ({ userInfo, setUserInfo }) => {
    console.log(userInfo)
  const [editedUser, setEditedUser] = useState({
    username: userInfo.username,
    email: userInfo.email,
    gender: userInfo.gender,
    phone_number: userInfo.phone_number,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  const handleEdit = (e) => {
    e.preventDefault();
    axios
      .put(`https://xwqkcw08-8000.inc1.devtunnels.ms/userInfo`, editedUser)
      .then((response) => {
        setUserInfo({ ...editedUser });
        alert('Profile updated successfully.');
      })
      .catch((error) => {
        console.error('Error updating profile:', error);
        alert('Error updating profile. Please try again.');
      });
  };

  return (
    <div id="edit-profile" className="content-section">
      <h2>Edit Profile</h2>
      <form onSubmit={handleEdit}>
        <label>
          Name:
          <input
            type="text"
            name="username"
            value={editedUser.username}
            onChange={handleChange}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={editedUser.email}
            onChange={handleChange}
          />
        </label>
        <label>
          Gender:
          <select
            name="gender"
            value={editedUser.gender}
            onChange={handleChange}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </label>
        <label>
          Phone Number:
          <input
            type="text"
            name="phone_number"
            value={editedUser.phone_number}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default EditProfile;
