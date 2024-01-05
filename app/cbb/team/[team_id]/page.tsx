'use server';

import { Metadata, ResolvingMetadata } from 'next';
import { headers } from 'next/headers';

import HelperCBB from '@/components/helpers/CBB';
import HelperTeam from '@/components/helpers/Team';
import Api from '@/components/Api.jsx';
import HeaderClientWrapper from '@/components/generic/CBB/Team//Header/HeaderClientWrapper';
import HeaderServer from '@/components/generic/CBB/Team/Header/HeaderServer';
import Schedule from '@/components/generic/CBB/Team/Schedule';
import Trends from '@/components/generic/CBB/Team/Trends';
import NavBar from '@/components/generic/CBB/Team/NavBar';
import Stats from '@/components/generic/CBB/Team/Stats';
import ScheduleClientWrapper from '@/components/generic/CBB/Team/Schedule/ScheduleClientWrapper';
import ScheduleServer from '@/components/generic/CBB/Team/Schedule/ScheduleServer';

const api = new Api();

type Props = {
  params: { team_id: string };
};


export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const team = await getData(params);

  const helperTeam = new HelperTeam({'team': team});

  return {
    title: 'sRating | ' + helperTeam.getName(),
    description: 'View predicted result, matchup, trends, odds',
    openGraph: {
      title: helperTeam.getName(),
      description: helperTeam.getName() + ' schedule, trends, statistics, roster',
    },
    twitter: {
      card: 'summary',
      title: helperTeam.getName(),
      description: helperTeam.getName() + ' schedule, trends, statistics, roster'
    }
  };
};


async function getData(params) {
  const CBB = new HelperCBB();

  const team_id = params.team_id;

  const xUrl = headers().get('x-url') || '';
  const url = new URL(xUrl);
  const searchParams = new URLSearchParams(url.search);

  const season = searchParams.get('season') || CBB.getCurrentSeason();

  const team = await api.Request({
    'class': 'team',
    'function': 'get',
    'arguments': {
      'team_id': team_id,
    }
  });

  const conference = await api.Request({
    'class': 'team',
    'function': 'getConference',
    'arguments': {
      'team_id': team_id,
      'season': season,
    }
  });

  if (team && conference) {
    team.conference = conference.conference;
  }

  return team;
}

// todo who need to redesign schedule component, need session_id to check for ratings

export default async function Page({ params }) {
  const team_id = params.team_id;

  const CBB = new HelperCBB();

  const xUrl = headers().get('x-url') || '';
  const url = new URL(xUrl);
  const searchParams = new URLSearchParams(url.search);

  const season = searchParams?.get('season') || CBB.getCurrentSeason();
  const view = searchParams?.get('view') || 'schedule';

  const tabOrder = ['schedule', 'stats', 'trends'];
  const selectedTab = tabOrder[(tabOrder.indexOf(view) > -1 ? tabOrder.indexOf(view) : 0)];

  return (
    <div>
      <HeaderClientWrapper season = {season} team_id = {team_id}>
        <HeaderServer season = {season} team_id = {team_id} />
      </HeaderClientWrapper>
      <NavBar view = {selectedTab} tabOrder = {tabOrder} />
      {selectedTab == 'schedule' ? <Schedule key = {team_id} team_id = {team_id} season = {season} /> : ''}
      {/* {selectedTab == 'schedule' ? <ScheduleClientWrapper><ScheduleServer team_id = {team_id} season = {season} /></ScheduleClientWrapper> : ''} */}
      {selectedTab == 'stats' ? <Stats key = {team_id} team_id = {team_id} season = {season} /> : ''}
      {selectedTab == 'trends' ? <Trends key = {team_id} team_id = {team_id} season = {season} /> : ''}
    </div>
  );
};
