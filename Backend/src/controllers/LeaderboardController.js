import db from '../db.js';

// 🏆 Top 10 spelers van deze week
const getWeeklyLeaderboard = async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT u.id, u.name, s.score, s.week_number, s.year
            FROM scores_weekly s
            JOIN users u ON s.user_id = u.id
            WHERE s.year = YEAR(CURDATE()) AND s.week_number = WEEK(CURDATE())
            ORDER BY s.score DESC
            LIMIT 10
        `);
        res.json(rows);
    } catch (error) {
        console.error("Fout bij ophalen van de weekly leaderboard:", error);
        res.status(500).json({ error: "Kan leaderboard niet ophalen" });
    }
};

// 🏅 Top 10 spelers aller tijden
 const getTotalLeaderboard = async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT u.id, u.name, s.total_score
            FROM scores_total s
            JOIN users u ON s.user_id = u.id
            ORDER BY s.total_score DESC
            LIMIT 10
        `);
        res.json(rows);
    } catch (error) {
        console.error("Fout bij ophalen van de total leaderboard:", error);
        res.status(500).json({ error: "Kan leaderboard niet ophalen" });
    }
};

// 🎓 Top opleidingen op basis van score
 const getStudyLeaderboard = async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT opleiding, total_score
            FROM scores_study
            ORDER BY total_score DESC
            LIMIT 10
        `);
        res.json(rows);
    } catch (error) {
        console.error("Fout bij ophalen van de study leaderboard:", error);
        res.status(500).json({ error: "Kan leaderboard niet ophalen" });
    }
};

// 🔍 Persoonlijke ranking van een speler
 const getUserRanking = async (req, res) => {
    const { userId } = req.params;
    try {
        const [rows] = await db.execute(`
            SELECT id, name, total_score,
                (SELECT COUNT(*) + 1 
                 FROM scores_total 
                 WHERE total_score > (SELECT total_score FROM scores_total WHERE user_id = ?) 
                ) AS ranking
            FROM users
            WHERE id = ?
        `, [userId, userId]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "Gebruiker niet gevonden" });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error("Fout bij ophalen van user ranking:", error);
        res.status(500).json({ error: "Kan ranking niet ophalen" });
    }
};

export { 
    getWeeklyLeaderboard, 
    getTotalLeaderboard,
    getStudyLeaderboard, 
    getUserRanking, 
};