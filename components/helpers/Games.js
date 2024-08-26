import HelperCBB from './CBB';

class Games {
  constructor(args) {
    this.games = args.games || {};
  };

  /**
   * Get the current live games
   * @return {object}
   */
  getLiveGames() {
    const live_games = {};
    for (let game_id in this.games) {
      const game = this.games[game_id];

      const CBB = new HelperCBB({
        'game': game
      });

      if (CBB.isInProgress()) {
        live_games[game_id] = game;
      }
    }

    return live_games;
  };


  /**
   * Get top ranked (composite) teams playing
   * @return {object}
   */
  getTopRankedGames() {
    const top_games = {};

    for (let game_id in this.games) {
      const game = this.games[game_id];

      const CBB = new HelperCBB({
        'game': game
      });

      if (CBB.isFinal()) {
        continue;
      }

      const homeRank = CBB.getTeamRank('home', 'composite_rank');
      const awayRank = CBB.getTeamRank('away', 'composite_rank');

      if (
        (homeRank && homeRank <= 30) ||
        (awayRank && awayRank <= 30)
      ) {
        top_games[game_id] = game;
      }

    }

    return top_games;
  };


  /**
   * Get games that should be interesting
   * @return {object}
   */
  getThrillerGames() {
    const thriller_games = {};

    for (let game_id in this.games) {
      const game = this.games[game_id];

      const CBB = new HelperCBB({
        'game': game
      });

      if (CBB.isFinal()) {
        continue;
      }

      const homeRank = CBB.getTeamRank('home', 'composite_rank');
      const awayRank = CBB.getTeamRank('away', 'composite_rank');

      const difference = Math.abs(homeRank - awayRank);

      if (
        difference <= 30 &&
        (
          homeRank <= 60 ||
          awayRank <= 60
        )
      ) {
        thriller_games[game_id] = game;
      }

    }

    return thriller_games;
  };


  /**
   * Return games that are close in score
   * @return {object}
   */
  getCloseGames() {
    const live_games = this.getLiveGames();

    const closeGames = {};

    for (let game_id in live_games) {
      const game = live_games[game_id];

      const difference = Math.abs(game.home_score - game.away_score);

      if (
        difference <= 6 &&
        game.home_score > 14 &&
        game.away_score > 14
      ) {
        closeGames[game_id] = game
      }
    }

    return closeGames;
  };


  /**
   * Get live games where the team that "should not" be winning, is winning 
   * @return {object}
   */
  getUpsetAlerts() {
    const live_games = this.getLiveGames();

    const upsets = {};

    for (let game_id in live_games) {
      const game = live_games[game_id];

      // todo define what an upset is
      // todo we could use the CBB.oddsReversal(), but that may not be an upset
      // or maybe if the rank is just x % difference it is an upset
      // or paid feature, checks my predictions
    }

    return upsets;
  };



};

export default Games;
