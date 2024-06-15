import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, InputBase, Menu, MenuItem, useMediaQuery } from '@mui/material';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/system';

const GradientAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(to right, #6a11cb, #2575fc)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
  padding: theme.spacing(2),
}));

const SearchContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '20px',
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  padding: theme.spacing(1),
  flexGrow: 1,
  maxWidth: '300px',
}));

const NavButton = styled(Button)(({ theme }) => ({
  color: '#fff',
  marginLeft: theme.spacing(2),
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
}));

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width:600px)');

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <GradientAppBar position="static">
      <Toolbar>
        {isMobile ? (
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleMenuOpen}>
            <MenuIcon />
          </IconButton>
        ) : null}
        <Typography variant="h6" style={{ flexGrow: 1, marginLeft: isMobile ? '20px' : null }}>
          Rishabh's Blog
        </Typography>
        {isMobile ? (
          <>
            <IconButton onClick={handleSearchToggle}>
              <SearchIcon style={{ color: '#fff' }} />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem component={Link} to="/posts" onClick={handleMenuClose}>Blog</MenuItem>
              <MenuItem component={Link} to="/create" onClick={handleMenuClose}>Create</MenuItem>
            </Menu>
          </>
        ) : (
          <SearchContainer>
            <IconButton onClick={handleSearchToggle}>
              <SearchIcon style={{ color: '#fff' }} />
            </IconButton>
            {isSearchOpen && (
              <InputBase
                placeholder="Search blog..."
                style={{ flexGrow: 1, color: '#fff' }}
              />
            )}
          </SearchContainer>
        )}
        {!isMobile && (
          <>
            <NavButton component={Link} to="/posts">
              Blog
            </NavButton>
            <NavButton component={Link} to="/create">
              Create
            </NavButton>
          </>
        )}
      </Toolbar>
    </GradientAppBar>
  );
};

export default Navbar;
