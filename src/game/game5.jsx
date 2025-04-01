import React, { useState, useEffect, useRef } from 'react';

const TapeTaupe = () => {
  // États du jeu
  const [jeuActif, setJeuActif] = useState(false);
  const [taupesActives, setTaupesActives] = useState([]); // Index des taupes actives
  const [animationFinActive, setAnimationFinActive] = useState(false);
  const [enAnimationFin, setEnAnimationFin] = useState(false);
  const [victoire, setVictoire] = useState(false); // État de victoire
  const [animationRougeActive, setAnimationRougeActive] = useState(false); // Animation rouge (échec)
  const [animationVerteActive, setAnimationVerteActive] = useState(false); // Animation verte (succès)
  const [dureeJeu, setDureeJeu] = useState(15); // Durée du jeu en secondes
  const [tempsRestant, setTempsRestant] = useState(dureeJeu);

  // Références
  const minuteurJeuRef = useRef(null);
  const timeoutTaupeRef = useRef(null);
  const generationTaupesRef = useRef(null);
  const intervalleTaupesRef = useRef(1500); // Intervalle initial entre l'apparition des taupes
  const trousRef = useRef([...Array(16)].map(() => React.createRef())); // Références aux trous

  /**
   * Déclenche l'animation rouge (échec)
   */
  const declencherAnimationRouge = () => {
    setAnimationRougeActive(true);
    setTimeout(() => setAnimationRougeActive(false), 200);
    console.log("Animation rouge déclenchée !");
  };

  /**
   * Déclenche l'animation verte (succès)
   */
  const declencherAnimationVerte = () => {
    setAnimationVerteActive(true);
    setTimeout(() => setAnimationVerteActive(false), 500);
    console.log("Animation verte déclenchée !");
  };

  /**
   * Termine le jeu (échec)
   * @param {string} raison - La raison de la fin du jeu
   */
  const jeuPerdu = (raison) => {
    if (!jeuActif) return;
    
    console.log("Échec: " + raison);
    declencherAnimationRouge();
    
    clearInterval(minuteurJeuRef.current);
    clearTimeout(generationTaupesRef.current);
    
    setJeuActif(false);
    setTaupesActives([]);
    setTempsRestant(dureeJeu);
  };
  
  /**
   * Termine le jeu avec victoire
   */
  const gagnerJeu = () => {
    declencherAnimationVerte();
    console.log("[AVANT] Je suis gagnerJeu, victoire: " + victoire);
    
    setVictoire(true);
    
    clearInterval(minuteurJeuRef.current);
    clearTimeout(generationTaupesRef.current);
    
    setJeuActif(false);
    setTaupesActives([]);
    setTempsRestant(dureeJeu);
  };

  /**
   * Gère le clic sur une taupe
   * @param {number} index - L'index de la taupe cliquée
   */
  const gererClicTaupe = (index) => {
    if (!jeuActif) return;
    if (taupesActives.includes(index)) {
      // Taupe valide cliquée
      setTaupesActives(prev => prev.filter(i => i !== index));
      
      // Réinitialiser le timeout de fin de jeu
      clearTimeout(timeoutTaupeRef.current);
      timeoutTaupeRef.current = setTimeout(() => {
        jeuPerdu("Trop lent");
      }, 3000);
      
      // Accélérer le jeu
      intervalleTaupesRef.current -= 50;
      if (intervalleTaupesRef.current < 500) {
        intervalleTaupesRef.current = 500;
      }
    } else {
      // Mauvaise taupe cliquée
      jeuPerdu("Il faut améliorer ta précision !");
      if (timeoutTaupeRef.current) {
        clearTimeout(timeoutTaupeRef.current);
      }
    }
  };

  /**
   * Génère une nouvelle taupe aléatoirement
   */
  const genererTaupe = () => {
    if (!jeuActif) return;

    // Limite à 2 taupes actives simultanément
    if (taupesActives.length < 2) {
      let tentatives = 0;
      let indexAleatoire;

      // Trouver un index non utilisé
      do {
        indexAleatoire = Math.floor(Math.random() * 16);
        tentatives++;
      } while (taupesActives.includes(indexAleatoire) && tentatives < 10);

      if (!taupesActives.includes(indexAleatoire)) {
        setTaupesActives(prev => [...prev, indexAleatoire]);
      }
    }

    // Planifier la prochaine génération
    const timeoutId = setTimeout(genererTaupe, intervalleTaupesRef.current);
    generationTaupesRef.current = timeoutId;
  };

  /**
   * Lance une nouvelle partie
   */
  const demarrerJeu = () => {
    // Réinitialisation des états
    setTempsRestant(dureeJeu);
    setVictoire(false);
    setJeuActif(true);
    setTaupesActives([]);
    intervalleTaupesRef.current = 1500;
    
    // Minuteur principal
    minuteurJeuRef.current = setInterval(() => {
      setTempsRestant(prevTimer => {
        if (prevTimer <= 1) {
          clearInterval(minuteurJeuRef.current);
          gagnerJeu();
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);
    
    // Timeout de fin de jeu si inaction
    timeoutTaupeRef.current = setTimeout(() => {
      if (jeuActif && !victoire) {
        jeuPerdu("Trop lent");
      }
    }, 3000);
  };

  // Effet pour générer des taupes quand le jeu est actif
  useEffect(() => {
    if (jeuActif) {
      genererTaupe();
    }
  }, [jeuActif]);

  // Nettoyage des timeouts/intervales
  useEffect(() => {
    return () => {
      clearInterval(minuteurJeuRef.current);
      clearTimeout(timeoutTaupeRef.current);
      clearTimeout(generationTaupesRef.current);
    };
  }, []);

  // Calcul du pourcentage de progression
  const pourcentageProgression = jeuActif ? (tempsRestant / dureeJeu) * 100 : 100;
  

  return (
    <div
      className="relative flex flex-col items-center justify-center w-full mx-auto"
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100vh',
        overflow: 'hidden'
      }}
    >
      
      {/* Barre de progression */}
      <div
        style={{
          width: '25%',
          height: '0.5rem',
          backgroundColor: 'transparent',
          border: '1px solid #4caf50',
          borderRadius: '0.25rem',
          marginBottom: '1rem',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${pourcentageProgression}%`,
            backgroundColor: '#4caf50',
            borderRadius: '0.25rem',
            transition: 'width 1s linear',
          }}
        />
      </div>

      {/* Grille de jeu */}
      <div 
        style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 5rem)',
          gridTemplateRows: 'repeat(4, 5rem)',
          gap: '0.25rem',
          backgroundColor: 'transparent',
        }}>
        {[...Array(16)].map((_, index) => (
        <div
          key={index}
          ref={trousRef.current[index]}
          style={{ 
            width: '5rem', 
            height: '5rem', 
            borderRadius: '50%',
            backgroundColor: 
              animationRougeActive ? '#FF0000' :
              animationVerteActive ? '#00FF00' :
              taupesActives.includes(index) ? '#FFFFFF' : '#fdd33c',
            transition: 'background-color 0.3s ease',
            cursor: 'pointer'
          }}
          onClick={() => jeuActif && gererClicTaupe(index)}
        />
        ))}
      </div>
      
      {/* Bouton de jeu */}
      {!jeuActif && (
        <div style={{ marginTop: '2rem' }}>
          {victoire ? (
            <div style={{
              color: 'white',
              fontSize: '1.5rem',
              textAlign: 'center'
            }}>
              La dernière lettre est S !
            </div>
          ) : (
            <button
              style={{
                fontSize: '1rem',
                padding: '0.5rem 1.5rem',
                backgroundColor: '#333',
                color: 'white',
                border: 'none',
                borderRadius: '0.25rem',
                cursor: 'pointer'
              }}
              onClick={demarrerJeu}
            >
              Jouer
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TapeTaupe;