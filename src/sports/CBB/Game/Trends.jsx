import React, { useState } from 'react';

import { useTheme } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Skeleton from '@mui/material/Skeleton';

import HelperCBB from '../../../helpers/CBB';

import RankChart from './Charts/Rank';
import PreviousMatchupTile from './PreviousMatchupTile';

import moment from 'moment';

import Api from './../../../Api.jsx';
const api = new Api();

const Trends = (props) => {
  const self = this;

  const game = props.game;

  const [selectedStatChip, setSelectedStatChip] = useState('elo_rank');

  const [requestedPM, setRequestedPM] = useState(false);
  const [previousMatchups, setPreviousMatchups] = useState(null);
  const [showAllPreviousMatchups, setShowAllPreviousMatchups] = useState(false);

  const [requestedOddsStats, setRequestedOddsStats] = useState(false);
  const [oddsStats, setOddsStats] = useState(null);

  const CBB = new HelperCBB({
    'cbb_game': game,
  });

  let awayUnderdog = false;
  let homeUnderdog = false;

  if (game.odds) {
    awayUnderdog = game.odds.pre_game_money_line_away > 0;
    homeUnderdog = game.odds.pre_game_money_line_home > 0;
  }


  const theme = useTheme();

  if (!requestedPM) {
    setRequestedPM(true);
    api.Request({
      'class': 'cbb_game',
      'function': 'getPreviousMatchups',
      'arguments': game.cbb_game_id,
    }).then((cbb_games) => {
      setPreviousMatchups(cbb_games || {});
    }).catch((e) => {
      setPreviousMatchups({});
    });
  }

  if (!requestedOddsStats) {
    setRequestedOddsStats(true);
    api.Request({
      'class': 'cbb_game',
      'function': 'getOddsStats',
      'arguments': game.cbb_game_id,
    }).then((Stats) => {
      setOddsStats(Stats || {});
    }).catch((e) => {
      setOddsStats({});
    });
  }


  const statsCompare = [
    {
      'label': 'Elo',
      'value': 'elo_rank',
    },
    {
      'label': 'KP',
      'value': 'kenpom_rank',
    },
    {
      'label': 'SRS',
      'value': 'srs_rank',
    },
    {
      'label': 'NET',
      'value': 'net_rank',
    },
  ];

  let statsCompareChips = [];

  for (let i = 0; i < statsCompare.length; i++) {
    statsCompareChips.push(
      <Chip
        key = {statsCompare[i].value}
        sx = {{'margin': '5px 5px 10px 5px'}}
        variant = {selectedStatChip === statsCompare[i].value ? 'filled' : 'outlined'}
        color = {selectedStatChip === statsCompare[i].value ? 'success' : 'primary'}
        onClick = {() => {setSelectedStatChip(statsCompare[i].value);}}
        label = {statsCompare[i].label}
      />
    );
  }

  let previousMatchupContainers = [];
  let summaryPRContainers = [];

  if (previousMatchups && !Object.keys(previousMatchups).length) {
    previousMatchupContainers.push(<Paper elevation = {3} style = {{'padding': 10}}><Typography variant = 'body1'>Could not find any previous games :(</Typography></Paper>);
  } else if (previousMatchups) {
    const sorted_matchups = Object.values(previousMatchups).sort(function(a, b) {
      return a.start_date > b.start_date ? -1 : 1;
    });

    let away_wins = 0;
    let home_wins = 0;

    let home_points = 0;
    let away_points = 0;

    let lastThree_away_wins = 0;
    let lastThree_home_wins = 0;

    let lastThree_home_points = 0;
    let lastThree_away_points = 0;

    for (let i = 0; i < sorted_matchups.length; i++) {
      const game_ = sorted_matchups[i];

      const lastThree = sorted_matchups.length > 3 && i < 3;

      if (game_.away_score > game_.home_score) {
        if (game_.away_team_id === game.away_team_id) {
          away_wins++;
          away_points += game_.away_score - game_.home_score;
          if (lastThree) {
            lastThree_away_wins++;
            lastThree_away_points += game_.away_score - game_.home_score;
          }
        } else if (game_.away_team_id === game.home_team_id) {
          home_wins++;
          home_points += game_.away_score - game_.home_score;
          if (lastThree) {
            lastThree_home_wins++;
            lastThree_home_points += game_.away_score - game_.home_score;
          }
        }
      } else if (game_.away_score < game_.home_score) {
        if (game_.home_team_id === game.away_team_id) {
          away_wins++;
          away_points += game_.home_score - game_.away_score;
          if (lastThree) {
            lastThree_away_wins++;
            lastThree_away_points += game_.home_score - game_.away_score;
          }
        } else if (game_.home_team_id === game.home_team_id) {
          home_wins++;
          home_points += game_.home_score - game_.away_score;
          if (lastThree) {
            lastThree_home_wins++;
            lastThree_home_points += game_.home_score - game_.away_score;
          }
        }
      }
      if (i < 3 || showAllPreviousMatchups) {
        previousMatchupContainers.push(<PreviousMatchupTile game = {sorted_matchups[i]} />);
      }
    }

    if (sorted_matchups.length > 3 && !showAllPreviousMatchups) {
      previousMatchupContainers.push(<Chip
        key = 'showAllPreviousMatchups'
        sx = {{'margin': '5px 5px 10px 5px'}}
        variant = 'outlined'
        color = 'primary'
        onClick = {() => {setShowAllPreviousMatchups(true);}}
        label = '+ Match-ups'
      />);
    }

    if (sorted_matchups.length > 5) {
      if (lastThree_home_wins >= lastThree_away_wins) {
        summaryPRContainers.push(<Typography variant = 'body2'>{CBB.getTeamName('home')} has won {lastThree_home_wins} of last 3 by an average of {(home_points / lastThree_home_wins).toFixed(2)} pts.</Typography>);
      } else {
        summaryPRContainers.push(<Typography variant = 'body2'>{CBB.getTeamName('away')} has won {lastThree_away_wins} of last 3 by an average of {(away_points / lastThree_away_wins).toFixed(2)} pts.</Typography>);
      }
    }

    if (home_wins >= away_wins) {
      summaryPRContainers.push(<Typography variant = 'body2'>{CBB.getTeamName('home')} has won {home_wins} of last {sorted_matchups.length} by an average of {(home_points / home_wins).toFixed(2)} pts.</Typography>);
    } else {
      summaryPRContainers.push(<Typography variant = 'body2'>{CBB.getTeamName('away')} has won {away_wins} of last {sorted_matchups.length} by an average of {(away_points / away_wins).toFixed(2)} pts.</Typography>);
    }
  }

  let awayOddsText = null;
  if (oddsStats && oddsStats[game.away_team_id]) {
    const awayOS = oddsStats[game.away_team_id];
    awayOddsText = CBB.getTeamName('away') + ' is ' + (awayUnderdog ? awayOS.underdog_wins + '/' + awayOS.underdog_games + ', ' + ((awayOS.underdog_wins / awayOS.underdog_games) * 100).toFixed(2) + '% as the underdog this season.' : awayOS.favored_wins + '/' + awayOS.favored_games + ' ' + ((awayOS.favored_wins / awayOS.favored_games) * 100).toFixed(2) + '% when favored this season.');
  }

  let homeOddsText = null;
  if (oddsStats && oddsStats[game.home_team_id]) {
    const homeOS = oddsStats[game.home_team_id];
    homeOddsText = CBB.getTeamName('home') + ' is ' + (homeUnderdog ? homeOS.underdog_wins + '/' + homeOS.underdog_games + ', ' + ((homeOS.underdog_wins / homeOS.underdog_games) * 100).toFixed(2) + '% as the underdog this season.' : homeOS.favored_wins + '/' + homeOS.favored_games + ', ' + ((homeOS.favored_wins / homeOS.favored_games) * 100).toFixed(2) + '% when favored this season.');
  }

  return (
    <div style = {{'padding': 20}}>
      <Typography variant = 'body1'>Previous match-ups</Typography>
        {
          previousMatchups === null ?
          <Paper elevation = {3} style = {{'padding': 10}}>
            <div>
              <Typography variant = 'h5'><Skeleton /></Typography>
              <Typography variant = 'h5'><Skeleton /></Typography>
              <Typography variant = 'h5'><Skeleton /></Typography>
              <Typography variant = 'h5'><Skeleton /></Typography>
              <Typography variant = 'h5'><Skeleton /></Typography>
            </div>
          </Paper>
          : ''
        }
        {summaryPRContainers}
        {
          previousMatchups !== null ?
          <div style = {{'display': 'flex', 'flexWrap': 'wrap', 'alignItems': 'center'}}>
            {previousMatchupContainers}
          </div>
          : ''
        }
      <Typography variant = 'body1'>Odds trends</Typography>
      <div>
        <Typography variant = 'body2'>{oddsStats === null ? <Skeleton /> : (awayOddsText ? awayOddsText : 'Missing data')}</Typography>
        <Typography variant = 'body2'>{oddsStats === null ? <Skeleton /> : (homeOddsText ? homeOddsText : 'Missing data')}</Typography>
      </div>
      <div>
        <Typography style = {{'margin': '10px 0px'}} variant = 'body1'>Rank compare</Typography>
        {statsCompareChips}
        {<RankChart game = {game} compareKey = {selectedStatChip} />}
      </div>
    </div>
  );
}

export default Trends;
