import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Posts.css';
import { IoIosArrowBack } from "react-icons/io";
import { Link, Navigate } from 'react-router-dom';

const SocialPage = () => {
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [userInfo, setUserInfo] = useState({});
  useEffect(() => {
    fetchUserInfo();
    fetchPosts();
  }, []);
  
  const fetchUserInfo = async () => {
    try {
      const response = await axios.get('https://xwqkcw08-8000.inc1.devtunnels.ms/userInfo');
      setUserInfo(response.data);
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await axios.get('https://xwqkcw08-8000.inc1.devtunnels.ms/posts');
      setPosts(response.data.reverse());
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handlePostSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('https://xwqkcw08-8000.inc1.devtunnels.ms/posts', {
        post: newPostContent,
        username: userInfo.username
      });
      console.log('New post created:', response.data);
      setNewPostContent('');
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };
  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`https://xwqkcw08-8000.inc1.devtunnels.ms/posts/${postId}`);
      console.log('Post deleted successfully');
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };
  return (
    <div>
      <div className="social-container">
      <div>
          <Link to="/home" className='posts-back'><IoIosArrowBack /> Back </Link>
      </div>
        <form className="post-form" onSubmit={handlePostSubmit}>
          <textarea
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            placeholder="Write your post here..."
            rows="4"
            cols="50"
            required
          ></textarea>
          <br />
          <button type="submit" className="post-btn">Post</button>
        </form>
        <h3>Posts:</h3>
        <ul className="post-list">
          {posts.map(post => (
            
            <li key={post.id} className="post-item">
              <div className="post-username">{post.username}</div>
              <div className="post-content">{post.post}</div>
              {post.username === userInfo.username && (
                <button className="delete-post-btn" onClick={() => handleDeletePost(post.id)}>Delete</button>
              )}
              
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default SocialPage;
