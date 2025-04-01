import React, { useState, useEffect, useRef } from "react";
import "../style/snake.css";

const TAILLE_CELLULE = 20;
const TAILLE_CANVAS = 500;

const SnakeGame = () => {
  const canvasRef = useRef(null);
  const [corps, setCorps] = useState(0);
  const [serpent, setSerpent] = useState([
    { x: 10, y: 10, isHead: true }
  ]);
  const [direction, setDirection] = useState("droite");
  const directionRef = useRef("droite");
  const [nourriture, setNourriture] = useState({ x: 5, y: 5 });
  const nourritureRef = useRef({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const boucleJeu = useRef(null);
  const lettres = 'A';
  const [lettre, setLettre] = useState('');
  const vitesseRef = useRef(200); // Vitesse initiale (en ms)
  const [pommesEmpoisonnees, setPommesEmpoisonnees] = useState([{ x: 15, y: 15 }]);
  const pommesEmpoisonneesRef = useRef([{ x: 15, y: 15 }]);
  const [pommeEmpoisonnee, setPommeEmpoisonnee] = useState({ x: 15, y: 15 });
  const pommeEmpoisonneeRef = useRef({ x: 15, y: 15 });
  const [hasReached15, setHasReached15] = useState(false);
  const [showLetter, setShowLetter] = useState(false);

  const genererPositionValide = (serpent, positions_existantes) => {
    let x, y;
    do {
      x = Math.floor(Math.random() * (TAILLE_CANVAS / TAILLE_CELLULE));
      y = Math.floor(Math.random() * (TAILLE_CANVAS / TAILLE_CELLULE));
    } while (
      serpent.some(segment => segment.x === x && segment.y === y) ||
      positions_existantes.some(pos => pos.x === x && pos.y === y)
    );
    return { x, y };
  };

  const miseAJourVitesse = (score) => {
    clearInterval(boucleJeu.current);
    vitesseRef.current = Math.max(50, 200 - (score * 10));
    boucleJeu.current = setInterval(miseAJourJeu, vitesseRef.current);
  };

  const miseAJourPommesEmpoisonnees = (score, nouveauCorps) => {
    // Calculer combien de pommes bleues devraient être présentes (1 pomme tous les 3 points)
    const nombrePommesVoulu = 1 + Math.floor(score / 3);
    
    if (nombrePommesVoulu !== pommesEmpoisonneesRef.current.length) {
      let nouvellesPommes = [];
      for (let i = 0; i < nombrePommesVoulu; i++) {
        const nouvellePosition = genererPositionValide(
          nouveauCorps,
          [...nouvellesPommes, nourritureRef.current]
        );
        nouvellesPommes.push(nouvellePosition);
      }
      pommesEmpoisonneesRef.current = nouvellesPommes;
      setPommesEmpoisonnees(nouvellesPommes);
    }
  };

  const miseAJourJeu = () => {
    if (gameOver) {
      clearInterval(boucleJeu.current);
      return;
    }

    setSerpent(serpentActuel => {
      const nouveauSerpent = [...serpentActuel];
      const tete = { ...nouveauSerpent[0] };
      let nouvelleTete = { ...tete, isHead: true };

      switch (directionRef.current) {
        case "haut": nouvelleTete.y -= 1; break;
        case "bas": nouvelleTete.y += 1; break;
        case "gauche": nouvelleTete.x -= 1; break;
        case "droite": nouvelleTete.x += 1; break;
      default: break;
    }
  
      // Vérifier les collisions avec les murs
      if (
        nouvelleTete.x < 0 || 
        nouvelleTete.x >= (TAILLE_CANVAS / TAILLE_CELLULE) ||
        nouvelleTete.y < 0 || 
        nouvelleTete.y >= (TAILLE_CANVAS / TAILLE_CELLULE)
      ) {
        setGameOver(true);
        clearInterval(boucleJeu.current); // Arrêter la boucle de jeu
        return serpentActuel;
      }

      // Vérifier si on mange une pomme (normale ou empoisonnée)
      const mangeNourriture = 
        nouvelleTete.x === nourritureRef.current.x && 
        nouvelleTete.y === nourritureRef.current.y;

      // Vérifier collision avec n'importe quelle pomme empoisonnée
      const mangePommeEmpoisonnee = pommesEmpoisonneesRef.current.some(
        pomme => nouvelleTete.x === pomme.x && nouvelleTete.y === pomme.y
      );

      const nouveauCorps = [nouvelleTete];
      
      // Ajouter tous les segments existants sauf le dernier
      for (let i = 0; i < serpentActuel.length - 1; i++) {
        nouveauCorps.push({
          x: serpentActuel[i].x,
          y: serpentActuel[i].y,
          isHead: false
        });
      }

      if (mangeNourriture || mangePommeEmpoisonnee) {
        if (mangeNourriture) {
          setCorps(prev => prev + 1);
          setScore(prevScore => {
            const newScore = prevScore + 1;
            miseAJourVitesse(newScore);
            
            if (newScore >= 15 && !hasReached15) {
              setLettre('A');
              setHasReached15(true);
            }
            
            // Mettre à jour les pommes empoisonnées selon le nouveau score
            miseAJourPommesEmpoisonnees(newScore, nouveauCorps);
            return newScore;
          });
        }

        if (mangePommeEmpoisonnee) {
          setScore(prevScore => {
            const newScore = Math.max(0, prevScore - 5);
            miseAJourVitesse(newScore);
            // Mettre à jour les pommes empoisonnées selon le nouveau score
            miseAJourPommesEmpoisonnees(newScore, nouveauCorps);
            return newScore;
          });
          
          // Générer de nouvelles positions pour les pommes empoisonnées restantes
          const nouvellesPommes = pommesEmpoisonneesRef.current.map(() => 
            genererPositionValide(nouveauCorps, [nourritureRef.current])
          );
          pommesEmpoisonneesRef.current = nouvellesPommes;
          setPommesEmpoisonnees(nouvellesPommes);
        }
        
        // Générer nouvelle position pour la pomme normale
        const nouvellePosition = genererPositionValide(
          nouveauCorps,
          pommesEmpoisonneesRef.current
        );
        nourritureRef.current = nouvellePosition;
        setNourriture(nouvellePosition);
      }

      return nouveauCorps;
    });
  };

  const handleKeyPress = (event) => {
    // Empêcher le défilement de la page avec les flèches
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
      event.preventDefault();
    }

    // Ne pas changer la direction si le jeu est terminé
    if (!gameOver) {
    switch (event.key) {
      case "ArrowUp":
          if (directionRef.current !== "bas") {
            setDirection("haut");
            directionRef.current = "haut";
          }
        break;
      case "ArrowDown":
          if (directionRef.current !== "haut") {
            setDirection("bas");
            directionRef.current = "bas";
          }
        break;
      case "ArrowLeft":
          if (directionRef.current !== "droite") {
            setDirection("gauche");
            directionRef.current = "gauche";
          }
        break;
      case "ArrowRight":
          if (directionRef.current !== "gauche") {
            setDirection("droite");
            directionRef.current = "droite";
          }
        break;
      default:
        break;
    }
    }
  };

  const handleHiddenClick = () => {
    setShowLetter(true);
    setTimeout(() => setShowLetter(false), 2000); // Cache la lettre après 2 secondes
  };

  const demarrerJeu = () => {
    // Arrêter l'intervalle existant
    if (boucleJeu.current) {
      clearInterval(boucleJeu.current);
      boucleJeu.current = null;
    }

    // Réinitialiser tous les états
    setCorps(0);
    setSerpent([{ x: 10, y: 10, isHead: true }]);
    setDirection("droite");
    directionRef.current = "droite";
    setNourriture({ x: 5, y: 5 });
    nourritureRef.current = { x: 5, y: 5 };
    setScore(0);
    setLettre('');
    setHasReached15(false);
    setGameOver(false);
    setPommesEmpoisonnees([{ x: 15, y: 15 }]);
    pommesEmpoisonneesRef.current = [{ x: 15, y: 15 }];
    setPommeEmpoisonnee({ x: 15, y: 15 });
    pommeEmpoisonneeRef.current = { x: 15, y: 15 };
    setShowLetter(false);

    // Réinitialiser la vitesse
    vitesseRef.current = 200;

    // Démarrer un nouvel intervalle après un court délai
    setTimeout(() => {
      boucleJeu.current = setInterval(miseAJourJeu, vitesseRef.current);
    }, 100);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [gameOver]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, TAILLE_CANVAS, TAILLE_CANVAS);

    // Dessiner le serpent
    serpent.forEach((segment) => {
      ctx.fillStyle = segment.isHead ? "#00FF00" : "#0000FF";
      ctx.fillRect(
        segment.x * TAILLE_CELLULE + 1,
        segment.y * TAILLE_CELLULE + 1,
        TAILLE_CELLULE - 2,
        TAILLE_CELLULE - 2
      );
    });

    // Dessiner la pomme normale (rouge)
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(
      nourriture.x * TAILLE_CELLULE + 1,
      nourriture.y * TAILLE_CELLULE + 1,
      TAILLE_CELLULE - 2,
      TAILLE_CELLULE - 2
    );

    // Dessiner toutes les pommes empoisonnées (bleues)
    ctx.fillStyle = "#0000FF";
    pommesEmpoisonnees.forEach(pomme => {
      ctx.fillRect(
        pomme.x * TAILLE_CELLULE + 1,
        pomme.y * TAILLE_CELLULE + 1,
        TAILLE_CELLULE - 2,
        TAILLE_CELLULE - 2
      );
    });
  }, [serpent, nourriture, pommesEmpoisonnees]);

  useEffect(() => {
    return () => {
      if (boucleJeu.current) {
        clearInterval(boucleJeu.current);
      }
    };
  }, []);

  return (
    <div className="snake-game-container">
      <p className="score">Score: {score}</p>

      <div className="hidden-button" onClick={handleHiddenClick} />

      {showLetter && (
        <div className="letter-popup">
          Lettre: A
        </div>
      )}

      <div className="game-section">
        <div className="game-container">
          <canvas
            ref={canvasRef}
            width={TAILLE_CANVAS}
            height={TAILLE_CANVAS}
            className="game-canvas"
          />
          {(!boucleJeu.current || gameOver) && (
            <div className="game-overlay">
              {gameOver ? (
                <>
                  <p className="game-over">Game Over!</p>
                  {hasReached15 && (
                    <p className="game-letter">Lettre: {lettre}</p>
                  )}
                  <button className="game-button" onClick={demarrerJeu}>
                    Recommencer
                  </button>
                </>
              ) : (
                <button className="game-button" onClick={demarrerJeu}>
                  Démarrer
                </button>
              )}
            </div>
          )}
          <div className="high-score-message">
            Beat your high score !<span className="high-score">15</span>
          </div>
        </div>

        <div className="legends-wrapper">
          {/* Légende des couleurs */}
          <div className="legend-container">
            <div className="legend-item">
              <div className="color-box red"></div>
              <span className="legend-text">+1</span>
            </div>
            <div className="legend-item">
              <div className="color-box blue"></div>
              <span className="legend-text">-5</span>
            </div>
            <div className="legend-item">
              <div className="color-box green"></div>
              <span className="legend-text">Player</span>
            </div>
          </div>

          {/* Légende des contrôles */}
          <div className="legend-container">
            {[
              { key: '↑', text: 'Haut' },
              { key: '↓', text: 'Bas' },
              { key: '←', text: 'Gauche' },
              { key: '→', text: 'Droite' }
            ].map((control, index) => (
              <div key={index} className="legend-item">
                <span className="control-key">{control.key}</span>
                <span className="control-text">{control.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SnakeGame;