import React, { useState } from "react";
import "../style/lobby.css";

export default function Lobby() {
  const [word, setWord] = useState("");
  const [score, setScore] = useState(0);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(word);
    // Add your logic to calculate the score here
    setScore(word.length); // This is just a placeholder logic
  };

  return (
    <main>
      <div className="background">
        <img src={`${process.env.PUBLIC_URL}/img/bglobby.png`} alt="Background Lobby" />
      </div>

      <section className="center">
        <p><strong>Consignes</strong></p>
        <p>
          5 Mini-jeux, 5 points, 5 lettres, réussissez et trouver toutes les lettres pour former le mot !
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value.toUpperCase())}
            maxLength="5"
            pattern="[A-Za-z]{5}"
            required
          />
          <button type="submit">Submit</button>
        </form>
        <p>Score: {score}</p>

      <section className="card-container">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="card">
            <img src={`${process.env.PUBLIC_URL}/img/jeu${index + 1}.png`} alt={`Card ${index + 1}`} />
          </div>
        ))}
      </section>
    </section>
    </main>
  );
}


// Morpion snake pong reactivité