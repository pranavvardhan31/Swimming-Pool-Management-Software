import React, { useState, useEffect } from 'react';
import './FrontPage.css'; // Import CSS file for styling
import { BiMap } from "react-icons/bi";
import { BiPhone } from "react-icons/bi";
import { BiSolidPin } from "react-icons/bi";
import { BiWorld } from "react-icons/bi";
import { BiSolidMessageDetail } from "react-icons/bi";
import { FaPersonSwimming } from "react-icons/fa6";
import { Link } from 'react-router-dom'; 
import { FaSquareInstagram } from "react-icons/fa6";
import { FaFacebook } from "react-icons/fa";
import { FaYoutubeSquare } from "react-icons/fa";
import { GrTwitter } from "react-icons/gr";
function FrontPage(){
    const [currentImage, setCurrentImage] = useState(0); // State to track current image index
  // Array of image URLs for the slideshow
  const images = [
    'https://images4.alphacoders.com/729/729748.jpg',
    'https://getwallpapers.com/wallpaper/full/4/5/8/1297673-amazing-swimming-pics-for-wallpaper-3000x1679.jpg',
    'https://getwallpapers.com/wallpaper/full/5/c/b/519691.jpg',
    'https://wallpaper-house.com/data/out/12/wallpaper2you_550537.jpg',
    'https://swimming.events/assets/macclesfieldswimming-85c9baf4116f9d8e981bd18687710abf0a62b25d68f2c652d9adf45ecd851a43.jpg',
    'https://th.bing.com/th/id/R.50840711c62f3f82bcb9283ad07e4fdb?rik=U6sHJ%2fNAOs3vSg&riu=http%3a%2f%2fbeyondwords.life%2fwp-content%2fuploads%2f2016%2f05%2fiStock_000086729389_Medium.jpg&ehk=vWD6%2faZcZflfHNqLvhXmaUKBvnJQsIMzytlto3ecmjg%3d&risl=&pid=ImgRaw&r=0'
    
  ];
  // Function to switch to the next image
  const nextImage = () => {
    setCurrentImage((prevImage) => (prevImage === images.length - 1 ? 0 : prevImage + 1));
  };
  // Effect to switch images at regular intervals
  useEffect(() => {
    const interval = setInterval(nextImage, 5000); // Change image every 5 seconds
    return () => clearInterval(interval); // Cleanup function to clear interval on component unmount
  }, []);
  return (
    <div className="App" style={{ width: '100%', height: '100%' }}>
      <div className="big-image-container" style={{ width: '100%', height: '100%' }}>
        <nav>
          <div className="nav-header">
            <h1 className="nav-title">POOL MANAGEMENT <FaPersonSwimming /></h1>
          </div>
          <ul>
            <li className='nav-option'><Link to="/login">Log In</Link></li>
            <li className='nav-option'><Link to='/signup'>Sign Up</Link></li>
            <li className='nav-option'><Link to="/aboutUs">About Us</Link></li>
            <li className='nav-option'><Link to="/rules">Rules & Regulations</Link></li>
            <li className='nav-option'><a href="#">Notice</a></li>
          </ul>
        </nav>
        <div className="big-image">
          <img src={images[currentImage]} alt="Big Image" style={{ width: '100%', height: '100%' }} />
        </div>
      </div>
      <footer>
        <div className="contact-info">
          <p className="contact-title">Contact Us <BiWorld /></p>
          <div className="contact-details">
            <div className="phone-item">
              <span className="contact-label">Phone <BiPhone /></span>
              <span className="contact-text">:  +33-76543210 / +33-98765432</span>
            </div>
            <div className="address-item">
              <span className="contact-label">Address <BiSolidPin /></span>
              <span className="contact-text">:  4 Rue Nungesser et Coli, 75016 Paris, France</span>
            </div>
            <div className="location-item">
              <span className="contact-label">Location <BiMap /></span>
              <a className="contact-url" href="https://www.bing.com/ck/a?!&&p=2926b1e32d6cd7e5JmltdHM9MTcxMTQxMTIwMCZpZ3VpZD0zMzc3YjQ3OS1kMWU3LTY4MzQtMTQ0Yy1hNjNhZDAzNTY5ODImaW5zaWQ9NTc4Nw&ptn=3&ver=2&hsh=3&fclid=3377b479-d1e7-6834-144c-a63ad0356982&u=a1L21hcHM_Jm1lcGk9MH5-VW5rbm93bn5BZGRyZXNzX0xpbmsmdHk9MTgmcT1QaXNjaW5lJTIwTW9saXRvciZzcz15cGlkLllOMjAwMHgxNTE4NTcxNjIxNjMxNzczNjY5NiZwcG9pcz00OC44NDUyMDcyMTQzNTU0N18yLjI1MzMzOTA1MjIwMDMxNzRfUGlzY2luZSUyME1vbGl0b3JfWU4yMDAweDE1MTg1NzE2MjE2MzE3NzM2Njk2fiZjcD00OC44NDUyMDd-Mi4yNTMzMzkmdj0yJnNWPTEmRk9STT1NUFNSUEw&ntb=1">:  Click Here</a>
            </div>
            <div className="email-item">
              <span className="contact-label">Email <BiSolidMessageDetail /></span>
              <span className="contact-text">:  piscinemolitor@gmail.com</span>
            </div>
            <div className="social-icons">
              <a href="https://www.instagram.com/your_instagram_account" className='insta'><FaSquareInstagram /></a>
              <a href="https://www.facebook.com/your_facebook_account" className='facebook'><FaFacebook /></a>
              <a href="https://www.youtube.com/your_youtube_account" className='youtube'><FaYoutubeSquare /></a>
              <a href="https://twitter.com/your_twitter_account" className='twitter'><GrTwitter /></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
export default FrontPage
