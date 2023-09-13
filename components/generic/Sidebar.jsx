import React, { useState } from 'react';
import { useRouter } from 'next/router';

import { useTheme } from '@mui/material/styles';


import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

// import TripleDotsIcon from '@mui/icons-material/MoreVert';
import GitHubIcon from '@mui/icons-material/GitHub';
import DarkModeIcon from '@mui/icons-material/ModeNight';
import LightModeIcon from '@mui/icons-material/LightMode';
import BeerIcon from '@mui/icons-material/SportsBar';
import HomeIcon from '@mui/icons-material/Home';
import RSSFeedIcon from '@mui/icons-material/RssFeed';
import RankingIcon from '@mui/icons-material/EmojiEvents';
import ScoresIcon from '@mui/icons-material/Scoreboard';
import PicksIcon from '@mui/icons-material/Casino';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArticleIcon from '@mui/icons-material/Article';


const Sidebar = (props) => {
  const self = this;

  const theme = useTheme();
  const router = useRouter();
  // const [spin, setSpin] = useState(false);

  // todo allow keyboard to click the option on enter keydown
  /*
  const handleClick = (e) => {
    console.log(e);
  }
  */
 
  const handleRanking = () => {
    // setSpin(true);
    router.push('/cbb/ranking').then(() => {
      // setSpin(false);
    });
  };

  const handleScores = () => {
    // setSpin(true);
    sessionStorage.removeItem('CBB.GAMES.DATA');
    router.push('/cbb/games').then(() => {
      // setSpin(false);
    });
  };

  const handlePicks = () => {
    // setSpin(true);
    router.push('/cbb/picks').then(() => {
      // setSpin(false);
    });
  };


  return (
    <div>
      <Box
        sx={{'width': 250}}
        role="presentation"
        // onClick={handleClick}
        // onKeyDown={handleClick}
      >
        <List>
          <ListItem key={'home'} disablePadding onClick = {() => {router.push('/')}}>
            <ListItemButton>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary={'Home'} />
            </ListItemButton>
          </ListItem>

          <Divider />

          <ListItem key={'ranking'} disablePadding onClick = {handleRanking}>
            <ListItemButton>
              <ListItemIcon>
                <RankingIcon />
              </ListItemIcon>
              <ListItemText primary={'Ranking'} />
            </ListItemButton>
          </ListItem>

          <ListItem key={'scores'} disablePadding onClick = {handleScores}>
            <ListItemButton>
              <ListItemIcon>
                <ScoresIcon />
              </ListItemIcon>
              <ListItemText primary={'Scores'} />
            </ListItemButton>
          </ListItem>

          <ListItem key={'picks'} disablePadding onClick = {handlePicks}>
            <ListItemButton>
              <ListItemIcon>
                <PicksIcon />
              </ListItemIcon>
              <ListItemText primary={'Picks'} />
            </ListItemButton>
          </ListItem>

          <ListItem key={'blog'} disablePadding onClick = {() => {router.push('/blog')}}>
            <ListItemButton>
              <ListItemIcon>
                <RSSFeedIcon />
              </ListItemIcon>
              <ListItemText primary={'Blog'} />
            </ListItemButton>
          </ListItem>

          <Divider />

          <ListItem key={'pricing'} disablePadding onClick = {() => {router.push('/pricing')}}>
            <ListItemButton>
              <ListItemIcon>
                <ShoppingCartIcon />
              </ListItemIcon>
              <ListItemText primary={'Subscriptions'} />
            </ListItemButton>
          </ListItem>

          <ListItem key={'api'} disablePadding onClick = {() => {window.open('https://docs.srating.io', '_blank');}}>
            <ListItemButton>
              <ListItemIcon>
                <ArticleIcon />
              </ListItemIcon>
              <ListItemText primary={'API Documentation'} />
            </ListItemButton>
          </ListItem>

          <Divider />

          <ListItem key={'theme'} disablePadding onClick = {() => {setTimeout(props.handleTheme, 100);}}>
            <ListItemButton>
              <ListItemIcon>
                {props.theme === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
              </ListItemIcon>
              <ListItemText primary={props.theme === 'dark' ? 'Light mode' : 'Dark mode'} />
            </ListItemButton>
          </ListItem>

          <ListItem key={'github'} disablePadding onClick = {() => {window.open('https://github.com/esmalleydev/srating.io-gui', '_blank');}}>
            <ListItemButton>
              <ListItemIcon>
                <GitHubIcon />
              </ListItemIcon>
              <ListItemText primary={'Github'} />
            </ListItemButton>
          </ListItem>

          <ListItem key={'beer'} disablePadding onClick = {() => {window.open('https://www.buymeacoffee.com/lxeUvrCaH1', '_blank');}}>
            <ListItemButton>
              <ListItemIcon>
                <BeerIcon />
              </ListItemIcon>
              <ListItemText primary={'Buy me a beer'} />
            </ListItemButton>
          </ListItem>
        </List>
        <Divider />
      </Box>
    </div>
  );
}

/*
const [anchorMenu, setAnchorMenu] = useState(null);
  const menuOpen = Boolean(anchorMenu);

  const handleAnchorMenu = (event) => {
    setAnchorMenu(event.currentTarget);
  };

  const handleAnchorMenuClose = () => {
    setAnchorMenu(null);
  };
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
 */

export default Sidebar;