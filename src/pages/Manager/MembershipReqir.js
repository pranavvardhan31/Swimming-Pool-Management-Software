import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MembershipRequir.css'
import AddRequirementForm from '../../components/AddRequirementForm';
import {Link} from 'react-router-dom';

const ManageRequirementsPage = () => {
  const [requirements, setRequirements] = useState([]);
  const [editedRequirements, setEditedRequirements] = useState([]);
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);


  useEffect(() => {
    axios.get('https://xwqkcw08-8000.inc1.devtunnels.ms/requirements')
      .then(res => {
        setRequirements(res.data);
      })
      .catch(error => {
        console.error('Error fetching requirements:', error);
      });
  }, []);

  const handleEdit = (index) => {
    const updatedRequirements = [...requirements];
    updatedRequirements[index].editing = true;
    setRequirements(updatedRequirements);
  };

  const handleCancelEdit = (index) => {
    const updatedRequirements = [...requirements];
    updatedRequirements[index].editing = false;
    setRequirements(updatedRequirements);
  };

  const handleUpdate = () => {
    const updatedRequirements = requirements.map(req => ({ 
      label: req.label.replace(/\s/g, '_'), 
      type: req.type
     }));
    
    console.log(updatedRequirements);

    axios.delete('https://xwqkcw08-8000.inc1.devtunnels.ms/requirements')
      .then(() => {
        axios.post('https://xwqkcw08-8000.inc1.devtunnels.ms/requirements', updatedRequirements)
          .then(res => {
            console.log(res.data);
            setRequirements(requirements);
            alert("Requirements updated successfully.")
            // setEditedRequirements([]);
          })
          .catch(error => {
            console.error('Error updating requirements:', error);
          });
      })
      .catch(error => {
        console.error('Error deleting previous requirements:', error);
      });
  };

  const handleSaveEdit = (index, id, label, type) => {
    const updatedRequirements = [...editedRequirements];
    updatedRequirements[index] = { id, label, type };
    setEditedRequirements(updatedRequirements);

    const updatedOriginalRequirements = [...requirements];
    updatedOriginalRequirements[index].editing = false;
    setRequirements(updatedOriginalRequirements);
  };

  const handleDelete = (id) => {
    const updatedRequirements = requirements.filter(req => req.id !== id);
    setRequirements(updatedRequirements);

    const updatedEditedRequirements = editedRequirements.filter(req => req.id !== id);
    setEditedRequirements(updatedEditedRequirements);
  };

  const handleAddRequirement = (newRequirement) => {
    const labelExist = !requirements.some(req => req.label === newRequirement.label)

    if (!labelExist) {
        alert('Requirement label must be unique.');
        return;
    }
    const newRequirements=[...requirements,newRequirement];
    setRequirements(newRequirements);
    // Handle adding the new requirement to the list of requirements
    console.log('New requirement:', newRequirement);
    // Close the modal
    setIsAddFormOpen(false);
  };

  // return (
  //   <div className="manage-requirements-container">
  //     <h1>Manage Requirements</h1>
  //     <div>
  //       <h2>All Requirements</h2>
  //       <ul className="requirement-list">
  //         {requirements.map((req, index) => (
  //           <li key={req.label} className="requirement-item">
  //             {req.editing ? (
  //               <>
  //                 <strong className="requirement-label">Requirement Label:</strong> 
  //                 <input 
  //                   type="text" 
  //                   value={req.label} 
  //                   onChange={e => {
  //                       const updatedRequirements = [...requirements]; // Create a copy of requirements array
  //                       updatedRequirements[index].label = e.target.value; // Update the label of the specific requirement
  //                       setRequirements(updatedRequirements); 
  //                   }} 
  //                   autoFocus
  //                   className="input-field" 
  //                 />
  //                 <strong className="requirement-label">Type of Requirement:</strong> 
  //                 <select 
  //                   value={req.type} 
  //                   onChange={e => {
  //                     const updatedRequirements = [...requirements];
  //                     updatedRequirements[index].type = e.target.value;
  //                     setRequirements(updatedRequirements);
  //                   }} 
  //                   className="input-field"
  //                 >
  //                   <option value="text">Text</option>
  //                   <option value="file">File</option>
  //                   <option value="date">Date</option>
  //                 </select>
  //                 <button onClick={() => handleSaveEdit(index, req.id, req.label, req.type)} className="action-button edit-button">Save</button>
  //                 <button onClick={() => handleCancelEdit(index)} className="action-button cancel-button">Cancel</button>
  //               </>
  //             ) : (
  //               <>
  //                 <strong className="requirement-label">Requirement Label:</strong> {req.label} &nbsp;&nbsp;&nbsp;
  //                 <strong className="requirement-label">Type of Requirement:</strong> {req.type} &nbsp;&nbsp;&nbsp;
  //                 <button onClick={() => handleEdit(index)} className="action-button edit-button">{req.editing ? "Save" : "Edit"}</button>
  //                 <button onClick={() => handleDelete(req.id)} className="action-button delete-button">Delete</button>
  //               </>
  //             )}
  //           </li>
  //         ))}
  //       </ul>
  //     </div>
  //     <div>
  //       <h2>Add Requirement</h2>
  //       {/* Add requirement form */}
  //       <button onClick={() => setIsAddFormOpen(true)} className="action-button add-requirement-button">Add Requirement</button>
  //       {isAddFormOpen && (
  //         <div className="modal-overlay">
  //           <div className="modal-content">
  //             <span className="close" onClick={() => setIsAddFormOpen(false)}>&times;</span>
  //             <AddRequirementForm onAddRequirement={handleAddRequirement} onClose={() => setIsAddFormOpen(false)} />
  //           </div>
  //         </div>
  //       )}
  //     </div>
  //     <div> 
  //       <h2>Update Requirements</h2>
  //       <button onClick={handleUpdate} className="action-button update-requirements-button">Update Requirements</button>
  //     </div>
  //   </div>
  // );
  

  return (
    <div >
      <nav className="manager-navbar">
            <ul className="manager-nav-links">
                <li><Link to="/managerHome" className="manager-nav-link">Home </Link></li>
                <li><Link to="/managerHome/changeRequirements" className='nav-modify'>Modify Membership Requirements </Link></li>
                <li><Link to="/managerHome/approvals" className="manager-nav-link">Approvals </Link></li>
                {/* <li><Link to="/managerHome/addCoordinators" className="manager-nav-link">Course Coordinators</Link></li> */}
                <li><Link to="/managerHome/organizeEvents" className="manager-nav-link">Organize Events </Link></li>
                <li><Link to="/managerHome/manageSlots" className="manager-nav-link">Manage Slots </Link></li>
                <li><Link to="/managerHome/notices" className="manager-nav-link">Add Notice </Link></li>
                <li><Link to="/managerHome/cancelreasons" className="manager-nav-link">Cancel Reasons</Link></li>
                <li><Link to="/managerHome/managerProfile" className="manager-nav-link">Profile </Link></li>
            </ul>
            </nav>
      <div className='req-container'>
      <div className="requirement-manage-requirements-container">
        <h1 className='requirements-title'>Manage Requirements</h1>
        <div>
          
          <ul >
            {requirements.map((req, index) => (
              <li key={req.label} className="requirement-requirement-item">
                {req.editing ? (
                  <>
                    <strong className="requirement-requirement-label">Requirement Label:</strong> 
                    <input 
                      type="text" 
                      value={req.label} 
                      onChange={e => {
                          const updatedRequirements = [...requirements]; // Create a copy of requirements array
                          updatedRequirements[index].label = e.target.value; // Update the label of the specific requirement
                          setRequirements(updatedRequirements); 
                      }} 
                      autoFocus
                      className="requirement-input-field" 
                    />
                    <strong className="requirement-requirement-label">Type of Requirement:</strong> 
                    <select 
                      value={req.type} 
                      onChange={e => {
                        const updatedRequirements = [...requirements];
                        updatedRequirements[index].type = e.target.value;
                        setRequirements(updatedRequirements);
                      }} 
                      className="requirement-input-field"
                    >
                      <option value="text">Text</option>
                      <option value="file">File</option>
                      <option value="date">Date</option>
                    </select>
                    <button onClick={() => handleSaveEdit(index, req.id, req.label, req.type)} className="requirement-action-button edit-button">Save</button>
                    <button onClick={() => handleCancelEdit(index)} className="requirement-action-button cancel-button">Cancel</button>
                  </>
                ) : (
                  <>
                    <strong className="requirement-requirement-label">Requirement Label:</strong> {req.label} &nbsp;&nbsp;&nbsp;
                    <strong className="requirement-requirement-label">Type of Requirement:</strong> {req.type} &nbsp;&nbsp;&nbsp;
                    <button onClick={() => handleEdit(index)} className="requirement-action-button">{req.editing ? "Save" : "Edit"}</button>
                    <button onClick={() => handleDelete(req.id)} className="requirement-action-button delete-button">Delete</button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div>
          
          {/* Add requirement form */}
          <button onClick={() => setIsAddFormOpen(true)} className="requirement-add-button">Add Requirement</button>
          {isAddFormOpen && (
            <div className="requirement-modal-overlay">
              <div className="requirement-modal-content">
                <span className="requirement-close" onClick={() => setIsAddFormOpen(false)}>&times;</span>
                <AddRequirementForm onAddRequirement={handleAddRequirement} onClose={() => setIsAddFormOpen(false)} />
              </div>
            </div>
          )}
        </div>
        <div> 
          
          <button onClick={handleUpdate} className="requirement-update-button">Update Requirements</button>
        </div>
        </div>
      </div>
    </div>
  );
  
  
};

export default ManageRequirementsPage;
