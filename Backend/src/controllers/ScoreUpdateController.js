import db from '../db.js';

const addPoints = async (req, res) => {
    try {
        const { id } = req.params;
        const addScore = 100; // Altijd 100 punten toevoegen

        // Controleer of de gebruiker bestaat en haal de huidige score op
        const [user] = await db.execute('SELECT user_score FROM users WHERE id = ?', [id]);
        if (user.length === 0) {
            return res.status(404).json({ error: 'Gebruiker niet gevonden' });
        }

        // Bepaal de nieuwe score
        const oldScore = user[0].user_score;
        const newTotalScore = oldScore + addScore;

        // Update de score van de gebruiker
        await db.execute('UPDATE users SET user_score = ? WHERE id = ?', [newTotalScore, id]);

        res.json({ message: '100 punten toegevoegd!', id, newTotalScore });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export { addPoints };
