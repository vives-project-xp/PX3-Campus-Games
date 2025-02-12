const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mysql = require("mysql2");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Pas dit aan naar jouw frontend URL voor beveiliging
    }
});

// Database configuratie
const db = mysql.createConnection({
    host: "localhost",
    user: "root", // Pas dit aan naar jouw database user
    password: "", // Pas dit aan naar jouw database wachtwoord
    database: "kaartspel_db"
});

db.connect(err => {
    if (err) {
        console.error("Database verbinding mislukt:", err);
        return;
    }
    console.log("Verbonden met MySQL database");
});

io.on("connection", (socket) => {
    console.log(`Nieuwe speler verbonden: ${socket.id}`);

    // Speler verzendt een bericht
    socket.on("chat_message", (msg) => {
        console.log(`Bericht ontvangen: ${msg}`);
        io.emit("chat_message", msg); // Stuurt bericht naar alle clients
    });

    // Score-update ontvangen en opslaan in database
    socket.on("update_score", (data) => {
        console.log(`Score-update: ${data.user}: ${data.score}`);
        
        const query = "INSERT INTO scores_total (user_id, total_score) VALUES (?, ?) ON DUPLICATE KEY UPDATE total_score = total_score + ?";
        db.query(query, [data.user_id, data.score, data.score], (err) => {
            if (err) {
                console.error("Fout bij updaten van score:", err);
                return;
            }
            io.emit("score_update", data);
        });
    });

    // Kaarten-update ontvangen en opslaan in database
    socket.on("update_cards", (data) => {
        console.log(`Kaarten-update voor ${data.user}: ${data.cards}`);
        
        const query = "INSERT INTO user_cards (user_id, card_name, quantity) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE quantity = quantity + ?";
        db.query(query, [data.user_id, data.card_name, data.quantity, data.quantity], (err) => {
            if (err) {
                console.error("Fout bij updaten van kaarten:", err);
                return;
            }
            io.emit("cards_update", data);
        });
    });

    // Speler verbreekt verbinding
    socket.on("disconnect", () => {
        console.log(`Speler ${socket.id} heeft de verbinding verbroken.`);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`WebSocket-server draait op poort ${PORT}`);
});
