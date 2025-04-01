import React, { useState, useRef, useEffect } from "react";
import "../style/lobby.css";

// Jeux
import SnakeGame from "../mini-jeux/snake";
import BreakoutGame from "../mini-jeux/bricks";
import PongGame from "../mini-jeux/pong";
import TicTacToe from "../mini-jeux/TicTacToe";
import TapeTaupe from "../mini-jeux/reflex";

export default function Lobby() {
  const [word, setWord] = useState("");
  const [result, setResult] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.2);
  const audioRef = useRef(null);
  const audioRefBack = useRef(null);
  const [jeu, setJeu] = useState("");

  // Tentative pour le mot
  const handleSubmit = (event) => {
    event.preventDefault();
    if (word === "STARS") {
      setResult(true);
      playWinSound();
    } else {
      alert("FAUX !");
    }
  };

  // Son de victoire
  const playWinSound = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(error => {
        console.error("audioWin:", error);
      });
    }
  };

  // Son de fond
  const BackPause = () => {
    const audio = audioRefBack.current;
    if (audio.paused) {
      audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  // Fin d'animation victoire
  const SoundEnd = () => {
    setResult(false);
  };

  // Id du jeu à ouvrir
  const openGame = (id) => {
    setJeu(id);
  };

  // Instances des jeux
  const gameComponents = {
    1: <div><TapeTaupe /></div>,
    2: <div><BreakoutGame /></div>,
    3: <div><SnakeGame /></div>,
    4: <div><PongGame /></div>,
    5: <div><TicTacToe /></div>,
  };

  useEffect(() => {
    const audio = audioRefBack.current;
    audio.volume = volume; // Définir le volume initial

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [volume]);

  return (
    <div className="background-container">
      <main>
        {/* Victoire */}
        {result && (
          <div className="result">
            <img src="/img/win.gif" alt="victoire" />
          </div>
        )}

        <section className="center">
          <section>
            <audio
              ref={audioRefBack}
              src={`${process.env.PUBLIC_URL}/mp3/background.mp3`}
              loop
            >
              Votre navigateur ne supporte pas l'élément audio.
            </audio>
            <button onClick={BackPause} className="margetop">
              {isPlaying ? 'Play' : 'Pause'}
            </button>
          </section>

          {/* Form & menu */}
          <p><strong>Consignes</strong></p>
          <p>5 Mini-jeux, 5 lettres, réussissez les et trouvez toutes les lettres pour former le mot !</p>
          <form onSubmit={handleSubmit}>
            <input
              type="password"
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
          {/* carte au centre */}
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

        {/* Son victoire */}
        <audio
          ref={audioRef}
          src={`${process.env.PUBLIC_URL}/mp3/winsound.mp3`}
          onEnded={SoundEnd}
        >
          Musique de victoire bloquée par le navigateur :/
        </audio>
      </main>
    </div>
  );
}
