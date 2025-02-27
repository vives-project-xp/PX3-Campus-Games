import db from '../db.js';

const getUserScoreById = async (req, res) => {
    try {
        const { id } = req.params;
        const query = `SELECT user_score FROM users WHERE id = ?`;
        const [rows] = await db.execute(query, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "Gebruiker niet gevonden" });
        }

        res.json({ user_score: rows[0].user_score });
    } 
    catch (error) {
        console.error("Fout bij ophalen van user score:", error);
        res.status(500).json({ error: "Kan score niet ophalen" });
    }
};


export { 
    getUserScoreById
};