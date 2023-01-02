import React, { useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import { useTheme } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

import HelperCBB from '../../../../helpers/CBB';

import moment from 'moment';



const Scoring = (props) => {
  const self = this;

  const game = props.game;

  const CBB = new HelperCBB({
    'cbb_game': game,
  });

  const scoreIntervals = game.score_interval;

  const sorted_intervals = Object.values(scoreIntervals).sort(function (a, b) {
    // should probably use clock, but DoE should be fine for now
    return a.date_of_entry  < b.date_of_entry ? -1 : 1;
  });


  const theme = useTheme();

  let xAxis = [];
  let series = {
    'home': {
      'name': CBB.getTeamName('home'),
      'data': [],
    },
    'away': {
      'name': CBB.getTeamName('away'),
      'data': [],
    },
  };

  let map = {};

  for (let i = 0; i < sorted_intervals.length; i++) {
    if (!map[sorted_intervals[i].clock + sorted_intervals[i].current_period]) {
      map[sorted_intervals[i].clock + sorted_intervals[i].current_period] = true;
      if (!sorted_intervals[i].current_period.length && sorted_intervals[i].clock === ':00') {
        xAxis.push('HALF');
      } else {
        xAxis.push(sorted_intervals[i].clock);
      }

      series.home.data.push(sorted_intervals[i].home_score);
      series.away.data.push(sorted_intervals[i].away_score);
    }

  }

  const scoringChartOptions = {
    'chart': {
      'type': 'line',
      'style': {
        'position': 'initial',
      },
    },
    'title': {
      'text': 'Scoring timeline'
    },
    'xAxis': {
      'categories': xAxis
    },
    'yAxis': {
      'title': {
        'text': 'Score',
      },
    },
    'plotOptions': {
      'line': {
        'dataLabels': {
          'enabled': false
        },
        'marker': {
          'enabled': false,
        },
        'enableMouseTracking': true
      }
    },
    'series': Object.values(series),
  };



  return (
    <div>
      {!sorted_intervals.length ? <Typography style = {{'textAlign': 'center', 'margin': '10px 0px'}} variant = 'h5'>Nothing here yet...</Typography> : ''}
      {sorted_intervals.length ? <Paper elevation = {3}><HighchartsReact  highcharts={Highcharts} options={scoringChartOptions} /></Paper> : ''}
    </div>
  );
}

export default Scoring;
