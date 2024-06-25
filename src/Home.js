// Home.js
import React,{useEffect,useState} from 'react';
import { Link ,useNavigate} from 'react-router-dom';
import './Login.css';
import { useAuth } from './AuthContext';
import axios from 'axios';
import MemberHome from './pages/Member/MemberHome';
import ManagerHome from './pages/Manager/ManagerHome';
// import CCHome from './pages/Course Coordinator/CCHome';



const Home = () => {
  const { user , logoutUser } = useAuth(); // Access user state and logoutUser function from AuthContext
  const [isLoaded , setIsLoaded] = useState(false);
  const [userRole , setUserRole] = useState(null);
  const [approved , setApproved ] = useState(null);


  const navigate = useNavigate(); // Get navigate function


  useEffect(() => {
    if (!user && isLoaded) {
      console.log("Going to login page.")
      navigate('/');
      setIsLoaded(true);
    } else {
      // Assuming you have a way to fetch the user's role from the backend
      // Make a request to your backend to fetch user's role
      console.log("Getting role.")
      axios.get('https://xwqkcw08-8000.inc1.devtunnels.ms/getUserRole')
        .then(response => {
          const { role, approved } = response.data;

          setUserRole(role); // Assuming response contains user's role
          setApproved(approved);
        })
        .catch(error => {
          console.error('Error fetching user role:', error);
          // Handle error if any
        });

    }
  }, [user, navigate, isLoaded]);

  // useEffect(()=>{

  //   axios.get('https://xwqkcw08-8000.inc1.devtunnels.ms/getUserRole')
  //       .then(response => {
  //         const { role, approved } = response.data;
  //         console.log("Getting new role");
  //         setUserRole(role); // Assuming response contains user's role
  //         setApproved(approved);
  //       })
  //       .catch(error => {
  //         console.error('Error fetching user role:', error);
  //         // Handle error if any
  //       });
        
  // },[]);



  if (!user) {
    return null;
  }
  const handleLogout = async () => {
    await axios.post('https://xwqkcw08-8000.inc1.devtunnels.ms/logout') // Send POST request to backend logout endpoint
      .then(response => {
        console.log(response.data); // Log response from the server
        logoutUser(); // Logout user locally
        console.log("User is successfully logged out.");
        navigate('/');
      })
      .catch(error => {
        console.error('Error logging out:', error);
        // Handle error if any
      });
  };

  switch (userRole) {
    case 'member':
      return (
        <MemberHome
          handleLogout={handleLogout}
        />
      );
    case 'non member':
      return (
        <MemberHome handleLogout={handleLogout}/>
      );
    case 'manager':
      return <ManagerHome user={user} handleLogout={handleLogout} />;
    default:
      return null; // Or render a default home component if user role is unknown
  }
};

export default Home;
