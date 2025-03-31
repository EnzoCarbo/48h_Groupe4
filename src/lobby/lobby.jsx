import React, { useState, useRef } from "react";
import "../style/lobby.css";

export default function Lobby() {
  const [word, setWord] = useState("");
  const audioRef = useRef(null);
  const [result, setResult] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (word==="STARS"){
        setResult(true);
        playWinSound();
    } else{
        console.log("wrong");
    }
  };

  const playWinSound = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(error => {
        console.error("Error playing audio:", error);
      });
    }
  };

  const SoundEnd = () => {
    setResult(false);
  };

  return (
    <main>
      <div className="background">
        <img src={`${process.env.PUBLIC_URL}/img/bglobby.png`} alt="Background Lobby" />
      </div>
      {result && (
        <div className="result">
            <img src="/img/win.gif" alt="victoire"/>
        </div>
      )}
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

      <section className="card-container">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="card">
            <img src={`${process.env.PUBLIC_URL}/img/jeu${index + 1}.png`} alt={`Card ${index + 1}`} />
          </div>
        ))}
      </section>
    </section>
    <audio ref={audioRef} src={`${process.env.PUBLIC_URL}/mp3/winsound.mp3`} onEnded={SoundEnd}>
        Musique de victoire bloquer par le navigateur :/
    </audio>

    </main>
  );
}


// Morpion snake pong reactivité