import db from '../db.js';

const addPoints = async (req, res) => {
    try {
        const { userId } = req.params;
        const addScore = 100; // Altijd 100 punten toevoegen

        // Controleer of de gebruiker bestaat
        const [user] = await db.execute('SELECT id , total_score FROM scores_total WHERE user_id = ?', [userId]);
        if (user.length === 0) {
            return res.status(404).json({ error: 'Gebruiker niet gevonden' });
        }

        // Update de score van de gebruiker
        const newTotalScore = user[0].total_score + addScore;
        await db.execute('UPDATE scores_total SET total_score = ? WHERE user_id = ?', [newTotalScore, userId]);
        
        res.json({ message: '100 punten toegevoegd!', userId, newTotalScore });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export { addPoints };
