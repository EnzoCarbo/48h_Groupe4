import React, { useState, useEffect, useRef } from "react";

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
  const lettres = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  const [lettre, setLettre] = useState('');
  const vitesseRef = useRef(200); // Vitesse initiale (en ms)
  const [pommesEmpoisonnees, setPommesEmpoisonnees] = useState([{ x: 15, y: 15 }]);
  const pommesEmpoisonneesRef = useRef([{ x: 15, y: 15 }]);
  const [pommeEmpoisonnee, setPommeEmpoisonnee] = useState({ x: 15, y: 15 });
  const pommeEmpoisonneeRef = useRef({ x: 15, y: 15 });

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
            
            if (newScore === 15) {
              const lettreAleatoire = lettres[Math.floor(Math.random() * lettres.length)];
              setLettre(lettreAleatoire);
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

  const demarrerJeu = () => {
    setCorps(0);
    setSerpent([{ x: 10, y: 10, isHead: true }]);
    setDirection("droite");
    directionRef.current = "droite";
    setNourriture({ x: 5, y: 5 });
    nourritureRef.current = { x: 5, y: 5 };
    setScore(0);
    setLettre('');
    setGameOver(false);
    setPommesEmpoisonnees([{ x: 15, y: 15 }]);
    pommesEmpoisonneesRef.current = [{ x: 15, y: 15 }];
    setPommeEmpoisonnee({ x: 15, y: 15 });
    pommeEmpoisonneeRef.current = { x: 15, y: 15 };

    // Réinitialiser la vitesse
    vitesseRef.current = 200;
    if (boucleJeu.current) {
      clearInterval(boucleJeu.current);
    }
    boucleJeu.current = setInterval(miseAJourJeu, vitesseRef.current);
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
    <div style={{ textAlign: "center", padding: "20px" }}>
        <p style={{ color: "black", width: "100px", backgroundColor: "white", borderRadius: "5px" }}>
          {score < 15 ? `Score: ${score}` : `Lettre: ${lettre}`}
        </p>
      <canvas
        ref={canvasRef}
        width={TAILLE_CANVAS}
        height={TAILLE_CANVAS}
        style={{
          border: "2px solid #333",
          backgroundColor: "#000"
        }}
      />
      <div style={{ marginTop: "20px" }}>

        {gameOver && (
          <p style={{ color: "red" }}>Game Over!</p>
        )}
        <button
          onClick={demarrerJeu}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          {gameOver ? "Recommencer" : "Démarrer"}
      </button>
      </div>
    </div>
  );
};

export default SnakeGame;
