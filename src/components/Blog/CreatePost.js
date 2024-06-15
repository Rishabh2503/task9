import React, { useState, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';
import { addPost } from '../../indexedDB';
import { Button, TextField, Typography, Grid, Paper, IconButton, Tooltip } from '@mui/material';
import { Box } from '@mui/system';
import { HighlightAlt, Send } from '@mui/icons-material';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();
  const quillRef = useRef();

  const handleHighlight = () => {
    const quill = quillRef.current.getEditor();
    const range = quill.getSelection();
    if (range) {
      quill.formatText(range.index, range.length, { background: 'rgba(255, 235, 59, 0.5)' });
    }
  };

  const handleSubmit = async () => {
    try {
      await addPost({ title, content, date: new Date() });
      navigate('/posts');
    } catch (error) {
      console.error('Error submitting post:', error);
      alert('Error submitting post. Please try again.');
    }
  };

  return (
    <Box className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4 sm:p-6 md:p-8">
      <Paper className="max-w-3xl w-full p-8 rounded-2xl shadow-lg bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg">
        <Typography variant="h3" className="text-center text-white font-bold mb-8">
          Create a Blog
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <TextField
              label="Blog Post Heading"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Post Title"
              fullWidth
              variant="outlined"
              InputProps={{
                className: 'rounded-lg bg-white bg-opacity-20 text-black placeholder-gray-100',
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <div className="rounded-2xl overflow-hidden border border-white border-opacity-20 shadow-lg bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg">
              <ReactQuill
                ref={quillRef}
                value={content}
                onChange={setContent}
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
                className="min-h-lg max-h-[500px] overflow-y-auto p-4 text-black"
              />
            </div>
          </Grid>
          <Grid item xs={12} className="flex items-center justify-between">
            <Tooltip title="Highlight selected text" placement="top">
              <IconButton
                onClick={handleHighlight}
                className="bg-yellow-200 hover:bg-yellow-600 text-white rounded-full"
              >
                <HighlightAlt />
              </IconButton>
            </Tooltip>
            <Button
              onClick={handleSubmit}
              variant="contained"
              color="secondary"
              size="large"
              startIcon={<Send />}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
            >
              Submit Post
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default CreatePost;
