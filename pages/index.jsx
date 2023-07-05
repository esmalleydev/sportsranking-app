import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

import Image from 'next/image'
import Button from '@mui/material/Button';
import CameraIcon from '@mui/icons-material/PhotoCamera';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';

import rankingImage from '../public/static/images/ranking.png';
import scoresImage from '../public/static/images/scores.png';
import picksImage from '../public/static/images/picks.png';
import teamImage from '../public/static/images/team.png';
import gameImage from '../public/static/images/statcompare.png';
import playerImage from '../public/static/images/player.png';

const Home = (props) => {

  const router = useRouter();

  const hash = process.env.COMMIT_HASH;
  const commitDate = process.env.COMMIT_DATE;

  const cards = [
    {
      'value': 'cbb_ranking',
      'heading': 'Ranking',
      'image': rankingImage,
      'contents': 'Aggregate rankings for college basketball teams and players. Sort by any ranking metric, filter by conference, season.',
      'action': () => {router.push('/cbb/ranking');}
    },
    {
      'value': 'cbb_scores',
      'heading': 'Scores',
      'image': scoresImage,
      'contents': 'View scores real time, with live odds. Filter by conference, game status.',
      'action': () => {router.push('/cbb/games');}
    },
    {
      'value': 'cbb_picks',
      'heading': 'Picks',
      'image': picksImage,
      'contents': 'View my picks for today\'s games, along with a betting calculator to customize odds.',
      'action': () => {router.push('/cbb/picks');}
    },
    {
      'value': 'cbb_team',
      'heading': 'Teams',
      'image': teamImage,
      'contents': 'View a team\'s schedule, statistics, trends.',
      'action': () => {router.push('/cbb/team/87019264-8549-11ed-bf01-5296e1552828');}
    },
    {
      'value': 'cbb_game',
      'heading': 'Game details',
      'image': gameImage,
      'contents': 'View a game\'s boxscore, match up, trends.',
      'action': () => {router.push('/cbb/games/81a20ec9-8551-11ed-bf01-5296e1552828');}
    },
    {
      'value': 'cbb_player',
      'heading': 'Players',
      'image': playerImage,
      'contents': 'View a player\'s statistics, ranking, game log, trends.',
      'action': () => {router.push('/cbb/player/dff6dce2-ad5a-11ed-9185-b6be2f39279c');}
    },
  ];


  return (
    <div>
      <Head>
        <title>sRating | Aggregate college basketball ranking, scores, picks</title>
        <meta name = 'description' content = 'View statistic ranking, live score, live odds, picks for college basketball' key = 'desc'/>
        <meta property="og:title" content=">sRating.io college basketball rankings" />
        <meta property="og:description" content="View statistic ranking, live score, live odds, picks for college basketball" />
        <meta name="twitter:card" content="summary" />
        <meta name = 'twitter:title' content = 'View statistic ranking, live score, live odds, picks for college basketball' />
      </Head>
      <main>
        <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 8,
            pb: 6,
          }}
        >
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              sRating
            </Typography>
            <Typography variant="h5" align="center" color="text.secondary" paragraph>
              Aggregate data, clear statistics, better visualization, no ads, open-source.
            </Typography>
            <Stack
              sx={{ pt: 4 }}
              direction="row"
              spacing={2}
              justifyContent="center"
            >
              <Button onClick = {() => {router.push('/cbb/ranking')}} variant="contained">Ranking</Button>
              <Button onClick = {() => {router.push('/cbb/games')}} variant="outlined">Scores</Button>
            </Stack>
          </Container>
        </Box>
        <Container sx={{ py: 8 }} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {cards.map((card) => (
              <Grid item key={card.value} xs={12} sm={6} md={4}>
                <Card
                  sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                  <CardMedia sx = {{'height': 175}} alt = {card.heading}>
                    <div style={{ 'position': 'relative', 'width': '100%', 'height': '100%' }}>
                    <Image
                      alt = {card.heading}
                      src={card.image}
                      layout="fill"
                      objectFit="cover"
                    />
                    </div>
                  </CardMedia>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {card.heading}
                    </Typography>
                    <Typography>
                      {card.contents}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button onClick = {card.action} size="small">View</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
      <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
        <div>
          <Typography
            variant="subtitle1"
            align="center"
            color="text.secondary"
            component="p"
          >
            🚂Boiler up!🚂
          </Typography>
        </div>
        <div>
          <Typography
            variant="subtitle1"
            align="center"
            color="text.secondary"
            component="p"
          >
            <Link color="text.secondary" underline="hover" href = "mailto:contact@srating.io">Contact me</Link>
          </Typography>
        </div>
        <div>
          <Typography
            variant="subtitle1"
            align="center"
            color="text.secondary"
            component="p"
          >
            <Link color="text.secondary" underline="hover" href = "https://github.com/esmalleydev/srating.io-gui" target = "_blank">{commitDate} - {hash}</Link>
          </Typography>
        </div>
        <div>
          <Typography
            variant="subtitle1"
            align="center"
            color="text.secondary"
            component="p"
          >
            SRATING LLC
          </Typography>
        </div>
      </Box>
    </div>
  );
}

export default Home;
