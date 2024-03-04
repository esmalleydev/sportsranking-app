'use client';
import React, { useState, useTransition } from 'react';


import HelperCBB from '@/components/helpers/CBB';
import HelperTeam from '@/components/helpers/Team';
import { getBreakPoint } from '@/components/generic/CBB/Compare/Header/ClientWrapper';
import { Dimensions, useWindowDimensions } from '@/components/hooks/useWindowDimensions';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import Color, { getBestColor, getWorstColor } from '@/components/utils/Color';
import { IconButton, Link, Skeleton, Tooltip, Typography } from '@mui/material';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import BackdropLoader from '@/components/generic/BackdropLoader';
import { setHomeTeamID, setAwayTeamID } from '@/redux/features/compare-slice';


const Client = ({ home_team_id, away_team_id, teams, season }) => {
  const CBB = new HelperCBB();
  const ColorUtil = new Color();

  const breakPoint = getBreakPoint();
  const bestColor = getBestColor();
  const worstColor = getWorstColor();
  const { width } = useWindowDimensions() as Dimensions;
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [spin, setSpin] = useState(false);

  const dispatch = useAppDispatch();
  const displayRank = useAppSelector(state => state.displayReducer.rank);
  const neutral_site = useAppSelector(state => state.compareReducer.neutral_site);

  const handleRemove = (team_id) => {
    setSpin(true);
    startTransition(() => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      let key: string | null = null;
      if (team_id === home_team_id) {
        current.delete('home_team_id');
        key = 'home';
      } else if (team_id === away_team_id) {
        current.delete('away_team_id');
        key = 'away';
      }
      const search = current.toString();
      const query = search ? `?${search}` : "";
      router.replace(`${pathName}${query}`);

      if (key === 'home') {
        dispatch(setHomeTeamID(null));
      } else if (key === 'away') {
        dispatch(setAwayTeamID(null));
      }

      setSpin(false);
    });
  };

  const handleSwap = () => {
    setSpin(true);
    startTransition(() => {
      if (home_team_id && away_team_id) {
        const current = new URLSearchParams(Array.from(searchParams.entries()));
        current.set('home_team_id', away_team_id);
        current.set('away_team_id', home_team_id);
        const search = current.toString();
        const query = search ? `?${search}` : "";
        router.replace(`${pathName}${query}`);
      }
      dispatch(setHomeTeamID(away_team_id));
      dispatch(setAwayTeamID(home_team_id));
      setSpin(false);
    });
  };

  const handleTeamClick = (team_id) => {
    setSpin(true);
    startTransition(() => {
      router.push('/cbb/team/' + team_id + '?season=' + season);
      setSpin(false);
    });
  };

  const getTeam = (team_id) => {
    const team = teams[team_id];
    const teamHelper = new HelperTeam({'team': team});
    const rank = teamHelper.getRank(displayRank);

    let justifyContent = 'right';
    let teamName = teamHelper.getName();

    if (team_id === away_team_id) {
      justifyContent = 'left';
    }

    if (width < breakPoint) {
      teamName = teamHelper.getNameShort();
    }

    const supStyle: React.CSSProperties = {
      'fontSize': 12,
      'verticalAlign': 'super',
    };

    if (rank) {
      supStyle.color = ColorUtil.lerpColor(bestColor, worstColor, (+(rank / CBB.getNumberOfD1Teams(CBB.getCurrentSeason()))));
    }

    const getRemoveButton = () => {
      return (
        <div>
          <Tooltip title = {'Remove team'}>
            <IconButton
              id = 'remove-button'
              onClick = {() => {handleRemove(team_id)}}
            >
              <HighlightOffIcon color = {'error'} />
            </IconButton>
          </Tooltip>
        </div>
      );
    };

    return (
      <div style = {{'display': 'flex', 'alignItems': 'center'}}>
        {team_id === home_team_id ? getRemoveButton() : ''}
        <div>
          <div style = {{'fontSize': '14px', 'display': 'flex', 'justifyContent': justifyContent}}>
            <Typography variant = 'overline' color = 'text.secondary' style = {{'lineHeight': 'initial'}}>{neutral_site ? 'Neutral' : (team_id === home_team_id ? 'Home' : 'Away')}</Typography>
          </div>
          <div style = {{'display': 'flex', 'flexWrap': 'nowrap', 'justifyContent': justifyContent}} onClick={() => {handleTeamClick(team_id)}}>
            <Typography style = {{'whiteSpace': 'nowrap', 'textOverflow': 'ellipsis', 'overflow': 'hidden'}} variant = {'h6'}>
              {rank ? <span style = {supStyle}>{rank} </span> : ''}
              <Link style = {{'cursor': 'pointer'}} underline='hover'>{teamName}</Link>
            </Typography>
          </div>
          <div style = {{'fontSize': '14px', 'display': 'flex', 'justifyContent': justifyContent}}>
            <Typography variant = 'overline' color = 'text.secondary' style = {{'lineHeight': 'initial'}}>{(width > breakPoint ? team?.conference + ' ' : '')}({team?.stats?.wins || 0}-{team?.stats?.losses || 0})</Typography>
          </div>
        </div>
        {team_id === away_team_id ? getRemoveButton() : ''}
      </div>
    );
  };

  const nameStyle: React.CSSProperties = {
    'maxWidth': width < breakPoint ? 175 : 'initial',
    'minWidth': 100
  };


  return (
    <div style = {{'display': 'flex', 'justifyContent': 'space-between', 'padding': '0px 5px', 'alignItems': 'center'}}>
      <div style = {nameStyle}>
        {
        !away_team_id ?
          'Pick an away team' :
          (away_team_id in teams ? <>{getTeam(away_team_id)}</> : <Skeleton style={{'height': 60, 'transform': 'initial'}} />)
        }
      </div>
      <div>
        {
        home_team_id && away_team_id ?
          <Tooltip title = {'Swap teams'}>
            <IconButton
              id = 'swap-button'
              onClick = {handleSwap}
            >
              <SwapHorizIcon color = {'primary'} />
            </IconButton>
          </Tooltip>
          : ''
        }
      </div>
      <div style = {nameStyle}>
      {
        !home_team_id ?
          'Pick a home team' :
          (home_team_id in teams ? <>{getTeam(home_team_id)}</> : <Skeleton style={{'height': 60, 'transform': 'initial'}} />)
        }
      </div>
      {spin ? <BackdropLoader /> : ''}
    </div>
  );
}

export default Client;
