import React, { useState } from 'react';
import { useNavigate, useLocation  } from "react-router-dom";
import useWindowDimensions from '../hooks/useWindowDimensions';

import { useTheme } from '@mui/material/styles';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import ListItemIcon from '@mui/material/ListItemIcon';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import StyledMenu from './StyledMenu';

// Icons
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import TripleDotsIcon from '@mui/icons-material/MoreVert';
import DarkModeIcon from '@mui/icons-material/ModeNight';
import LightModeIcon from '@mui/icons-material/LightMode';
import BeerIcon from '@mui/icons-material/SportsBar';


const Header = (props) => {
  const self = this;

  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { height, width } = useWindowDimensions();

  let viewingSport = null;

  const sports = [
    'CBB',
    'CFB ... coming soon',
    'NBA ... coming soon',
    'NFL ... coming soon',
  ];

  let selectedIndex = null;

  if (location && location.pathname) {
    const splat = location.pathname.split('/');
    if (
      splat &&
      splat.length > 1 &&
      sports.indexOf(splat[1]) > -1
    ) {
      selectedIndex = sports.indexOf(splat[1]);
      viewingSport = sports[selectedIndex];
    }
  }

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleHome = () => {
    window.location.href = "/";
  }

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleSport = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSportClose = () => {
    setAnchorEl(null);
  };

  const handleSportClick = (event, index) => {
    viewingSport = sports[index];
    handleSportClose();
    handleSportHome();
  };

  const handleSportHome = () => {
    navigate('/'+viewingSport+'/Ranking');
  }

  const [anchorMenu, setAnchorMenu] = useState(null);
  const menuOpen = Boolean(anchorMenu);

  const handleAnchorMenu = (event) => {
    setAnchorMenu(event.currentTarget);
  };

  const handleAnchorMenuClose = () => {
    setAnchorMenu(null);
  };



  let logoStyle = {
    // 'fontFamily': 'Consolas',
    'fontFamily': 'Courier New',
    'fontWeight': 600,
    'fontSize': '20px',
    'verticalAlign':'middle',
    'cursor': 'pointer',
  };

  if (props.theme === 'dark') {
    logoStyle.color = '#2ab92a';
  }



  return (
    <AppBar position="fixed">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx = {{ display: 'flex', mr: 1 }} style = {logoStyle} onClick = {handleHome}>{(width < 450 ? '> SR' : '> sportsranking.io')}<sup style = {{'fontSize': '14px'}}>beta</sup></Box>
          <Box sx={{ flexGrow: 1, display: 'flex' }}>
            <Button
              id="sports-picker-button"
              aria-controls={open ? 'sports-picker-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              variant="text"
              style = {{'color': '#fff'}}
              disableElevation
              onClick={handleSport}
              endIcon={<KeyboardArrowDownIcon />}
            >
              {viewingSport ? viewingSport : 'Sport'}
            </Button>
            <StyledMenu
              id="sports-picker-menu"
              MenuListProps={{
                'aria-labelledby': 'sports-picker-button',
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleSportClose}
            >
             {sports.map((sport, index) => (
              <MenuItem
                key={sport}
                disabled={index === selectedIndex || sport !== 'CBB'}
                selected={index === selectedIndex}
                onClick={(event) => handleSportClick(event, index)}
              >
                {sport}
              </MenuItem>
            ))}
            </StyledMenu>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <IconButton  onClick={handleAnchorMenu} color="inherit">
              <TripleDotsIcon />
            </IconButton>
            <Menu
              sx = {{'minWidth': 200}}
              id="header-menu"
              anchorEl={anchorMenu}
              open={menuOpen}
              onClose={handleAnchorMenuClose}
            >
              <MenuItem onClick={() => {
                handleAnchorMenuClose();
                // I put a timeout here because you can see the value of the menu change before closing
                setTimeout(props.handleTheme, 100);
              }}>
                <ListItemIcon>
                  {props.theme === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
                </ListItemIcon>
                {props.theme === 'dark' ? 'Light mode' : 'Dark mode'}
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => {
                handleAnchorMenuClose();
                window.open('https://www.buymeacoffee.com/lxeUvrCaH1', '_blank');
              }}>
                <ListItemIcon>
                  <BeerIcon />
                </ListItemIcon>
                Buy me a beer
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;