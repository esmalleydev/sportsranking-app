'use client';

import { useTransition } from 'react';
import {
  IconButton, Tab, Tabs, Tooltip, useTheme,
} from '@mui/material';
import { getHeaderHeight, getMarginTop } from './Header/ClientWrapper';
import { getNavHeaderHeight } from './NavBar';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import LegendToggleIcon from '@mui/icons-material/LegendToggle';
import HistoryIcon from '@mui/icons-material/History';
import { setShowScheduleDifferentials, setShowScheduleHistoricalRankRecord } from '@/redux/features/team-slice';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { setLoading } from '@/redux/features/display-slice';
import AdditionalOptions from './Schedule/AdditionalOptions';

const getSubNavHeaderHeight = () => 48;


export { getSubNavHeaderHeight };

const SubNavBar = ({ view }) => {
  const theme = useTheme();
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();


  const dispatch = useAppDispatch();
  const scheduleView = useAppSelector((state) => state.teamReducer.scheduleView);
  const showScheduleDifferentials = useAppSelector((state) => state.teamReducer.showScheduleDifferentials);
  const showScheduleHistoricalRankRecord = useAppSelector((state) => state.teamReducer.showScheduleHistoricalRankRecord);

  let subView = searchParams?.get('subview') || (view === 'stats' ? 'team' : 'stats');

  let tabOrder: string[] = [];
  let tabOptions = {};

  if (view === 'stats') {
    tabOrder = ['team', 'player'];
    tabOptions = {
      team: 'Team',
      player: 'Players',
    };
  } else if (view === 'trends') {
    tabOrder = ['stats', 'ranking'];
    tabOptions = {
      ranking: 'Ranking',
      stats: 'Stats',
    };
  }


  const subHeaderHeight = getSubNavHeaderHeight();

  const minSubBarWidth = 75;

  const subHeaderStyle: React.CSSProperties = {
    height: subHeaderHeight,
    position: 'fixed',
    backgroundColor: theme.palette.background.default,
    zIndex: 1100,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    top: getHeaderHeight() + getMarginTop() + getNavHeaderHeight(),
    left: 0,
    right: 0,
    padding: '0px 20px',
  };

  const leftButtons: React.JSX.Element[] = [];
  const middleButtons: React.JSX.Element[] = [];
  const rightButtons: React.JSX.Element[] = [];

  if (view === 'schedule') {
    if (scheduleView === 'default') {
      leftButtons.push(
        <Tooltip key = {'toggle-all-historical-charts-tooltip'} title = {'Toggle all historical charts'}>
          <IconButton
            id = 'differential-button'
            onClick = {() => dispatch(setShowScheduleDifferentials(!showScheduleDifferentials))}
          >
            <LegendToggleIcon color = {showScheduleDifferentials ? 'success' : 'primary'} />
          </IconButton>
        </Tooltip>,
      );

      leftButtons.push(
        <Tooltip key = {'toggle-all-historical-ranking-tooltip'} title = {showScheduleHistoricalRankRecord ? 'Show current record / rank' : 'Show historical record / rank at time of game'}>
          <IconButton
            id = 'historical-button'
            onClick = {() => dispatch(setShowScheduleHistoricalRankRecord(!showScheduleHistoricalRankRecord))}
          >
            <HistoryIcon color = {showScheduleHistoricalRankRecord ? 'success' : 'primary'} />
          </IconButton>
        </Tooltip>,
      );
    }

    rightButtons.push(<AdditionalOptions key = {'additional-options'} />);
  } else if (tabOrder.length) {
    const tabs: React.JSX.Element[] = [];

    const handleTabClick = (value) => {
      subView = tabOrder[value];

      if (searchParams) {
        const current = new URLSearchParams(Array.from(searchParams.entries()));
        current.set('subview', subView);
        const search = current.toString();
        const query = search ? `?${search}` : '';

        dispatch(setLoading(true));
        startTransition(() => {
          router.replace(`${pathName}${query}`);
        });
      }
    };


    for (let i = 0; i < tabOrder.length; i++) {
      tabs.push(<Tab key = {tabOrder[i]} label = {(<span style = {{ fontSize: '12px' }}>{tabOptions[tabOrder[i]]}</span>)} />);
    }


    middleButtons.push(
      <Tabs key = {'tabs'} variant="scrollable" scrollButtons="auto" value={tabOrder.indexOf(subView)} onChange={(e, value) => { handleTabClick(value); }} indicatorColor="secondary" textColor="inherit">
        {tabs}
      </Tabs>,
    );
  }

  return (
    <div style = {subHeaderStyle}>
      <div style = {{ minWidth: minSubBarWidth, display: 'flex' }}>
        {leftButtons}
      </div>

      <div style = {{ minWidth: minSubBarWidth, display: 'flex' }}>
        {middleButtons}
      </div>

      <div style = {{ minWidth: minSubBarWidth, display: 'flex', justifyContent: 'end' }}>
        {rightButtons}
      </div>
    </div>
  );
};

export default SubNavBar;
