
## Eindpunten

### 1. **Voeg een gebruiker toe**
- **Endpoint:** `/users`
- **Methode:** `POST`
- **Parameters:**
  - `username` (string, verplicht): De naam van de gebruiker.
  - `email` (string, verplicht): Het e-mailadres van de gebruiker.
  - `password` (string, verplicht): Het wachtwoord van de gebruiker.
- **Response:**
  - **201 Created**
    ```json
    {
      "message": "User created",
      "userId": <userId>
    }
    ```
  - **400 Bad Request**
    ```json
    {
      "error": "<error message>"
    }
    ```
  - **500 Internal Server Error**
    ```json
    {
      "error": "<error message>"
    }
    ```

### 2. **Haal alle gebruikers op**
- **Endpoint:** `/users`
- **Methode:** `GET`
- **Response:**
  - **200 OK**
    ```json
    [
      {
        "id": <userId>,
        "name": "<username>",
        "opleiding": "<opleiding>",
        "created_at": "<timestamp>"
      },
      ...
    ]
    ```
  - **500 Internal Server Error**
    ```json
    {
      "error": "<error message>"
    }
    ```

### 3. **Haal een gebruiker op**
- **Endpoint:** `/users/:param/:value`
- **Methode:** `GET`
- **Parameters:**
  - `param` (string, verplicht): De kolomnaam (id, name, opleiding) om op te zoeken.
  - `value` (string, verplicht): De waarde om te zoeken.
- **Response:**
  - **200 OK**
    ```json
    [
      {
        "id": <userId>,
        "name": "<username>",
        "opleiding": "<opleiding>",
        "created_at": "<timestamp>"
      }
    ]
    ```
  - **400 Bad Request**
    ```json
    {
      "error": "Invalid search parameter"
    }
    ```
  - **500 Internal Server Error**
    ```json
    {
      "error": "<error message>"
    }
    ```

### 4. **Verwijder een gebruiker**
- **Endpoint:** `/users/:id`
- **Methode:** `DELETE`
- **Parameters:**
  - `id` (integer, verplicht): De ID van de gebruiker die verwijderd moet worden.
- **Response:**
  - **200 OK**
    ```json
    {
      "message": "User deleted",
      "oldUser": {
        "id": <userId>,
        "name": "<username>",
        "opleiding": "<opleiding>",
        ...
      }
    }
    ```
  - **500 Internal Server Error**
    ```json
    {
      "error": "<error message>"
    }
    ```

### 5. **Haal de wekelijkse leaderboard op**
- **Endpoint:** `/leaderboard/weekly`
- **Methode:** `GET`
- **Response:**
  - **200 OK**
    ```json
    [
      {
        "id": <userId>,
        "name": "<username>",
        "score": <score>,
        "week_number": <weekNumber>,
        "year": <year>
      },
      ...
    ]
    ```
  - **500 Internal Server Error**
    ```json
    {
      "error": "Kan leaderboard niet ophalen"
    }
    ```

### 6. **Haal de totale leaderboard op**
- **Endpoint:** `/leaderboard/total`
- **Methode:** `GET`
- **Response:**
  - **200 OK**
    ```json
    [
      {
        "id": <userId>,
        "name": "<username>",
        "total_score": <totalScore>
      },
      ...
    ]
    ```
  - **500 Internal Server Error**
    ```json
    {
      "error": "Kan leaderboard niet ophalen"
    }
    ```

### 7. **Haal de studie leaderboard op**
- **Endpoint:** `/leaderboard/study`
- **Methode:** `GET`
- **Response:**
  - **200 OK**
    ```json
    [
      {
        "opleiding": "<opleiding>",
        "total_score": <totalScore>
      },
      ...
    ]
    ```
  - **500 Internal Server Error**
    ```json
    {
      "error": "Kan leaderboard niet ophalen"
    }
    ```

### 8. **Haal de persoonlijke ranking van een speler op**
- **Endpoint:** `/ranking/:userId`
- **Methode:** `GET`
- **Parameters:**
  - `userId` (integer, verplicht): De ID van de gebruiker waarvan de ranking moet worden opgehaald.
- **Response:**
  - **200 OK**
    ```json
    {
      "id": <userId>,
      "name": "<username>",
      "total_score": <totalScore>,
      "ranking": <ranking>
    }
    ```
  - **404 Not Found**
    ```json
    {
      "error": "Gebruiker niet gevonden"
    }
    ```
  - **500 Internal Server Error**
    ```json
    {
      "error": "Kan ranking niet ophalen"
    }
    ```

### 9. **Voeg een kaart toe aan een gebruiker**
- **Endpoint:** `/users/cards`
- **Methode:** `POST`
- **Parameters:**
  - `user_id` (integer, verplicht): De ID van de gebruiker.
  - `card_id` (integer, verplicht): De ID van de kaart.
  - `quantity` (integer, verplicht): De hoeveelheid van de kaart.
- **Response:**
  - **200 OK**
    ```json
    {
      "message": "Kaart toegevoegd aan gebruiker"
    }
    ```
  - **500 Internal Server Error**
    ```json
    {
      "error": "Kan kaart niet toevoegen"
    }
    ```

### 10. **Haal alle kaarten van een speler op**
- **Endpoint:** `/users/:user_id/cards`
- **Methode:** `GET`
- **Parameters:**
  - `user_id` (integer, verplicht): De ID van de gebruiker.
- **Response:**
  - **200 OK**
    ```json
    [
      {
        "card_id": <cardId>,
        "name": "<cardName>",
        "health": <health>,
        "attack": <attack>,
        "defense": <defense>,
        "rarity": "<rarity>",
        "quantity": <quantity>
      },
      ...
    ]
    ```
  - **500 Internal Server Error**
    ```json
    {
      "error": "Kan kaarten niet ophalen"
    }
    ```

### 11. **Ruil een kaart met een andere speler**
- **Endpoint:** `/trade`
- **Methode:** `POST`
- **Parameters:**
  - `senderId` (integer, verplicht): De ID van de verzender.
  - `receiverId` (integer, verplicht): De ID van de ontvanger.
  - `senderCardId` (integer, verplicht): De ID van de kaart van de verzender.
  - `receiverCardId` (integer, verplicht): De ID van de kaart van de ontvanger.
- **Response:**
  - **200 OK**
    ```json
    {
      "message": "Trade succesvol"
    }
    ```
  - **400 Bad Request**
    ```json
    {
      "error": "Beide spelers moeten de kaart bezitten"
    }
    ```
  - **500 Internal Server Error**
    ```json
    {
      "error": "<error message>"
    }
    ```

### 12. **Geef een starter pack aan een gebruiker**
- **Endpoint:** `/users/starter-pack`
- **Methode:** `POST`
- **Parameters:**
  - `userId` (integer, verplicht): De ID van de gebruiker die het starter pack ontvangt.
- **Response:**
  - **200 OK**
    ```json
    {
      "message": "Starter pack ontvangen!"
    }
    ```
  - **500 Internal Server Error**
    ```json
    {
      "error": "<error message>"
    }
    ```

### 13. **Registreer een gebruiker**
- **Endpoint:** `/register`
- **Methode:** `POST`
- **Parameters:**
  - `username` (string, verplicht): De naam van de gebruiker.
  - `email` (string, verplicht): Het e-mailadres van de gebruiker.
  - `password` (string, verplicht): Het wachtwoord van de gebruiker.
- **Response:**
  - **201 Created**
    ```json
    {
      "message": "User aangemaakt",
      "userId": <userId>
    }
    ```
  - **400 Bad Request**
    ```json
    {
      "error": "Gebruiker bestaat al"
    }
    ```
  - **500 Internal Server Error**
    ```json
    {
      "error": "<error message>"
    }
    ```

### 14. **Login een gebruiker**
- **Endpoint:** `/login`
- **Methode:** `POST`
- **Parameters:**
  - `username` (string, verplicht): De naam van de gebruiker.
  - `password` (string, verplicht): Het wachtwoord van de gebruiker.
- **Response:**
  - **200 OK**
    ```json
    {
      "message": "Login succesvol",
      "token": "<jwt_token>"
    }
    ```
  - **401 Unauthorized**
    ```json
    {
      "error": "Ongeldige login"
    }
    ```
  - **500 Internal Server Error**
    ```json
    {
      "error": "<error message>"
    }
    ```

## Foutafhandeling
Alle API-eindpunten kunnen een foutmelding teruggeven in het geval van een interne serverfout of een andere fout. De foutmelding zal altijd in de volgende structuur zijn:
```json
{
  "error": "<error message>"
}


