
import Team from './Team';


class CBB {
  constructor(args) {
    this.cbb_game = args.cbb_game || null;
    this.team = args.team || null;
  };


  /**
   * Return the number to display next to a team
   * Ex: 1 Purdue
   * @param  {String} side            home or away
   * @param  {String} rankDisplay     the column to display
   * @return {?Number}
   */
  getTeamRank(side, rankDisplay) {
    if (
      rankDisplay &&
      this.cbb_game &&
      this.cbb_game[side + '_team_id'] &&
      this.cbb_game.teams &&
      this.cbb_game[side + '_team_id'] in this.cbb_game.teams &&
      this.cbb_game.teams[this.cbb_game[side + '_team_id']].ranking &&
      this.cbb_game.teams[this.cbb_game[side + '_team_id']].ranking[rankDisplay]
    ) {
      return this.cbb_game.teams[this.cbb_game[side + '_team_id']].ranking[rankDisplay];
    }
    return null;
  };

  /**
   * Get the team name
   * @param  {String} side home or away
   * @return {String}
   */
  getTeamName(side) {
    let name = 'Unknown';
    if (
      this.cbb_game &&
      this.cbb_game[side + '_team_id'] &&
      this.cbb_game.teams &&
      this.cbb_game[side + '_team_id'] in this.cbb_game.teams
    ) {
      const team = this.cbb_game.teams[this.cbb_game[side + '_team_id']];
      name = new Team({'team': team}).getName();
    }

    return name;
  }


  /**
   * Is the game in progress?
   * @return {Boolean}
   */
  isInProgress() {
    return (this.cbb_game.status !== 'pre' && this.cbb_game.status !== 'final' && this.cbb_game.status !== 'postponed' && this.cbb_game.status !== 'cancelled');
  }

  /**
   * Is the game final?
   * @return {Boolean} [description]
   */
  isFinal() {
    return (this.cbb_game.status === 'final');
  }

  /**
   * Get the start time or status or time remaining in game
   * @return {String}
   */
  getTime() {
    let startTime = 'Unknown';
    if (this.isFinal()) {
      startTime = 'Final';
    } else if (this.isInProgress()) {
      startTime = this.getGameTime();
    } else if (this.cbb_game.status === 'pre') {
      let date = new Date(this.cbb_game.start_timestamp * 1000);
      startTime = ((date.getHours() % 12) || 12) + (date.getMinutes() ? ':' + date.getMinutes() : '') + ' ' + (date.getHours() < 12 ? 'am' : 'pm') + ' ';
      if (date.getHours() >= 0 && date.getHours() <= 6) {
        startTime = 'TBA';
      }
    } else if (this.cbb_game.status === 'postponed') {
      startTime = 'Postponed';
    } else if (this.cbb_game.status === 'cancelled') {
      startTime = 'Cancelled';
    }

    return startTime;
  };

  /**
   * Get the time remaining in game
   * @return {String}
   */
  getGameTime() {
    if (this.isInProgress() && !this.cbb_game.current_period) {
      return 'Half';
    }
    let formatted_period = this.cbb_game.current_period;
    if (formatted_period == '1ST HALF') {
      formatted_period = '1st';
    } else if (formatted_period == '2ND HALF') {
      formatted_period = '2nd'
    }

    return this.cbb_game.clock + ' ' + formatted_period;
  }


  /**
   * Get the pre-game odds
   * @param  {String} side home or away
   * @return {String}
   */
  getPreOdds(side) {
    if (
      this.cbb_game.odds &&
      this.cbb_game.odds['pre_game_money_line_' + side]
    ) {
      return this.cbb_game.odds['pre_game_money_line_' + side];
    }

    return '-';
  }

  /**
   * Get the live game odds
   * @param  {String} side home or away
   * @return {String}
   */
  getLiveOdds(side) {
    if (
      this.isInProgress() &&
      this.cbb_game.odds &&
      this.cbb_game.odds['live_game_money_line_' + side] &&
      this.cbb_game.odds['live_game_money_line_' + side] > -9000
    ) {
      return this.cbb_game.odds['live_game_money_line_' + side];
    }

    return '-';
  }

  /**
   * Have the odds reversed since pre-game?
   * @param  {String} side home or away
   * @return {Boolean}
   */
  oddsReversal(side) {
    let pre = 0;
    let live = 0;
    if (
      this.cbb_game.odds &&
      (pre = +this.cbb_game.odds['pre_game_money_line_' + side]) &&
      this.isInProgress() &&
      this.cbb_game.odds &&
      (live = +this.cbb_game.odds['live_game_money_line_' + side]) &&
      (pre < 0 && live > 0 && live > 100) 
    ) {
      return true;
    }

    return false;
  }

};

export default CBB;
