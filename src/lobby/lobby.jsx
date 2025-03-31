import React, { useState, useRef } from "react";
import "../style/lobby.css";

// Jeu
import SnakeGame from "../mini-jeux/snake";
import BreakoutGame from "../mini-jeux/bricks";
import PongGame from "../mini-jeux/pong";

export default function Lobby() {
  const [word, setWord] = useState("");
  const [result, setResult] = useState(false);
  const audioRef = useRef(null);
  const [jeu, setJeu] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (word === "STARS") {
      setResult(true);
      playWinSound();
    } else {
      alert("FAUX !");
    }
  };

  const playWinSound = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(error => {
        console.error("audioWin:", error);
      });
    }
  };

  const SoundEnd = () => {
    setResult(false);
  };

  const openGame = (id) => {
    setJeu(id);
  };

  const gameComponents = {
    1: <div><p>Game 1 Content</p></div>,
    2: <div><BreakoutGame/></div>,
    3: <div><SnakeGame /></div>,
    4: <div><PongGame/></div>,
    5: <div><p>Game 5 Content</p></div>,
  };

  return (
    <div className="background-container">
      <main>
        {result && (
          <div className="result">
            <img src="/img/win.gif" alt="victoire" />
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
          <section className="game">
            {gameComponents[jeu]}
            </section>
          <section className="card-container">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="card">
                <img
                  src={`${process.env.PUBLIC_URL}/img/jeu${index + 1}.png`}
                  alt={`Card ${index + 1}`}
                  onClick={() => openGame(index + 1)}
                />
              </div>
            ))}
          </section>
        </section>
        <audio
          ref={audioRef}
          src={`${process.env.PUBLIC_URL}/mp3/winsound.mp3`}
          onEnded={SoundEnd}
        >
          Musique de victoire bloquer par le navigateur :/
        </audio>
        {/* Game Section */}
      </main>
    </div>
  );
}
