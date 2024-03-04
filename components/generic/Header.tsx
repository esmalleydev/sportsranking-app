'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
// import { Link } from 'next/link';
import { useWindowDimensions, Dimensions } from '@/components/hooks/useWindowDimensions';
// import useMediaQuery from '../hooks/useMediaQuery';

import { styled, useTheme } from '@mui/material/styles';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';

// Icons
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import sratingLogo from '../../public/favicon-32x32.png';

import Sidebar from './Sidebar';
import Search from './Search';
import AccountHandler from './AccountHandler';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { setSession, setValidSession } from '../../redux/features/user-slice';
import { Avatar, Divider, ListItemIcon, Tooltip } from '@mui/material';
import { clear } from '@/redux/features/compare-slice';


const SignUpButton = styled(Button)(({ theme }) => ({
  'color': theme.palette.mode === 'light' ? '#fff' : theme.palette.success.main,
  'border': '1px solid ' + (theme.palette.mode === 'light' ? '#fff' : theme.palette.success.main),
  '&:hover': {
    'border': '1px solid ' + (theme.palette.mode === 'light' ? '#fff' : theme.palette.success.light),
    // backgroundColor: (theme.palette.mode === 'light' ? '#fff' : theme.palette.success.dark),
  },
}));

// todo hook up settings with router

const Header = () => {
  const self = this;

  const dispatch = useAppDispatch();
  const validSession = useAppSelector(state => state.userReducer.isValidSession);
  const theme = useTheme();

  const router = useRouter();
  const { width } = useWindowDimensions() as Dimensions;

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [fullSearch, setFullSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [spin, setSpin] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    setIsLoading(false);
  }, []);


  const handleHome = () => {
    setSpin(true);
    startTransition(() => {
      router.push('/');
      setSpin(false);
    });
  };

  const handleCompare = () => {
    setSpin(true);
    startTransition(() => {
      dispatch(clear());
      router.push('/cbb/compare');
      setSpin(false);
    });
  };


  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };


  const handleAccount = () => {
    handleClose();
    if (validSession) {
      setSpin(true);
      startTransition(() => {
        router.push('/account');
        setSpin(false);
      });
      return;
    }
    setAccountOpen(true);
  };

  const handleAccountClose = () => {
    setAccountOpen(false);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    localStorage.removeItem('session_id');
    // sessionStorage.clear();
    dispatch(setValidSession(false));
    dispatch(setSession(null));
    setSpin(true);
    startTransition(() => {
      router.push('/');
      setSpin(false);
    });
  };


  let logoStyle: React.CSSProperties = {
    // 'fontFamily': 'Consolas',
    // 'fontFamily': 'Courier New',
    'fontWeight': 600,
    'fontSize': '20px',
    'fontStyle': 'italic',
    'verticalAlign':'middle',
    'cursor': 'pointer',
  };

  if (theme.palette.mode === 'dark') {
    logoStyle.color = '#2ab92a';
    // purple #b92ab9
  }

  return (
    <AppBar position="fixed">
      {isLoading ? <Container maxWidth="xl"><Toolbar disableGutters /></Container> : // This prevents flashing on mobile since mediaQuery / width is a hook, will not be useable for first load
      <div>
        <Container maxWidth="xl">
          {
            fullSearch ?
              <Toolbar disableGutters>
                <IconButton onClick = {() => {setFullSearch(false);}} size="large" edge="start" color="inherit" aria-label="menu">
                  <ArrowBackIcon />
                </IconButton>
                <Box sx={{ flexGrow: 1, display: 'flex' }}>
                  <Search onRouter = {() => {setFullSearch(false);}} focus = {true} />
                </Box>
              </Toolbar> :
              <Toolbar disableGutters>
                <IconButton onClick = {toggleDrawer} size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                  <MenuIcon />
                  <Drawer
                    open={drawerOpen}
                    onClose={toggleDrawer}
                  >
                    <Sidebar />
                  </Drawer>
                </IconButton>
                <Box sx = {{ display: 'flex', mr: 1, 'alignItems': 'center' }} style = {logoStyle} onClick = {handleHome}>
                  <img src={sratingLogo.src} width = '20' height = '20' style = {{'marginRight': 5}} />
                  <span style = {{'color': '#FDD835'}}>S</span>{'RATING'}
                </Box>
                <Box sx={{ flexGrow: 1, display: 'flex' }}>
                </Box>
                <Box sx={{ flexGrow: 0 }}>{width > 320 ? <Tooltip title = {'Compare tool'}><IconButton onClick={handleCompare} color = 'inherit'><QueryStatsIcon /></IconButton></Tooltip> : ''}</Box>
                <Box sx={{ flexGrow: 0, 'marginRight': (width < 600 ? 0 : '5px') }}>
                  {width < 625 ? <IconButton onClick={() => {setFullSearch(true);}} color="inherit"><SearchIcon /></IconButton> : <Search />}
                </Box>
                <Box sx={{ flexGrow: 0 }}>
                  {
                  validSession ? 
                    <div>
                      <IconButton  onClick={handleMenu} color="inherit">
                        <AccountCircle />
                      </IconButton>
                      {/* <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                        }}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                      >
                        <MenuItem onClick={handleAccount}>My account</MenuItem>
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                      </Menu> */}
                       <Menu
                        anchorEl={anchorEl}
                        id="account-menu"
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                        onClick={handleClose}
                        PaperProps={{
                          elevation: 0,
                          sx: {
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            '& .MuiAvatar-root': {
                              width: 32,
                              height: 32,
                              ml: -0.5,
                              mr: 1,
                            },
                            '&::before': {
                              content: '""',
                              display: 'block',
                              position: 'absolute',
                              top: 0,
                              right: 14,
                              width: 10,
                              height: 10,
                              bgcolor: 'background.paper',
                              transform: 'translateY(-50%) rotate(45deg)',
                              zIndex: 0,
                            },
                          },
                        }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                      >
                        <MenuItem onClick={handleAccount}>
                          <ListItemIcon>
                            <AccountCircleIcon fontSize="small" />
                          </ListItemIcon>
                          My account
                        </MenuItem>
                        <Divider />
                        {/* <MenuItem onClick={handleClose}>
                          <ListItemIcon>
                            <Settings fontSize="small" />
                          </ListItemIcon>
                          Settings
                        </MenuItem> */}
                        <MenuItem onClick={handleLogout}>
                          <ListItemIcon>
                            <Logout fontSize="small" />
                          </ListItemIcon>
                          Logout
                        </MenuItem>
                      </Menu>
                    </div>
                  : 
                    <div>
                      {/* {width >= 425 ? <SignUpButton style = {{'marginRight': 5}} variant = 'outlined' disableElevation onClick={() => {router.push('/pricing');}}>Sign up</SignUpButton> : ''} */}
                      <Button color = {theme.palette.mode === 'light' ? 'secondary' : 'success'} variant = 'contained' disableElevation onClick={handleAccount}>{width > 425 ? 'Signup / Login' : 'Login'}</Button>
                    </div>
                  }
                </Box>
              </Toolbar>
          }
        </Container>
        <AccountHandler open = {accountOpen} closeHandler = {handleAccountClose} />
      </div>
      }
    </AppBar>
  );
}

export default Header;
