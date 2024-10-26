'use client';

import React, { useState, useRef, RefObject } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';

import Footer from '../components/generic/Footer';

import Pricing from '@/components/generic/Pricing';
import { getLogoColorPrimary, getLogoColorSecondary } from '@/components/utils/Color';
import { CardActionArea, Paper, useTheme } from '@mui/material';

import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BuildIcon from '@mui/icons-material/Build';
import TrendsExample from '@/components/generic/Home/TrendsExample';
import RankingExample from '@/components/generic/Home/RankingExample';
import ToolsExample from '@/components/generic/Home/ToolsExample';
import { Dimensions, useWindowDimensions } from '@/components/hooks/useWindowDimensions';

const Home = () => {
  const [selectedHero, setSelectedHero] = useState('trends');

  const theme = useTheme();

  const { width } = useWindowDimensions() as Dimensions;

  const ref: RefObject<HTMLDivElement> = useRef(null);

  const cards = [
    {
      id: 'trends',
      name: 'Trends',
      icon: <TrendingUpIcon fontSize = 'medium' style = {{ display: 'inline-block', color: theme.palette.success.dark }} />,
      description: 'View trends of any statistic. See data at any point in time and how it compares to league and conference averages.',
    },
    {
      id: 'rankings',
      name: 'Rankings',
      icon: <EmojiEventsIcon fontSize = 'medium' style = {{ display: 'inline-block', color: theme.palette.warning.dark }} />,
      description: 'Rank every team, coach, player, conference. Also view ranks of each individual metric.',
    },
    {
      id: 'tools',
      name: 'Tools',
      icon: <BuildIcon fontSize = 'medium' style = {{ display: 'inline-block', color: theme.palette.secondary.dark }} />,
      description: 'Powerful comparison and prediction tools to scout any match up. Compare stats, roster, trends.',
    },
  ];

  const getHero = () => {
    const contents: React.JSX.Element[] = [];

    if (selectedHero === 'trends') {
      contents.push(
        <Paper style = {{ width: '100%', padding: '0px 0px 10px 0px' }}>
          <TrendsExample />
        </Paper>,
      );
    }

    if (selectedHero === 'rankings') {
      contents.push(
        <Paper style = {{ width: '100%', padding: '0px' }}>
          <RankingExample />
        </Paper>,
      );
    }

    if (selectedHero === 'tools') {
      contents.push(
        <Paper style = {{ width: '100%' }}>
          <ToolsExample />
        </Paper>,
      );
    }

    return (
      <div style = {{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {contents}
      </div>
    );
  };

  let cardWidth = 300;
  const breakPoint = 425;

  const hitBreakPoint = (width <= breakPoint);

  if (hitBreakPoint) {
    cardWidth = 105;
  }

  return (
    <div>
      <main>
        <Box
          sx={{
            pt: 2,
          }}
        >
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              style = {{ fontWeight: 600, fontStyle: 'italic' }}
              gutterBottom
            >
              {<><span style = {{ color: getLogoColorPrimary() }}>s</span><span style = {{ color: getLogoColorSecondary() }}>Rating</span></>}
            </Typography>
            <Typography variant="h5" align="center" color="text.secondary" paragraph>
              Analysis tools, picks for 🏀 & 🏈, <br /> no ads, <Link underline="hover" href = "https://github.com/esmalleydev/srating.io-gui" target = "_blank">open-source</Link>
            </Typography>
          </Container>
        </Box>
        <div style = {{ padding: '0px 5px  5px 5px', display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
          {cards.map((card) => {
            const cardStyle: React.CSSProperties = {
              maxWidth: cardWidth,
              minWidth: cardWidth,
              margin: '5px',
              border: `2px solid ${card.id === selectedHero ? theme.palette.info.dark : 'transparent'}`
            };

            const cardContentStyle: React.CSSProperties = {

            };

            if (hitBreakPoint) {
              cardContentStyle.padding = 8;
            }

            return (
              <Card sx={cardStyle}>
                <CardActionArea style={{ height: '100%' }} onClick={() => setSelectedHero(card.id)}>
                  <CardContent style = {cardContentStyle}>
                    <div style = {{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><Typography variant={(hitBreakPoint ? 'body1' : 'h6')} style = {{ display: 'inline-block' }}>{card.name}</Typography>{card.icon}</div>
                    {
                    hitBreakPoint ? '' :
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {card.description}
                    </Typography>
                    }
                  </CardContent>
                </CardActionArea>
              </Card>
            );
          })}
        </div>
        <div style = {{ width: '100%', maxWidth: 900, margin: 'auto', padding: '0px 5px 5px 5px' }}>
          {getHero()}
        </div>
        <div ref = {ref} style = {{ padding: '10px 10px' }}>
          <Pricing />
        </div>
      </main>
      <div style = {{ padding: '20px 0px 0px 0px' }}><Footer /></div>
    </div>
  );
};

export default Home;
