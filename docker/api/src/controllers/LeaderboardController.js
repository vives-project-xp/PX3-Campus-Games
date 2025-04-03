import db from '../db.js';

const getUserScoreById = async (req, res) => {
    try {
        const { id } = req.params;
        const query = `SELECT user_score, username FROM users WHERE id = ?`;
        const [rows] = await db.execute(query, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "Gebruiker niet gevonden" });
        }

        res.json({ user_score: rows[0].user_score, username: rows[0].username });
    } 
    catch (error) {
        console.error("Fout bij ophalen van user score:", error);
        res.status(500).json({ error: "Kan score niet ophalen" });
    }
};

const getUsersScores = async (req, res) => {
    try {
        const query = `SELECT id, user_score FROM users ORDER BY user_score DESC limit 10`;
        const [rows] = await db.execute(query);

        if (rows.length === 0) {
            return res.status(404).json({ error: "Geen gebruikers gevonden" });
        }

        res.json(rows);
    } 
    catch (error) {
        console.error("Fout bij ophalen van user scores:", error);
        res.status(500).json({ error: "Kan scores niet ophalen" });
    }
};


export { 
    getUserScoreById,
    getUsersScores
    
};