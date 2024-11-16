// utils/gameStats.js
class GameStats {
    constructor() {
        this.scores = new Map();
        this.achievements = new Map();
    }

    addScore(userId, game, points) {
        if (!this.scores.has(userId)) {
            this.scores.set(userId, {});
        }
        const userScores = this.scores.get(userId);
        userScores[game] = (userScores[game] || 0) + points;
    }

    getLeaderboard(game) {
        const leaderboard = [];
        this.scores.forEach((scores, userId) => {
            if (scores[game]) {
                leaderboard.push({
                    userId,
                    score: scores[game]
                });
            }
        });
        return leaderboard.sort((a, b) => b.score - a.score);
    }
}

module.exports = new GameStats();