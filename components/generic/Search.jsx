import React, { useState } from 'react';
import { useRouter } from 'next/router';
import useDebounce from '../hooks/useDebounce';

import { styled, alpha, useTheme } from '@mui/material/styles';

import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import Autocomplete from '@mui/material/Autocomplete';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import Api from './../Api.jsx';
const api = new Api();

const Container = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '200px',
      '&:focus': {
        width: '250px',
      },
    },
  },
}));

const Search = (props) => {
  const theme = useTheme();
  const router = useRouter();

  const [value, setValue] = useState('');
  const [autoCompleteValue, setAutoCompleteValue] = useState(null);
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [spin, setSpin] = useState(false);


  const debouncedRequest = useDebounce(() => {
    api.Request({
      'class': 'cbb',
      'function': 'search',
      'arguments': {
        'name': value,
      },
    }).then((response) => {
      setTeams((response && response.teams) || []);
      setPlayers((response && response.players) || []);
      setLoading(false);
    }).catch((e) => {
      setTeams([]);
      setPlayers([]);
      setLoading(false);
    });
  }, 200);


  const onChange = (e) => {
    const value = e.target.value;
    setValue(value || '');

    setLoading(true);
    debouncedRequest();
  };

  const options = [].concat(teams.map((team) => {
    return {
      'group': 'Teams',
      'team_id': team.team_id,
      'name': team.alt_name,
    }
  })).concat(players.map((player) => {
    return {
      'group': 'Players',
      'player_id': player.player_id,
      'name': player.first_name + ' ' + player.last_name + ' (' + player.begin + '-' + player.end + ')',
    }
  }));

  const handleClick = (event, option) => {
    setSpin(true);
    if (option && option.player_id) {
      router.push('/cbb/player/' + option.player_id).then(() => {
        setSpin(false);
        if (props.onRouter) {
          props.onRouter();
        }
      });
    } else if (option && option.team_id) {
      router.push('/cbb/team/' + option.team_id).then(() => {
        setSpin(false);
        if (props.onRouter) {
          props.onRouter();
        }
      });
    }
    setValue('');
    setTeams([]);
    setPlayers([]);
  };


  return (
    <Container>
    {spin ?
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
        <CircularProgress color="inherit" />
      </Backdrop>
      : ''}
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <Autocomplete
        id="auto complete"
        freeSolo
        onChange={handleClick}
        loading = {loading}
        value = {null}
        options={options}
        groupBy={(option) => option.group}
        getOptionLabel={(option) => option.name}
        fullWidth = {true}
        renderInput={(params) => {
          const {InputLabelProps,InputProps,...rest} = params;
          rest.inputProps.value = value;
          return (
            <StyledInputBase 
              {...params.InputProps}
              {...rest}
              value = {value}
              placeholder = {'Search'}
              autoFocus = {props.focus}
              sx = {{'minWidth': '200px'}}
              onChange = {onChange} 
            />
          );
        }}
      />
    </Container>
  );
}

export default Search;

