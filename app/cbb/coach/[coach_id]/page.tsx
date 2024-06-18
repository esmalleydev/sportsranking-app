import { useServerAPI } from '@/components/serverAPI';
import { Coach, CoachTeamSeasons, Rankings, StatisticRankings, Teams } from '@/types/cbb';
import { Metadata, ResolvingMetadata } from 'next';
import { unstable_noStore } from 'next/cache';

import HelperCBB from '@/components/helpers/CBB';

import HeaderServer from '@/components/generic/CBB/Coach/Header/Server';
import HeaderClientWrapper from '@/components/generic/CBB/Coach/Header/ClientWrapper';

import SeasonsClient from '@/components/generic/CBB/Coach/Seasons/Client';
import SeasonsClientWrapper from '@/components/generic/CBB/Coach/Seasons/ClientWrapper';

import TrendsServer from '@/components/generic/CBB/Coach/Trends/Server';
import TrendsClientWrapper from '@/components/generic/CBB/Coach/Trends/ClientWrapper';

import SubNavBar from '@/components/generic/CBB/Coach/SubNavBar';
import ReduxWrapper from '@/components/generic/CBB/Coach/ReduxWrapper';
import NavBar from '@/components/generic/CBB/Coach/NavBar';


type Props = {
  params: { coach_id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};


export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const coach = await getCoach({params, searchParams});
  
  const name = coach.first_name + ' ' + coach.last_name;

  return {
    title: 'sRating | ' + name,
    description: 'View coach history and statistics',
    openGraph: {
      title: name,
      description: name + ' history, statistics',
    },
    twitter: {
      card: 'summary',
      title: name,
      description: name + ' history, statistics'
    }
  };
};


async function getCoach({params, searchParams}): Promise<Partial<Coach>> {
  const coach_id = params.coach_id;

  const coach = await useServerAPI({
    'class': 'coach',
    'function': 'get',
    'arguments': {
      'coach_id': coach_id
    }
  });

  return coach;
};

type Data = {
  coach: Coach | {};
  coach_team_seasons: CoachTeamSeasons | {};
  teams: Teams | {};
  cbb_statistic_rankings: StatisticRankings | {};
  cbb_rankings: Rankings | {};
}

async function getData({params, searchParams}): Promise<Data> {
  unstable_noStore();
  const revalidateSeconds = 43200; // 60 * 60 * 12; // cache for 12 hours

  // const CBB = new HelperCBB();

  // const season = searchParams?.season || CBB.getCurrentSeason();

  const coach = await getCoach({params, searchParams});

  const coach_team_seasons: CoachTeamSeasons = await useServerAPI({
    'class': 'coach_team_season', 
    'function': 'read',
    'arguments': {
      'coach_id': coach.coach_id,
    }
  }, {revalidate: revalidateSeconds});

  const teams: Teams = await useServerAPI({
    'class': 'team', 
    'function': 'read',
    'arguments': {
      'team_id': Object.values(coach_team_seasons).map(row => row.team_id),
    }
  }, {revalidate: revalidateSeconds});

  const cbb_statistic_rankings: StatisticRankings = await useServerAPI({
    'class': 'cbb_statistic_ranking', 
    'function': 'read',
    'arguments': {
      'team_id': Object.values(teams).map(row => row.team_id),
      'season': Object.values(coach_team_seasons).map(row => row.season),
      'current': '1',
    }
  }, {revalidate: revalidateSeconds});

  const cbb_rankings: Rankings = await useServerAPI({
    'class': 'cbb_ranking', 
    'function': 'read',
    'arguments': {
      'team_id': Object.values(teams).map(row => row.team_id),
      'season': Object.values(coach_team_seasons).map(row => row.season),
      'current': '1',
    }
  }, {revalidate: revalidateSeconds});

  return { coach, coach_team_seasons, teams, cbb_statistic_rankings, cbb_rankings };
};



export default async function Page({ params, searchParams }) {
  const coach_id = params.coach_id;
  const data = await getData({ params, searchParams });

  const CBB = new HelperCBB();

  const season = searchParams?.season || CBB.getCurrentSeason();
  const view: string = searchParams?.view || 'trends';

  const tabOrder = ['trends', 'seasons'];
  const selectedTab = tabOrder[(tabOrder.indexOf(view) > -1 ? tabOrder.indexOf(view) : 0)];

  return (
    <ReduxWrapper coach = {data.coach} coach_team_seasons = {data.coach_team_seasons} teams = {data.teams} cbb_statistic_rankings = {data.cbb_statistic_rankings} cbb_rankings = {data.cbb_rankings} >
      <HeaderClientWrapper>
        <HeaderServer coach_id = {coach_id} season = {season} />
      </HeaderClientWrapper>
      <NavBar view = {selectedTab} tabOrder = {tabOrder} />
      {/* <SubNavBar view = {view} /> */}
      <>
        {
          view === 'trends' ?
            <TrendsClientWrapper>
              <TrendsServer coach_id = {coach_id} />
            </TrendsClientWrapper>
          : ''
        }
        {
          view === 'seasons' ?
            <SeasonsClientWrapper>
              <SeasonsClient coach_team_seasons = {data.coach_team_seasons} teams = {data.teams} cbb_statistic_rankings = {data.cbb_statistic_rankings} />
            </SeasonsClientWrapper>
          : ''
        }
      </>
    </ReduxWrapper>
  );
};
