import { useServerAPI } from '@/components/serverAPI';
import { StatisticRankings } from '@/types/cbb';
import { CoachTeamSeasons, Conference, Teams, TeamSeasonConferences } from '@/types/general';
import { Metadata, ResolvingMetadata } from 'next';
import { unstable_noStore } from 'next/cache';

import HeaderServer from '@/components/generic/Conference/Header/Server';
import HeaderClientWrapper from '@/components/generic/Conference/Header/ClientWrapper';

// import SeasonsClient from '@/components/generic/Conference/Seasons/Client';
// import SeasonsClientWrapper from '@/components/generic/Conference/Seasons/ClientWrapper';

import TeamsClientWrapper from '@/components/generic/Conference/Teams/ClientWrapper';
import TeamsClient from '@/components/generic/Conference/Teams/Client';

// import SubNavBar from '@/components/generic/Conference/SubNavBar';
import ReduxWrapper from '@/components/generic/Conference/ReduxWrapper';
import NavBar from '@/components/generic/Conference/NavBar';
import Organization from '@/components/helpers/Organization';
import CFB from '@/components/helpers/CFB';


type Props = {
  params: { coach_id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};


export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const conference = await getConference({ params, searchParams });

  const { name } = conference;

  return {
    title: `sRating | ${name}`,
    description: 'View conference history and statistics',
    openGraph: {
      title: name,
      description: `${name} history, statistics`,
    },
    twitter: {
      card: 'summary',
      title: name,
      description: `${name} history, statistics`,
    },
  };
}


async function getConference({ params, searchParams }): Promise<Partial<Conference>> {
  const { conference_id } = params;

  const conference = await useServerAPI({
    class: 'conference',
    function: 'get',
    arguments: {
      conference_id,
    },
  });

  return conference;
}

type Data = {
  team_season_conferences: TeamSeasonConferences;
  teams: Teams;
  statistic_rankings: StatisticRankings;
  division_id: string | null;
}

async function getData({ params, searchParams }): Promise<Data> {
  unstable_noStore();
  const revalidateSeconds = 43200; // 60 * 60 * 12; // cache for 12 hours

  const organization_id = Organization.getCFBID();
  const season = searchParams?.season || CFB.getCurrentSeason();

  const conference = await getConference({ params, searchParams });

  const team_season_conferences: TeamSeasonConferences = await useServerAPI({
    class: 'team_season_conference',
    function: 'read',
    arguments: {
      conference_id: conference.conference_id,
      season,
      organization_id,
    },
  }, { revalidate: revalidateSeconds });

  let division_id: string | null = null;
  // these should all be the same
  for (const team_season_conference_id in team_season_conferences) {
    const row = team_season_conferences[team_season_conference_id];
    division_id = row.division_id;
  }

  const teams: Teams = await useServerAPI({
    class: 'team',
    function: 'read',
    arguments: {
      team_id: Object.values(team_season_conferences).map((row) => row.team_id),
    },
  }, { revalidate: revalidateSeconds });

  const statistic_rankings: StatisticRankings = await useServerAPI({
    class: 'statistic_ranking',
    function: 'readStats',
    arguments: {
      organization_id,
      division_id,
      team_id: Object.values(teams).map((row) => row.team_id),
      season,
      current: '1',
    },
  }, { revalidate: revalidateSeconds });


  return { team_season_conferences, teams, statistic_rankings, division_id };
}

// todo this loading is all pretty quick... but when I start to add more data here, update this to split the loading and use suspense like the rest of the app

export default async function Page({ params, searchParams }) {
  const { conference_id } = params;
  const data = await getData({ params, searchParams });

  const organization_id = Organization.getCFBID();
  const { division_id } = data;
  const season = searchParams?.season || CFB.getCurrentSeason();
  const view: string = searchParams?.view || 'teams';

  const tabOrder = ['teams'];
  const selectedTab = tabOrder[(tabOrder.indexOf(view) > -1 ? tabOrder.indexOf(view) : 0)];

  return (
    <ReduxWrapper team_season_conferences = {data.team_season_conferences} teams = {data.teams} statistic_rankings = {data.statistic_rankings}>
      <HeaderClientWrapper>
        <HeaderServer organization_id={organization_id} division_id={division_id} conference_id = {conference_id} season = {season} />
      </HeaderClientWrapper>
      <NavBar view = {selectedTab} tabOrder = {tabOrder} />
      {/* <SubNavBar view = {view} /> */}
      <>
        {
          view === 'teams' ?
            <TeamsClientWrapper>
              <TeamsClient organization_id={organization_id} division_id={division_id} conference_id = {conference_id} season = {season} />
            </TeamsClientWrapper>
            : ''
        }
      </>
    </ReduxWrapper>
  );
}