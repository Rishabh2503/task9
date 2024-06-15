// HomePage.js
import React, { useEffect, useState } from 'react';

import {  CircularProgress } from '@mui/material';
import { getPosts } from '../indexedDB';
import BlogPosts from '../components/Blog/BlogPosts';

const HomePage = () => {
  const [, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsData = await getPosts();
        setPosts(postsData);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <BlogPosts />
  );
};

export default HomePage;
