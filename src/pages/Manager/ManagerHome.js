import React,{useState,useEffect} from 'react'
import { Link ,useNavigate} from 'react-router-dom';
import './ManagerHome.css'
import { useAuth } from '../../AuthContext';
import axios from 'axios';
import { FcApproval } from "react-icons/fc";
import { MdEventAvailable } from "react-icons/md";
import { MdOutlineEmojiEvents } from "react-icons/md";
import { SlCalender } from "react-icons/sl";
import { CgProfile } from "react-icons/cg";
import { TiGroupOutline } from "react-icons/ti";
import { FaChalkboardTeacher } from "react-icons/fa";
import { GrGallery } from "react-icons/gr";
import { IoHomeOutline } from "react-icons/io5";


const ManagerHome = () => {
  const { user, logoutUser } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);
  // const [userRole, setUserRole] = useState(null);
  const [notices, setNotices] = useState([]);
  const navigate = useNavigate(); // Get navigate function

  useEffect(() => {
    if (!user && isLoaded) {
      console.log("Going to login page.")
      navigate('/');
      setIsLoaded(true);
    }
  }, [user, navigate, isLoaded]);
  useEffect(()=>{
    fetchNotices();
  },[navigate])

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
  
  const fetchNotices = async () => {
    try {
        const response = await axios.get('https://xwqkcw08-8000.inc1.devtunnels.ms/notices');
        setNotices(response.data);
    } catch (error) {
        console.error('Error fetching notices:', error);
    }
};
    // return (
    //     <div className='managerPage'>
    //       <h1>Welcome {user.username} !</h1>
    //       <div className="links">
    //         <Link to="/managerHome/changeRequirements" className='link'> Modify the Requirements for membership</Link>
    //         <Link to="/managerHome/approvals" className="link">Approvals</Link>
    //         <Link to="/managerHome/addCoordinators" className="link">Course Coordinators</Link>
    //         <Link to="/managerHome/organizeEvents" className="link">Organize Events</Link>
    //         <Link to="/managerHome/manageSlots" className="link" > Add/Delete Slots</Link>
    //         <Link to="/managerHome/managerProfile" className="link">Profile</Link>
    //       </div>
    //       <button onClick={handleLogout} className="logoutButton">Logout</button>
    //     </div>
    //   );
    return (
      
      <div className='managerPage'>
        <header className="manager-header">
          <h1 className="manager-title">Welcome {user.username}!</h1>
          <p className="manager-welcome-message">What would you like to do today !?</p>
        </header>
        <nav className="manager-navbar">
          <ul className="manager-nav-links">
            <li><Link to="/managerHome" className="nav-home">Home </Link></li>
            <li><Link to="/managerHome/changeRequirements" className='manager-nav-link'>Modify Membership Requirements </Link></li>
            <li><Link to="/managerHome/approvals" className="manager-nav-link">Approvals </Link></li>
            {/* <li><Link to="/managerHome/addCoordinators" className="manager-nav-link">Course Coordinators</Link></li> */}
            <li><Link to="/managerHome/organizeEvents" className="manager-nav-link">Organize Events </Link></li>
            <li><Link to="/managerHome/manageSlots" className="manager-nav-link">Manage Slots </Link></li>
            <li><Link to="/managerHome/notices" className="manager-nav-link">Add Notice </Link></li>
            <li><Link to="/managerHome/cancelreasons" className="manager-nav-link">Cancel Reasons</Link></li>
            <li><Link to="/managerHome/managerProfile" className="manager-nav-link">Profile </Link></li>
          </ul>
        </nav>
        <section className="manager-content">
          <div className="manager-announcements">
            <h2>Notices</h2>
            {notices.length > 0 && notices.map((notice, index) => (
                <div key={notice.id} className="notice-item">   
                    <p className= "notice-content">{notice.notice}</p>
                    <p className="date-posted">Date Posted: {new Date(notice.date_posted).toLocaleDateString()}</p>
                </div>
            ))}
          </div>
          <div className="manager-quick-links">
            <h2>Quick Links</h2>
            <ul>
              <li><Link to="/managerHome/changeRequirements">Modify Requirements</Link></li>
              <li><Link to="/managerHome/approvals">Approvals</Link></li>
              <li><Link to="/managerHome/notices">Add Notice</Link></li>
              <li><Link to="/posts">Posts</Link></li>
              </ul>
          </div>
        </section>
          <div className="manager-galleria">
          <h2 className='galleria-title'>Galleria <GrGallery /></h2>
            <div className="manager-gallery-images">
              <img src="https://i.redd.it/w85mp0j618o81.jpg" alt="Image 1" />
              <img src="https://s3-ap-southeast-2.amazonaws.com/production.assets.merivale.com.au/wp-content/uploads/2017/04/18131738/Merivale-26_edit_med.jpg" alt="Image 2" />
              <img src="https://static.wixstatic.com/media/794e26_720db5d0972c4a94935494c2725e3b7c~mv2.jpeg/v1/fill/w_2500,h_1525,al_c/794e26_720db5d0972c4a94935494c2725e3b7c~mv2.jpeg" alt="Image 3" />
              <img src="https://www.davidlloyd.es/-/media/david-lloyd/images/clubs/peterborough/new/dl-peterborough-indoor-pool-1440x780.jpg" alt="Image 4" />
              <img src="https://th.bing.com/th/id/R.b8498db13805c9732242213eb343f9ee?rik=up8oDOGXQy5Ejg&riu=http%3a%2f%2fmedia.lasvegasweekly.com%2fimg%2fphotos%2f2013%2f05%2f15%2fsapphire_pool_grand_opening_by_richard_anderson_t1000.jpg%3fc76bf34eada957f64a0b14990027a576ff9bf379&ehk=pJ%2bdRtdWQWQPzZDieihMSUkJG2OC3TSOgoagBoc5BVw%3d&risl=&pid=ImgRaw&r=0" alt="Image 5" />
              <img src="https://static.designmynight.com/uploads/2021/02/123914874_3839856032692597_7518941556411134986_o-optimised.jpg" alt="Image 6" />
              <img src="https://www.kljournalhotel.com/_uploads/files/pages/tsc/theswimmingclub_night.jpg" alt="Image 7" />
              <img src="https://the-club.com/wp-content/uploads/1-1-1500x1000.jpg" alt="Image 8" />
              <img src="https://th.bing.com/th/id/R.3f942a290ce91730555962ab059b59df?rik=Fx6%2bGscR793OPw&riu=http%3a%2f%2fwww.teamunify.com%2fmvcsc%2f_images%2fmphoto_7354_6_1562334413491.jpg&ehk=RzG5acGEEvu02xcqGaA3IBV12m0o8Lh0q48rfd7VY9Y%3d&risl=&pid=ImgRaw&r=0" alt="Image 8" />
              <img src="https://www.britishswimming.org/media/images/Swimming_Start_GAxaa4a.2e16d0ba.fill-1600x900_W9VdYJb.jpg" alt="Image 10" />
              <img src="https://www.swimnow.co.uk/wp-content/uploads/2016/11/phelpsfly-1024x576.jpg" alt="Image 9" />
              <img src="https://privatescreens.com/wp-content/uploads/2015/06/night-pool-12.jpg" alt="Image 11" />
              <img src="https://wallpaperaccess.com/full/3615254.jpg" alt="Image 12" />
              <img src="https://www.hdwallpapers.in/download/swimming_pool_of_a_cruise_ship_4k_hd_cruise_ship-HD.jpg" alt="Image 13" />
              <img src="https://th.bing.com/th/id/OIP.gR8eicXFOBADofZPjIPwnwHaFt?rs=1&pid=ImgDetMain" alt="Image 14" />
              {/* Add more image elements here */}
            </div>
        </div>
        <button onClick={handleLogout} className="manager-logoutButton">Logout</button>
      </div>
    );
    
    
    
}
export default ManagerHome
