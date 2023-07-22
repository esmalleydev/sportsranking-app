import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import useWindowDimensions from '../../../hooks/useWindowDimensions';


import Typography from '@mui/material/Typography';
import CompareStatistic from '../../CompareStatistic';

import HelperCBB from '../../../helpers/CBB';
  
const Matchup = (props) => {
  const self = this;

  const { height, width } = useWindowDimensions();

  const awayTeam = props.awayTeam;
  const homeTeam = props.homeTeam;


  const awayStats = props.awayStats || {};
  const homeStats = props.homeStats || {};

  const theme = useTheme();

  const game = props.game;

  const CBB = new HelperCBB({
    'cbb_game': game,
  });

  const baseRows = [
    {
      'name': 'Win %',
      'title': 'Predicted win %',
      'away': (game.away_team_rating * 100).toFixed(0) + '%',
      'home': (game.home_team_rating * 100).toFixed(0) + '%',
      'awayCompareValue': game.away_team_rating,
      'homeCompareValue': game.home_team_rating,
      'favored': 'higher',
      'showDifference': false,
    },
  ];

  const overviewRows = [
    {
      'name': 'Record',
      'title': 'Record',
      'away': awayStats.wins + '-' + awayStats.losses,
      'home': homeStats.wins + '-' + homeStats.losses,
      'awayCompareValue': awayStats.wins,
      'homeCompareValue': homeStats.wins,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': 'Conf',
      'title': 'Conference record',
      'away': awayStats.confwins + '-' + awayStats.conflosses,
      'home': homeStats.confwins + '-' + homeStats.conflosses,
      'awayCompareValue': awayStats.confwins,
      'homeCompareValue': homeStats.confwins,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': 'Streak',
      'title': 'Streak',
      'away': (awayStats.streak < 0 ? 'L' : 'W') + Math.abs(awayStats.streak),
      'home': (homeStats.streak < 0 ? 'L' : 'W') + Math.abs(homeStats.streak),
      'awayCompareValue': awayStats.streak,
      'homeCompareValue': homeStats.streak,
      'favored': 'higher',
    },
    {
      'name': 'A/H Rec.',
      'title': 'Away record / Home record',
      'away': awayStats.roadwins + '-' + awayStats.roadlosses,
      'home': homeStats.homewins + '-' + homeStats.homelosses,
      'awayCompareValue': awayStats.roadlosses,
      'homeCompareValue': homeStats.homelosses,
      'favored': 'lower',
      'showDifference': true,
    },
  ];

  const efficiencyRows = [
    {
      'name': 'aEM',
      'title': 'Adjusted Efficiency margin',
      'away': awayStats.internal && awayStats.internal.adjusted_efficiency_rating,
      'home': homeStats.internal && homeStats.internal.adjusted_efficiency_rating,
      'awayCompareValue': awayStats.internal && awayStats.internal.adjusted_efficiency_rating,
      'homeCompareValue': homeStats.internal && homeStats.internal.adjusted_efficiency_rating,
      'awayRank': awayStats.internal && awayStats.internal.adjusted_efficiency_rating_rank,
      'homeRank': homeStats.internal && homeStats.internal.adjusted_efficiency_rating_rank,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': 'SOS',
      'title': 'Strength of schedule',
      'away': awayStats.internal && awayStats.internal.opponent_efficiency_rating,
      'home': homeStats.internal && homeStats.internal.opponent_efficiency_rating,
      'awayCompareValue': awayStats.internal && awayStats.internal.opponent_efficiency_rating,
      'homeCompareValue': homeStats.internal && homeStats.internal.opponent_efficiency_rating,
      'awayRank': awayStats.internal && awayStats.internal.opponent_efficiency_rating_rank,
      'homeRank': homeStats.internal && homeStats.internal.opponent_efficiency_rating_rank,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': 'O Rating',
      'title': 'Offensive rating',
      'away': awayStats.offensive_rating,
      'home': homeStats.offensive_rating,
      'awayCompareValue': awayStats.offensive_rating,
      'homeCompareValue': homeStats.offensive_rating,
      'awayRank': awayStats.internal && awayStats.internal.offensive_rating_rank,
      'homeRank': homeStats.internal && homeStats.internal.offensive_rating_rank,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': 'D Rating',
      'title': 'Defensive rating',
      'away': awayStats.defensive_rating,
      'home': homeStats.defensive_rating,
      'awayCompareValue': awayStats.defensive_rating,
      'homeCompareValue': homeStats.defensive_rating,
      'awayRank': awayStats.internal && awayStats.internal.defensive_rating_rank,
      'homeRank': homeStats.internal && homeStats.internal.defensive_rating_rank,
      'favored': 'lower',
      'showDifference': true,
    },
    {
      'name': 'PTS Off.',
      'title': 'Avg points scored',
      'away': awayStats.points,
      'home': homeStats.points,
      'awayCompareValue': awayStats.points,
      'homeCompareValue': homeStats.points,
      'awayRank': awayStats.internal && awayStats.internal.points_rank,
      'homeRank': homeStats.internal && homeStats.internal.points_rank,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': 'PTS Def.',
      'title': 'Avg points allowed',
      'away': awayStats.opponent_points,
      'home': homeStats.opponent_points,
      'awayCompareValue': awayStats.opponent_points,
      'homeCompareValue': homeStats.opponent_points,
      'awayRank': awayStats.internal && awayStats.internal.opponent_points_rank,
      'homeRank': homeStats.internal && homeStats.internal.opponent_points_rank,
      'favored': 'lower',
      'showDifference': true,
    },
  ];

  const marginRows = [
     {
      'name': 'Win MR',
      'title': 'Avg. Win margin',
      'away': awayStats.win_margin,
      'home': homeStats.win_margin,
      'awayCompareValue': awayStats.win_margin,
      'homeCompareValue': homeStats.win_margin,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': 'Loss MR',
      'title': 'Avg. Loss margin',
      'away': awayStats.loss_margin,
      'home': homeStats.loss_margin,
      'awayCompareValue': awayStats.loss_margin,
      'homeCompareValue': homeStats.loss_margin,
      'favored': 'lower',
      'showDifference': true,
    },
    {
      'name': 'Conf. W MR',
      'title': 'Avg. Conference win margin',
      'away': awayStats.confwin_margin,
      'home': homeStats.confwin_margin,
      'awayCompareValue': awayStats.confwin_margin,
      'homeCompareValue': homeStats.confwin_margin,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': 'Conf. L MR',
      'title': 'Avg. Conference loss margin',
      'away': awayStats.confloss_margin,
      'home': homeStats.confloss_margin,
      'awayCompareValue': awayStats.confloss_margin,
      'homeCompareValue': homeStats.confloss_margin,
      'favored': 'lower',
      'showDifference': true,
    },
  ];

  const rankRows = [
    {
      'name': 'Rank',
      'title': 'Composite Rank',
      'away': (awayTeam.ranking && awayTeam.ranking.composite_rank) || '-',
      'home': (homeTeam.ranking && homeTeam.ranking.composite_rank) || '-',
      'awayCompareValue': (awayTeam.ranking && awayTeam.ranking.composite_rank) || Infinity,
      'homeCompareValue': (homeTeam.ranking && homeTeam.ranking.composite_rank) || Infinity,
      'favored': 'lower',
      'showDifference': true,
    },
    {
      'name': 'sRating',
      'title': 'sRating',
      'away': awayStats.elo,
      'home': homeStats.elo,
      'awayCompareValue': awayStats.elo,
      'homeCompareValue': homeStats.elo,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': 'AP',
      'title': 'AP',
      'away': (awayTeam.ranking && awayTeam.ranking.ap_rank) || '-',
      'home': (homeTeam.ranking && homeTeam.ranking.ap_rank) || '-',
      'awayCompareValue': (awayTeam.ranking && awayTeam.ranking.ap_rank) || Infinity,
      'homeCompareValue': (homeTeam.ranking && homeTeam.ranking.ap_rank) || Infinity,
      'favored': 'lower',
      'showDifference': true,
    },
    {
      'name': 'KP',
      'title': 'Kenpom',
      'away': (awayTeam.ranking && awayTeam.ranking.kenpom_rank) || '-',
      'home': (homeTeam.ranking && homeTeam.ranking.kenpom_rank) || '-',
      'awayCompareValue': (awayTeam.ranking && awayTeam.ranking.kenpom_rank) || Infinity,
      'homeCompareValue': (homeTeam.ranking && homeTeam.ranking.kenpom_rank) || Infinity,
      'favored': 'lower',
      'showDifference': true,
    },
    {
      'name': 'SRS',
      'title': 'SRS',
      'away': (awayTeam.ranking && awayTeam.ranking.srs_rank) || '-',
      'home': (homeTeam.ranking && homeTeam.ranking.srs_rank) || '-',
      'awayCompareValue': (awayTeam.ranking && awayTeam.ranking.srs_rank) || Infinity,
      'homeCompareValue': (homeTeam.ranking && homeTeam.ranking.srs_rank) || Infinity,
      'favored': 'lower',
      'showDifference': true,
    },
  ];

  const offenseRows = [
    {
      'name': 'Pace',
      'title': 'Pace',
      'tooltip': 'Possesions per game',
      'away': awayStats.possessions,
      'home': homeStats.possessions,
      'awayCompareValue': awayStats.possessions,
      'homeCompareValue': homeStats.possessions,
      'awayRank': awayStats.internal && awayStats.internal.possessions_rank,
      'homeRank': homeStats.internal && homeStats.internal.possessions_rank,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': 'FG',
      'title': 'FG',
      'tooltip': 'Field goals per game',
      'away': awayStats.field_goal,
      'home': homeStats.field_goal,
      'awayCompareValue': awayStats.field_goal,
      'homeCompareValue': homeStats.field_goal,
      'awayRank': awayStats.internal && awayStats.internal.field_goal_rank,
      'homeRank': homeStats.internal && homeStats.internal.field_goal_rank,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': 'FGA',
      'title': 'FGA',
      'tooltip': 'Field goal attempts per game',
      'away': awayStats.field_goal_attempts,
      'home': homeStats.field_goal_attempts,
      'awayCompareValue': awayStats.field_goal_attempts,
      'homeCompareValue': homeStats.field_goal_attempts,
      'awayRank': awayStats.internal && awayStats.internal.field_goal_attempts_rank,
      'homeRank': homeStats.internal && homeStats.internal.field_goal_attempts_rank,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': 'FG%',
      'title': 'FG%',
      'tooltip': 'Field goal percentage',
      'away': awayStats.field_goal_percentage + '%',
      'home': homeStats.field_goal_percentage + '%',
      'awayCompareValue': awayStats.field_goal_percentage,
      'homeCompareValue': homeStats.field_goal_percentage,
      'awayRank': awayStats.internal && awayStats.internal.field_goal_percentage_rank,
      'homeRank': homeStats.internal && homeStats.internal.field_goal_percentage_rank,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': '2P',
      'title': '2P',
      'tooltip': '2 point field goals per game',
      'away': awayStats.two_point_field_goal,
      'home': homeStats.two_point_field_goal,
      'awayCompareValue': awayStats.two_point_field_goal,
      'homeCompareValue': homeStats.two_point_field_goal,
      'awayRank': awayStats.internal && awayStats.internal.two_point_field_goal_rank,
      'homeRank': homeStats.internal && homeStats.internal.two_point_field_goal_rank,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': '2PA',
      'title': '2PA',
      'tooltip': '2 point field goal attempts per game',
      'away': awayStats.two_point_field_goal_attempts,
      'home': homeStats.two_point_field_goal_attempts,
      'awayCompareValue': awayStats.two_point_field_goal_attempts,
      'homeCompareValue': homeStats.two_point_field_goal_attempts,
      'awayRank': awayStats.internal && awayStats.internal.two_point_field_goal_attempts_rank,
      'homeRank': homeStats.internal && homeStats.internal.two_point_field_goal_attempts_rank,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': '2P%',
      'title': '2P%',
      'tooltip': '2 point field goal percentage',
      'away': awayStats.two_point_field_goal_percentage + '%',
      'home': homeStats.two_point_field_goal_percentage + '%',
      'awayCompareValue': awayStats.two_point_field_goal_percentage,
      'homeCompareValue': homeStats.two_point_field_goal_percentage,
      'awayRank': awayStats.internal && awayStats.internal.two_point_field_goal_percentage_rank,
      'homeRank': homeStats.internal && homeStats.internal.two_point_field_goal_percentage_rank,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': '3P',
      'title': '3P',
      'tooltip': '3 point field goals per game',
      'away': awayStats.three_point_field_goal,
      'home': homeStats.three_point_field_goal,
      'awayCompareValue': awayStats.three_point_field_goal,
      'homeCompareValue': homeStats.three_point_field_goal,
      'awayRank': awayStats.internal && awayStats.internal.three_point_field_goal_rank,
      'homeRank': homeStats.internal && homeStats.internal.three_point_field_goal_rank,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': '3PA',
      'title': '3PA',
      'tooltip': '3 point field goal attempts per game',
      'away': awayStats.three_point_field_goal_attempts,
      'home': homeStats.three_point_field_goal_attempts,
      'awayCompareValue': awayStats.three_point_field_goal_attempts,
      'homeCompareValue': homeStats.three_point_field_goal_attempts,
      'awayRank': awayStats.internal && awayStats.internal.three_point_field_goal_attempts_rank,
      'homeRank': homeStats.internal && homeStats.internal.three_point_field_goal_attempts_rank,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': '3P%',
      'title': '3P%',
      'tooltip': '3 point field goal percentage',
      'away': awayStats.three_point_field_goal_percentage + '%',
      'home': homeStats.three_point_field_goal_percentage + '%',
      'awayCompareValue': awayStats.three_point_field_goal_percentage,
      'homeCompareValue': homeStats.three_point_field_goal_percentage,
      'awayRank': awayStats.internal && awayStats.internal.three_point_field_goal_percentage_rank,
      'homeRank': homeStats.internal && homeStats.internal.three_point_field_goal_percentage_rank,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': 'FT',
      'title': 'FT',
      'tooltip': 'Free throws per game',
      'away': awayStats.free_throws,
      'home': homeStats.free_throws,
      'awayCompareValue': awayStats.free_throws,
      'homeCompareValue': homeStats.free_throws,
      'awayRank': awayStats.internal && awayStats.internal.free_throws_rank,
      'homeRank': homeStats.internal && homeStats.internal.free_throws_rank,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': 'FTA',
      'title': 'FTA',
      'tooltip': 'Free throw attempts per game',
      'away': awayStats.free_throw_attempts,
      'home': homeStats.free_throw_attempts,
      'awayCompareValue': awayStats.free_throw_attempts,
      'homeCompareValue': homeStats.free_throw_attempts,
      'awayRank': awayStats.internal && awayStats.internal.free_throw_attempts_rank,
      'homeRank': homeStats.internal && homeStats.internal.free_throw_attempts_rank,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': 'FT%',
      'title': 'FT%',
      'tooltip': 'Free throw percentage',
      'away': awayStats.free_throw_percentage + '%',
      'home': homeStats.free_throw_percentage + '%',
      'awayCompareValue': awayStats.free_throw_percentage,
      'homeCompareValue': homeStats.free_throw_percentage,
      'awayRank': awayStats.internal && awayStats.internal.free_throw_percentage_rank,
      'homeRank': homeStats.internal && homeStats.internal.free_throw_percentage_rank,
      'favored': 'higher',
      'showDifference': true,
    },
  ];

  const specialRows = [
    {
      'name': 'ORB',
      'title': 'ORB',
      'tooltip': 'Offensive rebounds',
      'away': awayStats.offensive_rebounds,
      'home': homeStats.offensive_rebounds,
      'awayCompareValue': awayStats.offensive_rebounds,
      'homeCompareValue': homeStats.offensive_rebounds,
      'awayRank': awayStats.internal && awayStats.internal.offensive_rebounds_rank,
      'homeRank': homeStats.internal && homeStats.internal.offensive_rebounds_rank,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': 'DRB',
      'title': 'DRB',
      'tooltip': 'Defensive rebounds',
      'away': awayStats.defensive_rebounds,
      'home': homeStats.defensive_rebounds,
      'awayCompareValue': awayStats.defensive_rebounds,
      'homeCompareValue': homeStats.defensive_rebounds,
      'awayRank': awayStats.internal && awayStats.internal.defensive_rebounds_rank,
      'homeRank': homeStats.internal && homeStats.internal.defensive_rebounds_rank,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': 'AST',
      'title': 'AST',
      'tooltip': 'Assists',
      'away': awayStats.assists,
      'home': homeStats.assists,
      'awayCompareValue': awayStats.assists,
      'homeCompareValue': homeStats.assists,
      'awayRank': awayStats.internal && awayStats.internal.assists_rank,
      'homeRank': homeStats.internal && homeStats.internal.assists_rank,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': 'STL',
      'title': 'STL',
      'tooltip': 'Steals',
      'away': awayStats.steals,
      'home': homeStats.steals,
      'awayCompareValue': awayStats.steals,
      'homeCompareValue': homeStats.steals,
      'awayRank': awayStats.internal && awayStats.internal.steals_rank,
      'homeRank': homeStats.internal && homeStats.internal.steals_rank,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': 'BLK',
      'title': 'BLK',
      'tooltip': 'Blocks',
      'away': awayStats.blocks,
      'home': homeStats.blocks,
      'awayCompareValue': awayStats.blocks,
      'homeCompareValue': homeStats.blocks,
      'awayRank': awayStats.internal && awayStats.internal.blocks_rank,
      'homeRank': homeStats.internal && homeStats.internal.blocks_rank,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': 'TOV',
      'title': 'TOV',
      'tooltip': 'Turnovers',
      'away': awayStats.turnovers,
      'home': homeStats.turnovers,
      'awayCompareValue': awayStats.turnovers,
      'homeCompareValue': homeStats.turnovers,
      'awayRank': awayStats.internal && awayStats.internal.turnovers_rank,
      'homeRank': homeStats.internal && homeStats.internal.turnovers_rank,
      'favored': 'lower',
      'showDifference': true,
    },
    {
      'name': 'PF',
      'title': 'PF',
      'tooltip': 'Fouls',
      'away': awayStats.fouls,
      'home': homeStats.fouls,
      'awayCompareValue': awayStats.fouls,
      'homeCompareValue': homeStats.fouls,
      'awayRank': awayStats.internal && awayStats.internal.fouls_rank,
      'homeRank': homeStats.internal && homeStats.internal.fouls_rank,
      'favored': 'lower',
      'showDifference': true,
    },
    {
      'name': 'FE',
      'title': 'Fatigue rating',
      'away': awayStats.fatigue,
      'home': homeStats.fatigue,
      'awayCompareValue': awayStats.fatigue,
      'homeCompareValue': homeStats.fatigue,
      'favored': 'lower',
      'showDifference': true,
    },
    {
      'name': 'DES',
      'title': 'Desperation rating',
      'away': awayStats.desperation,
      'home': homeStats.desperation,
      'awayCompareValue': awayStats.desperation,
      'homeCompareValue': homeStats.desperation,
      'favored': 'lower',
      'showDifference': true,
    },
    {
      'name': 'OVC',
      'title': 'Over confidence rating',
      'away': awayStats.over_confidence,
      'home': homeStats.over_confidence,
      'awayCompareValue': awayStats.over_confidence,
      'homeCompareValue': homeStats.over_confidence,
      'favored': 'lower',
      'showDifference': true,
    },
  ];

  const opponentRows = [
    {
      'name': 'FG',
      'title': 'FG',
      'tooltip': 'Oppenent field goals per game',
      'away': awayStats.opponent_field_goal,
      'home': homeStats.opponent_field_goal,
      'awayCompareValue': awayStats.opponent_field_goal,
      'homeCompareValue': homeStats.opponent_field_goal,
      'awayRank': awayStats.internal && awayStats.internal.opponent_field_goal_rank,
      'homeRank': homeStats.internal && homeStats.internal.opponent_field_goal_rank,
      'favored': 'lower',
      'showDifference': true,
    },
    {
      'name': 'FGA',
      'title': 'FGA',
      'tooltip': 'Oppenent field goal attempts per game',
      'away': awayStats.opponent_field_goal_attempts,
      'home': homeStats.opponent_field_goal_attempts,
      'awayCompareValue': awayStats.opponent_field_goal_attempts,
      'homeCompareValue': homeStats.opponent_field_goal_attempts,
      'awayRank': awayStats.internal && awayStats.internal.opponent_field_goal_attempts_rank,
      'homeRank': homeStats.internal && homeStats.internal.opponent_field_goal_attempts_rank,
      'favored': 'lower',
      'showDifference': true,
    },
    {
      'name': 'FG%',
      'title': 'FG%',
      'tooltip': 'Oppenent field goal percentage',
      'away': awayStats.opponent_field_goal_percentage + '%',
      'home': homeStats.opponent_field_goal_percentage + '%',
      'awayCompareValue': awayStats.opponent_field_goal_percentage,
      'homeCompareValue': homeStats.opponent_field_goal_percentage,
      'awayRank': awayStats.internal && awayStats.internal.opponent_field_goal_percentage_rank,
      'homeRank': homeStats.internal && homeStats.internal.opponent_field_goal_percentage_rank,
      'favored': 'lower',
      'showDifference': true,
    },
    {
      'name': 'ORB',
      'title': 'ORB',
      'tooltip': 'Oppenent Offensive rebounds per game',
      'away': awayStats.opponent_offensive_rebounds,
      'home': homeStats.opponent_offensive_rebounds,
      'awayCompareValue': awayStats.opponent_offensive_rebounds,
      'homeCompareValue': homeStats.opponent_offensive_rebounds,
      'awayRank': awayStats.internal && awayStats.internal.opponent_offensive_rebounds_rank,
      'homeRank': homeStats.internal && homeStats.internal.opponent_offensive_rebounds_rank,
      'favored': 'lower',
      'showDifference': true,
    },
    {
      'name': 'DRB',
      'title': 'DRB',
      'tooltip': 'Oppenent Defensive rebounds per game',
      'away': awayStats.opponent_defensive_rebounds,
      'home': homeStats.opponent_defensive_rebounds,
      'awayCompareValue': awayStats.opponent_defensive_rebounds,
      'homeCompareValue': homeStats.opponent_defensive_rebounds,
      'awayRank': awayStats.internal && awayStats.internal.opponent_defensive_rebounds_rank,
      'homeRank': homeStats.internal && homeStats.internal.opponent_defensive_rebounds_rank,
      'favored': 'lower',
      'showDifference': true,
    },
    {
      'name': 'AST',
      'title': 'AST',
      'tooltip': 'Oppenent Assists per game',
      'away': awayStats.opponent_assists,
      'home': homeStats.opponent_assists,
      'awayCompareValue': awayStats.opponent_assists,
      'homeCompareValue': homeStats.opponent_assists,
      'awayRank': awayStats.internal && awayStats.internal.opponent_assists_rank,
      'homeRank': homeStats.internal && homeStats.internal.opponent_assists_rank,
      'favored': 'lower',
      'showDifference': true,
    },
    {
      'name': 'STL',
      'title': 'STL',
      'tooltip': 'Oppenent Steals per game',
      'away': awayStats.opponent_steals,
      'home': homeStats.opponent_steals,
      'awayCompareValue': awayStats.opponent_steals,
      'homeCompareValue': homeStats.opponent_steals,
      'awayRank': awayStats.internal && awayStats.internal.opponent_steals_rank,
      'homeRank': homeStats.internal && homeStats.internal.opponent_steals_rank,
      'favored': 'lower',
      'showDifference': true,
    },
    {
      'name': 'BLK',
      'title': 'BLK',
      'tooltip': 'Oppenent Blocks per game',
      'away': awayStats.opponent_blocks,
      'home': homeStats.opponent_blocks,
      'awayCompareValue': awayStats.opponent_blocks,
      'homeCompareValue': homeStats.opponent_blocks,
      'awayRank': awayStats.internal && awayStats.internal.opponent_blocks_rank,
      'homeRank': homeStats.internal && homeStats.internal.opponent_blocks_rank,
      'favored': 'lower',
      'showDifference': true,
    },
    {
      'name': 'TOV',
      'title': 'TOV',
      'tooltip': 'Oppenent Turnovers per game',
      'away': awayStats.opponent_turnovers,
      'home': homeStats.opponent_turnovers,
      'awayCompareValue': awayStats.opponent_turnovers,
      'homeCompareValue': homeStats.opponent_turnovers,
      'awayRank': awayStats.internal && awayStats.internal.opponent_turnovers_rank,
      'homeRank': homeStats.internal && homeStats.internal.opponent_turnovers_rank,
      'favored': 'higher',
      'showDifference': true,
    },
    {
      'name': 'PF',
      'title': 'PF',
      'tooltip': 'Oppenent Turnovers per game',
      'away': awayStats.opponent_fouls,
      'home': homeStats.opponent_fouls,
      'awayCompareValue': awayStats.opponent_fouls,
      'homeCompareValue': homeStats.opponent_fouls,
      'awayRank': awayStats.internal && awayStats.internal.opponent_fouls_rank,
      'homeRank': homeStats.internal && homeStats.internal.opponent_fouls_rank,
      'favored': 'higher',
      'showDifference': true,
    },
  ];


  return (
    <div>
      <div style = {{'display': 'flex', 'justifyContent': 'space-between', 'marginBottom': '10px', 'flexWrap': 'nowrap', 'position': 'sticky', 'top': 100, 'backgroundColor': theme.palette.background.default, 'padding': '20px'}}>
        <Typography style = {{'textOverflow': 'ellipsis', 'whiteSpace': 'nowrap', 'overflow': 'hidden', 'margin': '0px 5px'}} variant = 'h6'>{CBB.getTeamName('away')}</Typography>
        <Typography style = {{'textOverflow': 'ellipsis', 'whiteSpace': 'nowrap', 'overflow': 'hidden', 'margin': '0px 5px'}} variant = 'h6'>{CBB.getTeamName('home')}</Typography>
      </div>
      <div style = {{'padding': '0px 20px 20px 20px'}}>
        {(game.home_team_rating || game.away_team_rating) ? <CompareStatistic rows = {baseRows} /> : ''}
        <CompareStatistic paper = {true} rows = {overviewRows} />

        <Typography style = {{'textAlign': 'center', 'margin': '10px 0px'}} variant = 'body1'>Efficiency</Typography>
        <CompareStatistic paper = {true} rows = {efficiencyRows} />

        <Typography style = {{'textAlign': 'center', 'margin': '10px 0px'}} variant = 'body1'>Rank</Typography>
        <CompareStatistic paper = {true} rows = {rankRows} />

        <Typography style = {{'textAlign': 'center', 'margin': '10px 0px'}} variant = 'body1'>Win / Loss Margin</Typography>
        <CompareStatistic paper = {true} rows = {marginRows} />

        <Typography style = {{'textAlign': 'center', 'margin': '10px 0px'}} variant = 'body1'>Offense</Typography>
        <CompareStatistic paper = {true} rows = {offenseRows} />

        <Typography style = {{'textAlign': 'center', 'margin': '10px 0px'}} variant = 'body1'>Special</Typography>
        <CompareStatistic paper = {true} rows = {specialRows} />

        <Typography style = {{'textAlign': 'center', 'margin': '10px 0px'}} variant = 'body1'>Opponent stats against</Typography>
        <CompareStatistic paper = {true} rows = {opponentRows} />
      </div>
    </div>
  );
}

export default Matchup;