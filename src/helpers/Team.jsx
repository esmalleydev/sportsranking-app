
class Team {
  constructor(args) {
    this.team = args.team || {};
  };

  getName() {
    if (this.team.code) {
      return this.team.code;
    } else if (this.team.kenpom) {
      return this.team.kenpom;
    } else if (this.team.name) {
      return this.team.name;
    }

    return this.team.team_id || 'Unknown';
  };

  getLastRanking () {
    let last = null;
    if (
      this.team &&
      this.team.cbb_ranking
    ) {
      for (let cbb_ranking_id in this.team.cbb_ranking) {
        if (!last || last.date_of_rank < this.team.cbb_ranking[cbb_ranking_id].date_of_rank) {
          last = this.team.cbb_ranking[cbb_ranking_id];
        }
      }
    }
    return last;
  };

  getRank(opt_rankDisplay) {
    const rankDisplay = opt_rankDisplay || 'composite_rank';

    const cbb_ranking = this.getLastRanking();

    if (
      cbb_ranking &&
      cbb_ranking[rankDisplay]
    ) {
      return cbb_ranking[rankDisplay];
    }
    return null;
  };

};

export default Team;
