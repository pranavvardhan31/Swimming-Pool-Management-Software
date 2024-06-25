import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './membership.css';
import { useAuth } from '../../AuthContext';
import { useNavigate } from 'react-router-dom';
import './GetMembership.css'
import { IoIosArrowBack } from "react-icons/io";
import { Link, Navigate } from 'react-router-dom';


const GetMembership = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [requirements, setRequirements] = useState([]);
  const [requirementValues, setRequirementValues] = useState({});
  const [files, setFiles] = useState({}); // State to hold file objects
  const [existingApproval, setExistingApproval] = useState(null);

  // const [approvalDateTime, setApprovalDateTime] = useState({ date: '', time: '' });  // State to hold approval time


  useEffect(() => {
    // Fetch requirements from the backend
    axios.get('https://xwqkcw08-8000.inc1.devtunnels.ms/requirements')
      .then(res => {
        setRequirements(res.data);
      })
      .catch(error => {
        console.error('Error fetching requirements:', error);
      });

      axios.get(`https://xwqkcw08-8000.inc1.devtunnels.ms/approvals/${user.id}`)
      .then(res => {
        setExistingApproval(res.data);
      })
      .catch(error => {
        console.error('Error fetching existing approval:', error);
      });

  }, []);

  // const handleImageChange = (e) => {
  //   setImage(e.target.files[0]);
  // };


  const handleSubmit = async (e) => {
    e.preventDefault();  
    try {
      // Prepare data to be sent to the backend
      const formData = new FormData();

      const currentTime = new Date();
      
      // Extract date and time components
      const date = currentTime.toLocaleDateString();
      // Append user_id to formData
      formData.append('user_id', user.id);
  
      // Append input values to formData
      Object.entries(requirementValues).forEach(([key, value]) => {
        formData.append(key, value);
      });
      formData.append('approval_date', date);

      // Send POST request for approvals
      const approvalResponse = await axios.post('https://xwqkcw08-8000.inc1.devtunnels.ms/approvals', formData);
  
      console.log('Application submitted successfully:', approvalResponse.data);
      const approvalId = approvalResponse.data.approval_id;
  
      // Send POST request for files
      Object.entries(files).forEach(async ([label, file]) => {
        const fileFormData = new FormData();
        fileFormData.append('file', file);
        fileFormData.append('label', label);
        fileFormData.append('approval_id', approvalId);

        const fileResponse = await axios.post('https://xwqkcw08-8000.inc1.devtunnels.ms/files', fileFormData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
  
        console.log('File uploaded successfully:', fileResponse.data);
      });
      // Clear form data
      setRequirementValues({});
      setFiles({});
      alert('Your approval is sent for reviewing');

      // Navigate to previous page
      navigate(-1);


    } catch (error) {
      console.error('Error submitting application:', error);
    }
  };
  
  const handleFileChange = (e, label) => {
    // Store file object in the files state
    setFiles(prevState => ({
      ...prevState,
      [label]: e.target.files[0]
    }));
  };
  const handleEditMyApprovalBtn= async ()=>{
    axios.delete(`https://xwqkcw08-8000.inc1.devtunnels.ms/approvals/${user.id}`)
      .then(res => {
        console.log("Deleted Previous approval,",res);
        setExistingApproval(null);
      })
      .catch(error => {
        console.error('Error fetching existing approval:', error);
      });
  }

  return (
    // <div>
    //   <h2>Application for Membership</h2>
    //   {existingApproval ? (
    //     <div>
    //       <p>Your approval is still pending.</p>
    //       <button onClick={handleEditMyApprovalBtn}>Edit My Approval</button>
    //     </div>
    //   ) : (
    //     <form className='member' onSubmit={handleSubmit}>
    //       {requirements.map(requirement => (
    //         <div key={requirement.label}>
    //           <label htmlFor={requirement.label}>{requirement.label}</label>
    //           {requirement.type === 'file' ? (
    //             <input
    //              type="file"
    //               id={requirement.label}
    //               name={requirement.label}
    //               onChange={e => handleFileChange(e, requirement.label)}
    //             />
    //           ) : (
    //             <input
    //               type={requirement.type}
    //               id={requirement.label}
    //               onChange={e => {
    //                 setRequirementValues(prevState => ({
    //                   ...prevState,
    //                   [requirement.label]: e.target.value
    //                 }));
    //               }}
    //             />
    //           )}
    //         </div>
    //       ))}
    //       {/* <label> Aadhar Number</label>
    //       <input type ='text' ></input> */}
    //       <button className='getmembtn' type="submit">Apply for Membership</button>
    //     </form>
    //   )}
    // </div>


    <div className='application-container'>
  <div className='application-overlay'>
    <h2 className='application-heading'>Application for Membership</h2>
    {existingApproval ? (
      <div className='application-pending'>
        <p>Your approval is still pending.</p>
        <button className='application-edit-btn' onClick={handleEditMyApprovalBtn}>
          Edit My Approval
        </button>
      </div>
      
    ) : (
      <form className='application-form' onSubmit={handleSubmit}>
        {requirements.map(requirement => (
          <div key={requirement.label} className='application-input-group'>
            <label htmlFor={requirement.label} >{requirement.label.replace(/_/g, ' ')}</label>
            {requirement.type === 'file' ? (
              <input
                type="file"
                id={requirement.label}
                name={requirement.label}
                onChange={e => handleFileChange(e, requirement.label)}
                className='application-input-file'
              />
            ) : (
              <input
                type={requirement.type}
                id={requirement.label}
                onChange={e => {
                  setRequirementValues(prevState => ({
                    ...prevState,
                    [requirement.label]: e.target.value
                  }));
                }}
                className='application-input-text'
              />
            )}
          </div>
        ))}
        <button className='application-submit-btn' type="submit">Apply for Membership</button>
        <div>
          <Link to="/home" className='bookslots-back'><IoIosArrowBack /> Back </Link>
        </div>
      </form>
    )}
  </div>
</div>

  );
};




export default GetMembership;
