import React, { useState, useEffect } from 'react';
import './AboutUs.css'; // Import CSS file for styling
import { PiInstagramLogoThin } from "react-icons/pi";
import { CiFacebook } from "react-icons/ci";
import { CiTwitter } from "react-icons/ci";
import { CiYoutube } from "react-icons/ci";
import { Link } from 'react-router-dom';
import { IoIosArrowBack } from "react-icons/io";

function About() {
  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.body.offsetHeight;

      if (scrollY + windowHeight >= fullHeight) {
        setShowFooter(true);
      } else {
        setShowFooter(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="about-container">
      <div className="about-content">
        <h2>About Us</h2>
        <p>Piscine Molitor, nestled in the heart of Paris, France, is an emblem of timeless elegance and luxury. Established in 1929, this historic swimming pool complex has captivated visitors worldwide with its stunning Art Deco architecture and sophisticated ambiance. Comprising both indoor and outdoor pools, Piscine Molitor offers a unique blend of recreation and relaxation. Renowned for its chic atmosphere and upscale amenities, including spa services, fitness facilities, and gourmet dining options, it remains a cherished destination for both locals and tourists seeking a memorable aquatic experience. Piscine Molitor continues to uphold its legacy as a symbol of prestige and indulgence, inviting guests to immerse themselves in its rich history and unparalleled charm.</p>
        <div className="about-manager-info">
          <img src="https://img.freepik.com/premium-vector/manager-sitting-his-desk-cartoon-vector_723224-1092.jpg" alt="Manager" />
          <div className="about-manager-details">
            <h4 className='say-hi'>Say Hi to our Mr. Manager !</h4>
            <p>Mr. Manager is a seasoned professional with over 15 years of experience in the swimming pool management industry. He is passionate about ensuring that our clients receive the highest level of service and satisfaction.</p>
            <p>With his extensive knowledge and leadership skills, Mr. Manager oversees all aspects of our operations, from staff management to quality control. He is committed to maintaining our reputation as a trusted provider of swimming pool management services.</p>
          </div>
        </div>
      </div>
      <div>
          <Link to="/" className='aboutus-back'><IoIosArrowBack /> Back </Link>
      </div>
      {showFooter && (
        <footer className="about-footer">
          <div className="about-follow-us">
            <p><PiInstagramLogoThin /> pranav.vardhan      |       <CiFacebook /> parimi_nishnath        |        <CiTwitter /> pratapgiriSathvik#420          |         <CiYoutube /> spms_pool </p>
          </div>
        </footer>
      )}
    </div>
  );
}

export default About;
