'use client';

import { useAppSelector } from '@/redux/hooks';
import { Skeleton } from '@mui/material';
import Color, { getBestColor, getWorstColor } from '@/components/utils/Color';
import CBB from '@/components/helpers/CBB';
import Organization from '@/components/helpers/Organization';
import CFB from '@/components/helpers/CFB';
import { Game } from '@/types/general';


const ConferenceRank = (
  { game, conference_id }:
  { game: Game; conference_id: string; },
) => {
  const conferenceStats = useAppSelector((state) => state.gameReducer.conferenceStats);
  const gameStatsLoading = useAppSelector((state) => state.gameReducer.gameStatsLoading);
  const displayRank = useAppSelector((state) => state.displayReducer.rank);

  let numberOfTeams = CBB.getNumberOfD1Teams(game.season);

  if (game.organization_id === Organization.getCFBID()) {
    numberOfTeams = CFB.getNumberOfTeams({ division_id: game.division_id, season: game.season });
  }

  // const current = (conferenceStats[game.game_id] && conferenceStats[game.game_id].current[conference_id]) || null;
  const historical = (conferenceStats[game.game_id] && conferenceStats[game.game_id].historical[conference_id]) || null;
  const statistic_ranking = historical;

  const bestColor = getBestColor();
  const worstColor = getWorstColor();

  let rank = null;
  if (statistic_ranking) {
    rank = displayRank in statistic_ranking ? statistic_ranking[displayRank] : statistic_ranking.rank;
  }

  const supFontSize = 10;

  const supRankStyle: React.CSSProperties = {
    fontSize: supFontSize,
    marginRight: '5px',
    fontWeight: 700,
  };

  if (rank) {
    supRankStyle.color = Color.lerpColor(bestColor, worstColor, (+(rank / numberOfTeams)));
  }

  if (gameStatsLoading) {
    return <Skeleton style={{ width: 10, height: 10, display: 'inline-block', marginRight: 2.5 }} />;
  }

  return (
    <sup style = {supRankStyle}>
      {rank || ''}
    </sup>
  );
};

export default ConferenceRank;