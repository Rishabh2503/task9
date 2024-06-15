import React, { useEffect, useState, useRef } from 'react';
import { getPosts, deletePost, updatePost } from '../../indexedDB';
import { TextField, Button, Container, Typography, Grid, Card, CardMedia, CardContent, CardActions, IconButton, Tooltip } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { HighlightAlt } from '@mui/icons-material';

const BlogPosts = () => {
  const [posts, setPosts] = useState([]);
  const [editingPost, setEditingPost] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const quillRef = useRef();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsData = await getPosts();
        const postsWithImages = postsData.map(post => ({
          ...post,
          image: `https://picsum.photos/600/400?random=${post.id}`
        }));
        setPosts(postsWithImages);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setError('Error fetching posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);
  
  const handleAddPost = () => {
    navigate('/create');
  };

  const handleDelete = async (id) => {
    await deletePost(id);
    setPosts(posts.filter(post => post.id !== id));
  };

  const handleEdit = (post) => {
    setEditingPost(post.id);
    setEditedTitle(post.title);
    setEditedContent(post.content);
  };

  const handleSave = async () => {
    if (editingPost && editedTitle && editedContent) {
      await updatePost({ id: editingPost, title: editedTitle, content: editedContent });
      setPosts(posts.map(post => post.id === editingPost ? { ...post, title: editedTitle, content: editedContent } : post));
      setEditingPost(null);
      setEditedTitle('');
      setEditedContent('');
    }
  };

  const handleCancel = () => {
    setEditingPost(null);
    setEditedTitle('');
    setEditedContent('');
  };

  const handleHighlight = () => {
    const quill = quillRef.current.getEditor();
    const range = quill.getSelection();
    if (range) {
      quill.formatText(range.index, range.length, { background: 'rgba(255, 235, 59, 0.5)' });
    }
  };

  if (loading) return <Typography variant="h5" align="center">Loading posts...</Typography>;
  if (error) return <Typography variant="h5" align="center">{error}</Typography>;

  return (
    <Container maxWidth="xl" className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6">
      <Typography variant="h3" component="h1" align="center" gutterBottom className='text-white capitalize'>
        Blog Posts
      </Typography>
      
      <Grid container spacing={4}>
        {posts.map((post) => (
          <Grid item xs={12} sm={6} md={4} key={post.id}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={post.image}
                  alt="Blog Image"
                />
                <CardContent>
                  {editingPost === post.id ? (
                    <div>
                      <TextField
                        fullWidth
                        label="Title"
                        variant="outlined"
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        sx={{ mb: 2 }}
                      />
                      <ReactQuill
                        ref={quillRef}
                        value={editedContent}
                        onChange={setEditedContent}
                        modules={{
                          toolbar: [
                            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                            [{ size: [] }],
                            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                            [{ 'list': 'ordered' }, { 'list': 'bullet' },
                            { 'indent': '-1' }, { 'indent': '+1' }],
                            ['link', 'image', 'video'],
                            ['clean'],
                            [{ 'color': [] }, { 'background': [] }],
                          ],
                          clipboard: {
                            matchVisual: false,
                          }
                        }}
                        formats={[
                          'header', 'font', 'size',
                          'bold', 'italic', 'underline', 'strike', 'blockquote',
                          'list', 'bullet', 'indent',
                          'link', 'image', 'video', 'color', 'background'
                        ]}
                        className="min-h-[200px] max-h-[300px] overflow-y-auto"
                      />
                      <div className="flex items-center justify-between mt-2">
                        <Tooltip title="Highlight selected text" placement="top">
                          <IconButton
                            onClick={handleHighlight}
                            className="bg-yellow-200 hover:bg-yellow-600 text-white rounded-full"
                          >
                            <HighlightAlt />
                          </IconButton>
                        </Tooltip>
                        <div>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSave}
                            sx={{ marginRight: 2 }}
                          >
                            Save
                          </Button>
                          <Button
                            variant="outlined"
                            onClick={handleCancel}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <Typography variant="h5" component="h2" gutterBottom>
                        {post.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        {new Date(post.date).toLocaleDateString()}
                      </Typography>
                      <div
                        className="ql-editor"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                      />
                    </div>
                  )}
                </CardContent>
                <CardActions>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleEdit(post)}
                    sx={{ marginRight: 2 }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDelete(post.id)}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </motion.div>
          </Grid>
          
        ))}
      </Grid>
      <div className='flex item-center justify-center mt-10'>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddPost}
          sx={{ marginBottom: 4 }}
        >
          Create Blog
        </Button>
      </div>
    </Container>
  );
};

export default BlogPosts;
