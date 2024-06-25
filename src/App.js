import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Home';
import BookSlots from './pages/Member/BookSlots';
import BookPool from './pages/Member/BookPool';
import Events from './pages/Member/Events';
import GetMembership from './pages/Member/GetMembership';
import Notifications from './pages/Member/Notifications';
import Profile from './pages/Member/Profile';
import Login from './Login';
import Signup from './Signup';
import ManagerHome from './pages/Manager/ManagerHome';
// import CCHome from './pages/Course Coordinator/CCHome';
import MemberHome from './pages/Member/MemberHome';
import { AuthProvider, useAuth } from './AuthContext';
import Approvals from './pages/Manager/Approvals';
import AddCoordinators from './pages/Manager/AddCoordinators';
import OrganizeEvents from './pages/Manager/OrganizeEvents';
import ManagerProfile from './pages/Manager/ManagerProfile';
import MembershipReqir from './pages/Manager/MembershipReqir';
import PayMembership from './pages/Member/payMembership';
import ManageSlots from './pages/Manager/ManageSlots';
import FrontPage from './FrontPage';
import AboutUs from './AboutUs';
import Rules from './Rules'
import CancelReasons from './pages/Manager/CancelReasons';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Notices from './pages/Manager/Notices';
import SocialPage from './Posts';
const stripePromise = loadStripe('pk_test_51P4L5oSBiOISJn04ql5nOL6MYwJM1AcauFgh9V05mqqCb9PEK6kSKsAxjLodf3Q97ymq6KQiy8ezcXlEKhF9aKiA00XfC9Se08'); // Replace with your actual publishable key


const App = () => {
  return (
    <Elements stripe={stripePromise}>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          
          <Route path="/" element={<FrontPage />} />
          <Route path="/AboutUs" element={<AboutUs />} />
          <Route path="/Rules" element={<Rules />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          <Route
            path="/home"
            element={<Home></Home>}
          />
          <Route
            path="/memberHome"
            element={<MemberHome></MemberHome>}
          />
        
          <Route
            path="/memberHome/bookSlots"
            element={<BookSlots />}
          />
          <Route
            path="/memberHome/bookPool"
            element={<BookPool />}
          />
          <Route
            path="/memberHome/events"
            element={<Events />}
          />
          <Route
            path="/memberHome/getMembership"
            element={<GetMembership />}
          />
          <Route
            path="/memberHome/notifications"
            element={<Notifications />}
          />
          <Route
            path="/memberHome/profile"
            element={<Profile />}
          />
          <Route
            path="/memberHome/payMembership"
            element ={<PayMembership></PayMembership>}
            >
          </Route>
            <Route
            path="/managerHome"
            element={<ManagerHome></ManagerHome>}
          />
          <Route
              path="/managerHome/notices"
              element ={<Notices></Notices>}>
              </Route>
            <Route
              path="/posts"
              element = {<SocialPage></SocialPage>}>
              </Route>


          <Route path="/managerHome/approvals" element={<Approvals/>}></Route>
          <Route path='/managerHome/manageSlots' element={<ManageSlots></ManageSlots>}></Route>
          <Route path="/managerHome/addCoordinators" element={<AddCoordinators/>}></Route>
          <Route path="/managerHome/organizeEvents" element={<OrganizeEvents/>}></Route>
          <Route path="/managerHome/managerProfile" element={<ManagerProfile />}></Route>
          <Route path="/managerHome/changeRequirements" element={<MembershipReqir></MembershipReqir>}></Route>
          <Route path ="/managerHome/cancelReasons" element={<CancelReasons></CancelReasons>} ></Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </Elements >

  );
};

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();

  return user ? children : <Navigate to="/" replace/>;
};

export default App;
