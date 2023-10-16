import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import useWindowDimensions from '../../components/hooks/useWindowDimensions';

import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import moment from 'moment';
import cacheData from 'memory-cache';

import DateAppBar from '../../components/generic/DateAppBar.jsx';
import Picks_ from '../../components/generic/CBB/Picks/Picks.jsx';
import Calculator from '../../components/generic/CBB/Picks/Calculator.jsx';
import Stats from '../../components/generic/CBB/Picks/Stats.jsx';
import HelperCBB from '../../components/helpers/CBB';

import Api from '../../components/Api.jsx';
const api = new Api();

const Picks = (props) => {
  const self = this;
  const router = useRouter();
  const scrollRef = useRef(null);

  const tabDates = props.dates;
  const { height, width } = useWindowDimensions();

  const season = (router.query && router.query.season) || new HelperCBB().getCurrentSeason();

  let tabOptions = {
    'stats': 'Stats',
    'calculator': 'Calculator',
    'picks': 'Picks',
  };

  let tabOrder = ['picks', 'calculator', 'stats'];

  const sessionDataKey = 'CBB.PICKS.DATA.'+season;

  // this wil get cleared when clicking scores again, but if I arrived here from a back button we want to preserve the state
  let sessionData = typeof window !== 'undefined' && sessionStorage.getItem(sessionDataKey) ? JSON.parse(sessionStorage.getItem(sessionDataKey)) : {};
  if ((sessionData.expire_session && sessionData.expire_session < new Date().getTime()) || +sessionData.season !== +season) {
    sessionData = {};
  }

  const [firstRender, setFirstRender] = useState(true);
  const [request, setRequest] = useState(sessionData.request || false);
  const [spin, setSpin] = useState(('spin' in sessionData) ? sessionData.spin : (props.games));
  const [date, setDate] = useState(sessionData.date || router.query.date || null);
  const [view, setView] = useState(router.query.view || 'picks');
  const [games, setGames] = useState(sessionData.games || {});
  const [now, setNow] = useState(moment().format('YYYY-MM-DD'));
  const [scrollTop, setScrollTop] = useState(sessionData.scrollTop || 0);
  const [showLockedDialog, setShowLockedDialog] = useState(false);
  
  const selectedTab = tabOrder.indexOf(view) > -1 ? tabOrder[tabOrder.indexOf(view)] : tabOrder[0];
  const [tabIndex, setTabIndex] = useState(tabOrder.indexOf(selectedTab));

  // For speed, lookups
  const tabDatesObject = {};
  for (let i = 0; i < tabDates.length; i++) {
    tabDatesObject[tabDates[i]] = true;
  }

  const triggerSessionStorage = () => {
    sessionStorage.setItem(sessionDataKey, JSON.stringify({
      'request': request,
      'games': games,
      'date': date,
      'spin': false,
      'scrollTop': scrollTop,
      'expire_session': new Date().getTime() + (5 * 60 * 1000), // 5 mins from now
      'season': season,
    }));
  };

  const scrollToElement = () => {
    scrollRef.current?.scrollIntoView({'inline': 'center', 'behavior': 'smooth'});
  };


  const getGames = (value) => {;
    if (date !== value) {
      setSpin(true);
    }

    setRequest(true);

    router.replace({
      query: {...router.query, date: value},
    });

    api.Request({
      'class': 'cbb_game',
      'function': 'getGames',
      'arguments': {
        'start_date': value,
      }
    }).then(cbb_games => {
      setGames(cbb_games);
      setDate(value);
      setSpin(false);
    }).catch((err) => {
      // nothing for now
    });
  }


  useEffect(() => {
    triggerSessionStorage();
  }, [view, scrollTop, request, games, date]);

  useEffect(() => {
    scrollToElement();
  }, [date]);

  useEffect(() => {
    if (firstRender && props.scrollRef && props.scrollRef.current) {
      // todo something in nextjs is setting scrolltop to zero right after this, so trick it by putting this at the end of the execution :)
      // https://github.com/vercel/next.js/issues/20951
      setTimeout(function() {
        props.scrollRef.current.scrollTop = scrollTop;
      }, 1);
    }

    setFirstRender(false);

    // return function clean_up() {
    //   console.log('clean up')
    //   console.log(props.scrollRef.current.scrollTop)
    // }
  });

  if (firstRender) {
    return (<div style = {{'display': 'flex', 'justifyContent': 'center'}}><CircularProgress /></div>);
  }


   /**
   * Find the closest tabDates match to a date
   * @param  {String} d a date to match YYYY-MM-DD
   * @return {?String}
   */
  const getClosestDate = (d) => {
    let closestDist = null;
    let closestDate = null;

    if (d in tabDatesObject) {
      return d;
    }

    for (let i = 0; i < tabDates.length; i++) {
      const a = new Date(tabDates[i]);
      const b = new Date(d);

      const dist = Math.abs(a - b);

      if (
        !closestDist ||
        dist < closestDist
      ) {
        closestDist = dist;
        closestDate = tabDates[i];
      }
    }

    return closestDate;
  };

  const getSelectedDate = () => {
    return date || now;
  }


  if (!request) {
    const d = getClosestDate(getSelectedDate());
    getGames(d || tabDates[0]);
  }


  const updateDate = (e, value) => {
    setScrollTop(0);
    getGames(tabDates[value]);
  }

  // check the games, if the first one has no rating, then they dont have picks access
  // dont let them click the calc button
  // todo should store this on login or something so the gui doesnt need to make a request, even though this is a reliable method to check
  let calcAccess = true;
  for (let cbb_game_id in games) {
    if (
      !games[cbb_game_id].home_team_rating &&
      !games[cbb_game_id].away_team_rating
    ) {
      calcAccess = false;
    }
    break;
  }


  
  let tabs = [];
  for (let i = 0; i < tabOrder.length; i++) {
    tabs.push(<Tab key = {tabOrder[i]} label = {(<span style = {{'fontSize': '12px'}}>{tabOptions[tabOrder[i]]}</span>)} />);
  }

  const handleTabClick = (e, value) => {
    setShowLockedDialog(false);
    if (value === 1 && !calcAccess) {
      setShowLockedDialog(true);
      return;
    }
    
    setTabIndex(value);
    setView(tabOrder[value]);
    router.replace({
      query: {...router.query, view: tabOrder[value]},
    });
  }

  const onClickTile = () => {
    if (
      props.scrollRef &&
      props.scrollRef.current
    ) {
      setScrollTop(props.scrollRef.current.scrollTop);
    }
  }

  let marginTop = '64px';

  if (width < 600) {
    marginTop = '56px';
  }

  const handleSubscribe = () => {
    router.push('/pricing');
  };

  const handleCloseLockedDialog = () => {
    setShowLockedDialog(false);
  };

  return (
    <div style = {{'padding': '46px 20px 0px 20px'}}>
      <Head>
        <title>sRating | College basketball betting picks</title>
        <meta name = 'description' content = 'Best picks for each college basketball game based on statistics' key = 'desc'/>
        <meta property="og:title" content=">sRating.io college basketball picks" />
        <meta property="og:description" content="Best picks for each college basketball game based on statistics" />
      </Head>
      <div>
        <DateAppBar
          styles = {{'marginTop': marginTop}}
          selectedDate = {getSelectedDate()}
          dates = {tabDates}
          tabsOnChange = {updateDate}
          calendarOnAccept = {(momentObj) => {getGames(momentObj.format('YYYY-MM-DD'));}}
          scrollRef = {scrollRef}
        />
      </div>
      <Box display="flex" justifyContent="center" /*sx = {{'position': 'sticky', 'top': 100}}*/>
        <Tabs variant="scrollable" scrollButtons="auto" value={tabIndex} onChange={handleTabClick} indicatorColor="secondary" textColor="inherit">
          {tabs}
        </Tabs>
      </Box>
      {
        spin ? <div style = {{'display': 'flex', 'justifyContent': 'center'}}><CircularProgress /></div> :
        <div>
          {selectedTab == 'picks' ? <Picks_ key = {date} games = {games} date = {date} onClickTile = {onClickTile} /> : ''}
          {selectedTab == 'calculator' ? <Calculator key = {date} games = {games} date = {date} /> : ''}
          {selectedTab == 'stats' ? <Stats key = {date} date = {date} /> : ''}
        </div>
      }
      <Dialog
        open={showLockedDialog}
        onClose={handleCloseLockedDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {'Subscription required'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Subscribe for just $5 per month to get access to the betting calculator!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLockedDialog}>Maybe later</Button>
          <Button onClick={handleSubscribe} autoFocus>
            Subscribe
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}


export async function getServerSideProps(context) {
  const seconds = 60 * 60 * 12; // cache for 12 hours
  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage='+seconds+', stale-while-revalidate=59'
  );

  const CBB = new HelperCBB();

  const season =  (context.query && context.query.season) || CBB.getCurrentSeason();

  let dates = [];

  const cachedLocation = 'CBB.PICKS.LOAD.'+season;

  const cached = cacheData.get(cachedLocation);

  if (!cached) {
    await api.Request({
      'class': 'cbb_game',
      'function': 'getSeasonDates',
      'arguments': {
        'season': season
      }
    }).then((response) => {
      dates = response;
      cacheData.put(cachedLocation, dates, 1000 * seconds);
    }).catch((e) => {

    });
  } else {
    dates = cached;
  }


  return {
    'props': {
      'dates': dates,
    },
  }
}


export default Picks;
