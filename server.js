const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require('body-parser');
const moment = require('moment');
const multer = require('multer');
const path = require('path');
const { createRoutesFromChildren } = require("react-router-dom");




const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

const upload = multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, 'uploads/');
      },
      filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
      }
    }),
    fileFilter: function (req, file, cb) {
      const filetypes = /pdf/;
      const mimetype = filetypes.test(file.mimetype);
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
      if (mimetype && extname) {
        return cb(null, true);
      }
      cb('Error: PDF files only!');
    }
  });
  
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'spms'
});
 
// Attempt to connect to the database
db.connect((err) => {
    if (err) {
      console.error('Error connecting to database:', err);
      return;
    }
    
    console.log('Connected to database!');
  });

let userInfo =[]; 


app.post('/', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const checkAccountQuery = "SELECT id, password FROM spms.users WHERE email = ?";
    db.query(checkAccountQuery, [email], (err, data) => {
        if (data.length === 0) {    
           return res.send("Account doesn't exist.");
        }
        const storedPassword = data[0].password;
        if (password === storedPassword) {
            const userdata = `SELECT * from spms.users WHERE id = ?`;
            db.query(userdata, [data[0].id], (err, data1) => {
                if(err)
                {
                    return res.send('Internal server error.');
                }
                userInfo = data1[0];
                console.log(userInfo);
                //console.log(userdata[0]);
                return res.send({ status: "Successful", userData: { id: userInfo.id, username: userInfo.username } });

            });

        } else {
            return res.send("Wrong Password");
        }
    });
});

app.get('/getUserRole', (req, res) => {

    res.json({ role: userInfo.role, approved: userInfo.approved });

});

// Logout endpoint to clear the loggedInUserId variable
app.post('/logout', (req, res) => {
    userInfo = []; // Clear the logged-in user's ID upon logout
    res.send("Logged out successfully");
});

app.get('/', (req, res) => {
    res.send('Hello World!');
  });
  
app.post('/signUp', (req,res) => {
    const email = req.body.email;
    const password = req.body.password;
    const username = req.body.username;
    const phone_number = req.body.phone_number;
    const checkAccountQuery = "SELECT id, password FROM spms.users WHERE email = ?";
    db.query(checkAccountQuery, [email], (err, data) => {
        if (data.length != 0) {
             return res.send("Account already exists");
        }
        else{
            const q = validatePassword(password);
            if(q==="Valid Password")
            {
                const userdata = {
                    'username': username,
                    'password':password,
                    'email':email,
                    'phone_number' : phone_number,
                    'role':'non member'
                };
                 db.query('INSERT INTO spms.users SET ?', userdata, (err,results) => {
                    if (err) throw err;
                    return res.send('Succesful');
                 })
            }
            else
            {
                return res.send(q);
            }
        }
    });
})

function validatePassword(password) {
    // Regular expressions to match password criteria
    const regexUpperCase = /[A-Z]/; // At least one uppercase letter
    const regexLowerCase = /[a-z]/; // At least one lowercase letter
    const regexNumber = /[0-9]/;     // At least one digit
    const regexSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/; // At least one special character
    const minLength = 7; // Minimum length of the password

    // Check if password meets all criteria
    if (!regexUpperCase.test(password))
    {
        return "Uppercase";
    }
    if(!regexLowerCase.test(password))
    {
        return "Lowercase";
    }
    if(!regexNumber.test(password))
    {
        return "Number";
    }
    if(!regexSpecial.test(password))
    {
        return "Specialchar";
    }
    if(password.length < minLength)
    {
        return "MinLength";
    } 
     return "Valid Password"; // Password is valid
    
}

app.get('/bookSlots', (req, res) => {
    const { day } = req.query;
    const query = `SELECT start_time, end_time, capacity FROM spms.slots WHERE day = ?`;
    db.query(query, [day], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.json(results);
    });
  });

  
  app.get('/slot_bookings', (req, res) => {
    const query = `SELECT * FROM spms.slot_bookings WHERE user_id = ?`;
    db.query(query,  [userInfo.id], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      
      res.json(results);
    });
  });

  app.post('/update_bookings', (req, res) => {
    const bookings = req.body; // Assuming the request body contains an array of bookings
    const userId = userInfo.id; // Assuming userInfo contains the currently logged-in user's ID

    // First, delete existing bookings for the user
    const deleteQuery = `DELETE FROM spms.slot_bookings WHERE user_id = ?`;
    db.query(deleteQuery, [userId], (deleteErr, deleteResults) => {
        if (deleteErr) {
            console.error('Error clearing existing bookings:', deleteErr);
            return res.status(500).json({ error: 'Internal server error' });
        }

        console.log('Existing bookings cleared successfully:', deleteResults);

        // Then, insert new bookings
        let insertQuery = 'INSERT INTO spms.slot_bookings SET ?';

        // Execute the query for each booking
        bookings.forEach(booking => {
            const values = {
                user_id: userId,
                start_time: booking.start_time,
                end_time: booking.end_time,
                date: booking.date
            };
            // Execute the query for each booking
            db.query(insertQuery, values, (err, results) => {
                if (err) {
                    console.error('Error inserting booking:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                }
                console.log('Booking inserted successfully:', results);
        });
    });

    });
});

// const checkPoolBookingLimit = (req, res, next) => {
//     const userId = userInfo ? userInfo.id : null; // Check if userInfo is defined before accessing its properties

//     if (!userId) {
//     return res.status(400).json({ error: 'User ID is missing.' });
//     }

//     const currentMonthStart = moment().startOf('month').format('YYYY-MM-DD HH');
//     const currentMonthEnd = moment().endOf('month').format('YYYY-MM-DD HH');

//     const query = `SELECT COUNT(*) AS totalPoolBookings FROM spms.pool_bookings 
//     WHERE user_id = ? 
//     AND date >= ? 
//     AND date <= ?`;

    
//     db.query(query, [userId, currentMonthStart, currentMonthEnd], (error, results) => {
//         if (error) {
//             console.error('Error checking pool booking limit:', error);
//             return res.status(500).json({ error: 'Internal server error' });
//         }
        
//         const poolBookingCount = results[0].totalPoolBookings;
//         if (poolBookingCount >= 5) {
//             return res.status(403).json({ message: 'Maximum pool booking limit reached for this month.' });
//         }
        
//         // Store pool booking count for further processing if needed
//         req.poolBookingCount = poolBookingCount;
//         next(); // Proceed to the next middleware or route handler
//     });
// };
app.get('/pool_bookings', (req, res) => {
    const query = `SELECT * FROM spms.pool_bookings WHERE user_id = ?`;
    db.query(query,  [userInfo.id], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.json(results);
    });
  });


  app.post('/pool_booking', (req, res) => {
    const userId = userInfo.id; // Assuming userInfo contains the currently logged-in user's ID
    const bookings = req.body; // Assuming date, start_time, and end_time are sent in the request body

    // First, delete previous pool bookings for the user
    const deletePreviousBookingsQuery = 'DELETE FROM pool_bookings WHERE user_id = ?';
    db.query(deletePreviousBookingsQuery, [userId], (deleteError, deleteResults) => {
        if (deleteError) {
            console.error('Error deleting previous pool bookings:', deleteError);
            return res.status(500).json({ error: 'Internal server error in deleting' });
        }

        // Insert the new pool booking into the database
        let insertQuery = 'INSERT INTO spms.pool_bookings SET ?';

        // Execute the query for each booking
        bookings.forEach(booking => {
            const values = {
                user_id: userId,
                start_time: booking.start_time,
                end_time: booking.end_time, 
                date: booking.date
            };  
            // Execute the query for each booking
            db.query(insertQuery, values, (err, results) => {
                if (err) {
                    console.error('Error inserting booking:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                }
                // console.log('Booking inserted successfully:', results);
                // const overlapQuery = `SELECT * FROM slot_bookings 
                //                   WHERE user_id = ? 
                //                   AND date = ? 
                //                   AND ((start_time >= ? AND start_time < ?) OR (end_time > ? AND end_time <= ?))`;
            const cancelQuery = `DELETE FROM slot_bookings 
                                  WHERE DATE=?
                                  AND ((start_time >= ? AND start_time < ?) OR (end_time > ? AND end_time <= ?))`;
             db.query(cancelQuery, [booking.date, booking.start_time, booking.end_time, booking.start_time, booking.end_time], (cancelError, cancelResults) => {
                 if (cancelError) {
                     console.error('Error cancelling slots:', cancelError);
                     return res.status(500).json({ error: 'Internal server error' });
                 }

                 // Notify users about cancelled slots and store notifications in the database
                 // overlapResults.forEach(slot => {
                 //     const notificationQuery = 'INSERT INTO notifications (user_id, message) VALUES (?, ?)';
                 //     const notificationMessage = `Your slot booking for ${date} (${slot.start_time}-${slot.end_time}) has been cancelled due to a pool booking.`;
                 //     db.query(notificationQuery, [slot.user_id, notificationMessage], (notificationError, notificationResults) => {
                 //         if (notificationError) {
                 //             console.error('Error storing notification:', notificationError);
                 //             // Handle error
                 //         }
                 //         // Notification stored successfully
                 //     });
                 // });

                 
                });
            });
        });
        res.status(201).json({ message: 'Pool booking successful.' });
    });
});

app.get('/requirements', async (req, res) => {
    try {
        const reqirementsQuery='SELECT * FROM spms.mem_requirements'
        db.query(reqirementsQuery,(err,results) => {
            if(err){
                console.error(err);
                return res.status(500).json({ error: 'Internal server error' });
            }
            res.send(results);
        });
    }
        catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Error fetching requirements' });
          }
        
  });

  app.delete('/requirements', (req, res) => {
    // Execute a DELETE query to delete all data from the mem_requirements table
    const deleteQuery = 'DELETE FROM mem_requirements';
    db.query(deleteQuery, (error, results) => {
        if (error) {
            console.error('Error deleting data from mem_requirements table:', error);
            res.status(500).send('Error deleting data from mem_requirements table');
            return;
        }
        // Data deleted successfully
        res.status(200).send('All data deleted from mem_requirements table');
    });
});

app.post('/requirements', (req,res) => {
    const newDataArray = req.body;
    console.log(newDataArray); // Assuming request body contains an array of data to be added
    // Execute INSERT query for each item in the array
    const insertQuery = 'INSERT INTO spms.mem_requirements (type, label) VALUES (?, ?)';
    // const values = newDataArray.map(data => [data.type, data.label]); // Extract values from each item in the array
    newDataArray.forEach(data => {
        const values = [data.type, data.label]; // Extract values from each item in the array
        console.log(values);
        db.query(insertQuery, values, (error, results) => {
            if (error) {
                console.error('Error adding data to mem_requirements table:', error);
                 return res.status(500).send('Error adding data to mem_requirements table');
        
            }
            
        });
        return res.status(200).send('Data added successfully');
    })
})

app.post('/approvals', upload.none(), (req, res) => {
    const  formData = req.body;
  
    
    db.query('INSERT INTO spms.approvals SET ?', formData, (err, result) => {
      if (err) {
        console.error('Error inserting approval data into the database:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }

      const approvalId = result.insertId; // Get the last inserted ID

    console.log('Approval data inserted into the database with ID:', approvalId);

    // Send the approval ID in the response
    res.json({ approval_id: approvalId, message: 'Application submitted successfully' });
    });
  });
  
app.get('/approvals/:userId', (req, res) => {
    const userId = req.params.userId;
  
    // Query the database to fetch the approval data for the user
    db.query('SELECT * FROM spms.approvals WHERE user_id = ?', [userId], (err, results) => {
        if (err) {
            console.error('Error fetching approval data from the database:', err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }
        // Check if an approval exists for the user
        if (results.length > 0) {
            const approvalData = results[0]; // Assuming only one approval per user
            res.json(approvalData);
        } else {
            res.json(null); // Return null if no approval exists for the user
        }
    });
});

app.delete('/approvals/:userId', (req, res) => {
    const userId = req.params.userId;
  
    // Delete the approval data for the user from the database
    db.query('DELETE FROM spms.approvals WHERE user_id = ?', [userId], (err, results) => {
        if (err) {
            console.error('Error deleting approval data from the database:', err);
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        // Check if any rows were affected (if deletion was successful)
        if (results.affectedRows > 0) {
            res.json({ message: 'Approval deleted successfully' });
        } else {
            res.status(404).json({ error: 'Approval not found for the user' });
        }
    });
});

  // POST endpoint to handle file uploads
  app.post('/files', upload.single('file'), (req, res) => {
    const { label ,approval_id} = req.body;
    const { originalname, path, mimetype, size } = req.file;
    
  
    // Insert file data into the database
    const fileData = {
      approval_id: approval_id, 
      file_name: originalname,
      file_path: path,
      file_type: mimetype,
      file_size: size,
      label: label
    };
  
    db.query('INSERT INTO spms.files SET ?', fileData, (err, result) => {
      if (err) {
        console.error('Error inserting file data into the database:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
      console.log('File data inserted into the database:', result);
      res.json({ message: 'File uploaded successfully' });
    });
  });

  app.get('/user-approvals', (req, res) => {
    
    // Fetch user approvals from the database
    db.query('SELECT * FROM spms.approvals', (err, approvals) => {
      if (err) {
        console.error('Error fetching user approvals from the database:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
  
      // Send user approvals in the response
      res.json(approvals);
    });
  });
  
  // GET endpoint to retrieve files associated with a specific approval
  app.get('/approval-files/:approval_id', (req, res) => {
    const { approval_id } = req.params;
  
    // Fetch files associated with the approval from the database
    db.query('SELECT * FROM spms.files WHERE approval_id = ?', approval_id, (err, files) => {
      if (err) {
        console.error('Error fetching files associated with the approval from the database:', err);
        res.status(500).json({ error: 'Internal server error' });
        return;
      }
  
      // Send files associated with the approval in the response
      res.json(files);
    });
  });
  
  app.get('/uploads/:fileName', (req, res) => {
    const fileName = req.params.fileName;
    const filePath = path.join(__dirname, 'uploads', fileName);
  
    // Set Content-Type header
    res.setHeader('Content-Type', 'application/pdf');
  
    // Send the file
    res.sendFile(filePath);
  });

  app.put('/approve-membership/:userId', async (req, res) => {
    const userId = req.params.userId;
  
    try {
        const approveQuery = `UPDATE spms.users SET approved = 1 WHERE id = ?`;
        db.query(approveQuery,[userId],(err,results)=>{
            if (err) {
                console.error('Error fetching files associated with the approval from the database:', err);
                res.status(500).json({ error: 'Internal server error' });
                return;
              }
        })
        res.status(200).json({ message: 'Membership approved successfully.' });
    } catch (error) {
      console.error('Error approving membership:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  });   

  app.put('/payMembership', async (req, res) => {
    try {
        const userId = userInfo.id; // Assuming you have access to the user's ID through req.user
        const approveQuery = `UPDATE spms.users SET role = 'member' WHERE id = ?`;
        db.query(approveQuery, [userId], (err, results) => {
            if (err) {
                console.error('Error updating user role in the database:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }
            userInfo.role='member';
            res.status(200).json({ message: 'Membership activated successfully.' });
        });
    } catch (error) {
        console.error('Error paying membership:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

app.delete('/delete-approval/:approvalId', async (req, res) => {
    const approvalId = req.params.approvalId;
  
    try {
      const deleteQuery = `DELETE FROM spms.approvals WHERE id = ?`;
      db.query(deleteQuery, [approvalId], (err, results) => {
        if (err) {
          console.error('Error deleting approval:', err);
          res.status(500).json({ error: 'Internal server error' });
          return;
        }
  
        res.status(200).json({ message: 'Approval deleted successfully.' });
      });
    } catch (error) {
      console.error('Error deleting approval:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

app.get('/notifications', (req, res) => {
    const user_id = userInfo.id; // Assuming user_id is provided as a query parameter
    // Fetch user-specific notifications
    const userNotificationsQuery = `
        SELECT id,date_posted, message
        FROM spms.notifications
        WHERE user_id = ?;
    `;
    db.query(userNotificationsQuery, [user_id], (userError, userResults) => {
        if (userError) {
            console.error('Error fetching user notifications:', userError);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        const generalNotificationsQuery = `
            SELECT id,date_posted, message
            FROM spms.notifications
            WHERE user_id = 0
        `;
        db.query(generalNotificationsQuery,(generalError, generalResults) => {
            if (generalError) {
                console.error('Error fetching general notifications:', generalError);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            const notifications = {
                user_specific: userResults,
                general: generalResults
            };
            return res.status(200).json(notifications);
        });
    });
    
});

app.post('/events', (req, res) => {
    const { event_name,date,start_time, duration,gender,distance} = req.body;
    const eventData = { event_name, date, start_time, duration , gender , distance};
  
    // Insert event data into the events table
    db.query('INSERT INTO spms.events SET ?', eventData, (error, results) => {
      if (error) {
        console.error('Error saving event details:', error);
        res.status(500).json({ error: 'Failed to save event details' });
        return;
      }
      console.log('Event details saved:', results);
      res.json({ message: 'Event details saved successfully' });
    });
  });

app.get('/events', (req,res) => {
    const query = 'SELECT * FROM spms.events';
    db.query(query, (error, results) => {
        if(error) {
            console.error('Error fetching events:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        return res.status(200).json(results);
    });
})

app.get('/userInfo', (req, res) => {
    const userdata = `SELECT * from spms.users WHERE id = ?`;
    db.query(userdata, userInfo.id, (err, data1) => {
        if(err)
        {
            return res.send('Internal server error.');
        }
        console.log(data1[0]);
        res.json(data1[0]);
        // console.log(userInfo);
        //console.log(userdata[0]);
        // return res.send({ status: "Successful", userData: { id: userInfo.id, username: userInfo.username } });
    });
});

// Update user profile
app.put('/userInfo', (req, res) => {
    const { username, email,phone_number, gender } = req.body;
  
    // Update user info in MySQL
    const query = `UPDATE spms.users SET phone_number = ? , email=? , gender = ? , username = ? WHERE id = ? `;
    db.query(query, [phone_number, email,gender, username , userInfo.id], (err, results) => {
      if (err) {
        console.error('Error updating user info:', err);
        res.status(500).json({ error: 'Failed to update user info' });
        return;
      }
      console.log('User info updated successfully');
      res.status(200).json({ message: 'User info updated successfully' });
    });
  });

app.put('/password', (req, res) => {
    const {newPassword } = req.body;
    const q=validatePassword(newPassword);
    if(q==="Valid Password"){
    // Update user info in MySQL
    const query = `UPDATE spms.users SET password = ? WHERE id = ? `;
    db.query(query, [newPassword, userInfo.id], (err, results) => {
      if (err) {
        console.error('Error updating user info:', err);
        res.status(500).json({ error: 'Failed to update user info' });
        return;
      }
      console.log('User info updated successfully');
      return res.send('Succesful');
    });
    }
    else{
        return res.send(q);
    }
});
  
app.get('/slots', (req, res) => {
    const query = 'SELECT * FROM spms.slots';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching slots:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json({ slots: results });
    });
});

app.get('/specialSlots', (req, res) => {
    const query = 'SELECT * FROM spms.special_slots';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching special slots:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json({ slots: results });
    });
});

app.delete('/deleteSlot/:id', (req, res) => {
    const slotId = req.params.id;

    // Query to delete the slot from the special_slots table
    const sql = 'DELETE FROM spms.special_slots WHERE id = ?';

    // Execute the query
    db.query(sql, [slotId], (err, results) => {
        if (err) {
            console.error('Error deleting special slot:', err);
            return res.status(500).json({ error: 'Error deleting special slot' });
        }
        console.log('Special slot deleted successfully');
        res.status(200).json({ message: 'Special slot deleted successfully' });
    });
});

app.get('/getSpecialSlts',(req,res)=>{
    const { date } = req.query;
    const query = `SELECT start_time, end_time, capacity, type_of_slot FROM spms.special_slots WHERE date = ?`;
    console.log(date);
    db.query(query, [date], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      console.log(results);
      res.json(results);
    });
});


app.post('/addslot', (req, res) => {
    const { day, startTime, endTime } = req.body;
    const query = 'INSERT INTO spms.slots (day, start_time, end_time) VALUES (?, ?, ?)';
    db.query(query, [day, startTime, endTime], (err, results) => {
        if (err) {
            console.error('Error adding slot:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.json({ message: 'Slot added successfully' });
    });
});

app.post('/addSlotOnDay', (req, res) => {
    const { date, day, startTime, endTime } = req.body;

    // Check if all required fields are present
    if (!date || !day || !startTime || !endTime) {
        return res.status(400).json({ error: "Please provide date, day, startTime, and endTime" });
    }

    // Query to insert a new slot into the special_slots table
    const sql = 'INSERT INTO spms.special_slots (date, day_of_the_week, start_time, end_time, type_of_slot) VALUES (?, ?, ?, ?, ?)';
    const values = [date, day, startTime, endTime, 'add'];

    // Execute the query
    db.query(sql, values, (err, results) => {
        if (err) {
            console.error('Error adding slot:', err);
            return res.status(500).json({ error: 'Error adding slot' });
        }
        console.log('Slot added successfully');
        res.status(200).json({ message: 'Slot added successfully' });
    });
});

app.post('/deleteSlots', (req, res) => {
    const { slotIds } = req.body;

    // Check if slotIds array is provided
    if (!Array.isArray(slotIds) || slotIds.length === 0) {
        return res.status(400).json({ error: 'Please provide an array of slotIds to delete' });
    }

    // Construct SQL DELETE query with slotIds
    const sql = 'DELETE FROM spms.slots WHERE id IN (?)';
    const values = [slotIds];

    // Execute the query
    db.query(sql, values, (err, results) => {
        if (err) {
            console.error('Error deleting slots:', err);
            return res.status(500).json({ error: 'Error deleting slots' });
        }
        // console.log('Slots deleted successfully');
        res.status(200).json({ message: 'Slots deleted successfully' });
    });
});

app.post('/deleteSlotsOnDay', (req, res) => {
    const selectedSlots = req.body;

    if (selectedSlots.length === 0) {
        return res.status(400).json({ error: "No slots selected for deletion" });
    }

    // Query to delete slots from the special_slots table
    const sql = 'INSERT INTO spms.special_slots (date, day_of_the_week, start_time, end_time, type_of_slot) VALUES (?, ?, ?, ?, ?)';

    // Execute the query for each selected slot
    selectedSlots.forEach(slot => {
        const { date, day, start_time, end_time } = slot;
        const values = [date, day, start_time, end_time, 'delete'];

        db.query(sql, values, (err, results) => {
            if (err) {
                console.error('Error deleting slot from special slots:', err);
                return res.status(500).json({ error: 'Error deleting slot from special slots' });
            }
            // console.log('Slot deleted successfully');
        });
    });

    res.status(200).json({ message: 'Slots deleted successfully' });

});





app.listen(8000, () => console.log('running backend and listening from 8000...'));

