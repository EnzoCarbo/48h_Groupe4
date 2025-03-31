import React, { useEffect, useRef, useState } from 'react';

const PongGame = () => {
    // State variables
    const [scorePlayer, setScorePlayer] = useState(0);
    const [scoreBot, setScoreBot] = useState(0);
    const [playerWins, setPlayerWins] = useState(0);
    const [botWins, setBotWins] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);
    const [gameEnded, setGameEnded] = useState(false);
    const [restartVisible, setRestartVisible] = useState(true);
    const [targetScore, setTargetScore] = useState(5);
    const [timeLimit, setTimeLimit] = useState(60);
    const [timeRemaining, setTimeRemaining] = useState(60);
    const [showPopup, setShowPopup] = useState(false);
    const [botDifficulty, setBotDifficulty] = useState(50);

    // Refs pour les éléments DOM
    const leftPaddleRef = useRef(null);
    const rightPaddleRef = useRef(null);
    const ballRef = useRef(null);
    const gameAreaRef = useRef(null);

    // Variables de jeu
    const gameIntervalRef = useRef(null);
    const timerIntervalRef = useRef(null);
    const ballSpeedInitial = 4;
    const ballSpeedRef = useRef(ballSpeedInitial);
    const ballPosXRef = useRef(290);
    const ballPosYRef = useRef(190);
    const ballDirXRef = useRef(1);
    const ballDirYRef = useRef(1);

    const paddleSpeed = 28;
    const leftPaddlePosYRef = useRef(168);
    const rightPaddlePosYRef = useRef(168);
    const botMistakeRef = useRef(0);

    // Fonction pour démarrer le jeu
    const startGame = () => {
        resetBall();
        resetPaddles();
        setRestartVisible(false);
        setGameStarted(true);
        setGameEnded(false);
        setScorePlayer(0);
        setScoreBot(0);
        setTimeRemaining(timeLimit);
        setShowPopup(false);
        botMistakeRef.current = 0;

        gameIntervalRef.current = setInterval(updateGame, 20);

        timerIntervalRef.current = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev <= 1) {
                    endGameByTimeout();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    // Fonction pour terminer le jeu par timeout
    const endGameByTimeout = () => {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;

        if (scorePlayer > scoreBot) {
            setPlayerWins(prev => prev + 1);
            setShowPopup(true);
            alert(`Temps écoulé ! Vous avez gagné ! Score final: ${scorePlayer}-${scoreBot}`);
        } else if (scoreBot > scorePlayer) {
            setBotWins(prev => prev + 1);
            alert(`Temps écoulé ! Vous avez perdu ! Score final: ${scorePlayer}-${scoreBot}`);
        } else {
            alert(`Temps écoulé ! Match nul ! Score final: ${scorePlayer}-${scoreBot}`);
        }

        setGameEnded(true);
        stopGame();
        setRestartVisible(true);
    };

    // Fonction pour réinitialiser le jeu
    const resetGame = () => {
        resetBall();
        resetPaddles();
        startGame();
    };

    // Fonction pour réinitialiser la position de la balle
    const resetBall = () => {
        ballPosXRef.current = 290;
        ballPosYRef.current = 190;
        ballDirXRef.current = 1;
        ballDirYRef.current = 1;
        ballSpeedRef.current = ballSpeedInitial;

        if (ballRef.current) {
            ballRef.current.style.left = ballPosXRef.current + "px";
            ballRef.current.style.top = ballPosYRef.current + "px";
        }
    };

    // Fonction pour réinitialiser les positions des raquettes
    const resetPaddles = () => {
        leftPaddlePosYRef.current = 168;
        rightPaddlePosYRef.current = 168;

        if (leftPaddleRef.current) {
            leftPaddleRef.current.style.top = leftPaddlePosYRef.current + "px";
        }

        if (rightPaddleRef.current) {
            rightPaddleRef.current.style.top = rightPaddlePosYRef.current + "px";
        }
    };

    // Fonction pour mettre à jour l'état du jeu
    const updateGame = () => {
        moveBall();
        movePaddles();
        checkCollision();
        checkRoundEnd();
        updateBotPaddle();
    };

    // Fonction pour déplacer la balle
    const moveBall = () => {
        ballPosXRef.current += ballSpeedRef.current * ballDirXRef.current;
        ballPosYRef.current += ballSpeedRef.current * ballDirYRef.current;

        if (ballRef.current) {
            ballRef.current.style.left = ballPosXRef.current + "px";
            ballRef.current.style.top = ballPosYRef.current + "px";
        }
    };

    // Fonction pour déplacer les raquettes
    const movePaddles = () => {
        if (leftPaddleRef.current) {
            leftPaddleRef.current.style.top = leftPaddlePosYRef.current + "px";
        }

        if (rightPaddleRef.current) {
            rightPaddleRef.current.style.top = rightPaddlePosYRef.current + "px";
        }
    };

    // Fonction pour vérifier les collisions
    const checkCollision = () => {
        // Collision avec les raquettes
        if (
            ballPosXRef.current <= 30 &&
            ballPosYRef.current + 10 >= leftPaddlePosYRef.current &&
            ballPosYRef.current <= leftPaddlePosYRef.current + 64
        ) {
            ballDirXRef.current = 1;
            increaseBallSpeed();
        } else if (
            ballPosXRef.current >= 560 &&
            ballPosYRef.current + 10 >= rightPaddlePosYRef.current &&
            ballPosYRef.current <= rightPaddlePosYRef.current + 64
        ) {
            ballDirXRef.current = -1;
            increaseBallSpeed();
        }

        // Collision avec les murs supérieur et inférieur
        if (ballPosYRef.current <= 0 || ballPosYRef.current >= 380) {
            ballDirYRef.current *= -1;
        }
    };

    // Fonction pour augmenter la vitesse de la balle
    const increaseBallSpeed = () => {
        if (ballSpeedRef.current < 12) {
            ballSpeedRef.current += 0.25;
        }
    };

    // Fonction pour vérifier la fin d'un round
    const checkRoundEnd = () => {
        if (ballPosXRef.current <= 0) {
            const newBotScore = scoreBot + 1;
            setScoreBot(newBotScore);

            if (newBotScore >= targetScore) {
                alert(`Vous avez perdu la partie ! Score final: ${scorePlayer}-${newBotScore}`);
                setBotWins(prev => prev + 1);
                setGameEnded(true);
                stopGame();
                setRestartVisible(true);
            } else {
                alert("Le bot a marqué un point !");
                stopGame();
                resetBall();
                setRestartVisible(true);
            }
        } else if (ballPosXRef.current >= 585) {
            const newPlayerScore = scorePlayer + 1;
            setScorePlayer(newPlayerScore);

            if (newPlayerScore >= targetScore) {
                alert(`Vous avez gagné la partie ! Score final: ${newPlayerScore}-${scoreBot}`);
                setPlayerWins(prev => prev + 1);
                setShowPopup(true);
                setGameEnded(true);
                stopGame();
                setRestartVisible(true);
            } else {
                alert("Vous avez marqué un point !");
                stopGame();
                resetBall();
                setRestartVisible(true);
            }
        }
    };

    // Fonction pour mettre à jour la raquette du bot (avec erreurs délibérées)
    const updateBotPaddle = () => {
        // Calculer la vitesse du bot en fonction de la difficulté
        const botPaddleSpeed = 14 * (botDifficulty / 100);

        // Augmenter le compteur d'erreurs
        botMistakeRef.current += 1;

        // Le bot fait des erreurs à intervalles réguliers (selon la difficulté)
        const errorThreshold = 101 - botDifficulty;
        const makeMistake = (botMistakeRef.current % errorThreshold < 20) || Math.random() < (1 - botDifficulty / 100) * 0.3;

        if (makeMistake) {
            // Le bot fait une erreur - mouvement aléatoire
            if (Math.random() < 0.5 && rightPaddlePosYRef.current > 0) {
                rightPaddlePosYRef.current -= botPaddleSpeed;
            } else if (rightPaddlePosYRef.current + 64 < 336) {
                rightPaddlePosYRef.current += botPaddleSpeed;
            }
        } else {
            // Le bot suit la balle normalement
            const targetY = ballPosYRef.current - 32;
            const reactionDelay = Math.random() * (100 - botDifficulty) / 100;
            const currentY = rightPaddlePosYRef.current;

            if (Math.abs(currentY - targetY) > 10) {
                if (currentY > targetY + 20 && rightPaddlePosYRef.current > 0) {
                    rightPaddlePosYRef.current -= botPaddleSpeed * (1 - reactionDelay);
                } else if (currentY < targetY - 20 && rightPaddlePosYRef.current + 64 < 336) {
                    rightPaddlePosYRef.current += botPaddleSpeed * (1 - reactionDelay);
                }
            }
        }
    };

    // Fonction pour arrêter le jeu
    const stopGame = () => {
        if (gameIntervalRef.current) {
            clearInterval(gameIntervalRef.current);
            gameIntervalRef.current = null;
        }

        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
        }
    };

    // Fonction pour déplacer la raquette vers le haut
    const movePaddleUp = () => {
        if (leftPaddlePosYRef.current > 0) {
            leftPaddlePosYRef.current -= paddleSpeed;
        }
    };

    // Fonction pour déplacer la raquette vers le bas
    const movePaddleDown = () => {
        if (leftPaddlePosYRef.current < 336) {
            leftPaddlePosYRef.current += paddleSpeed;
        }
    };

    // Gestion des événements clavier
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "ArrowDown") {
                event.preventDefault();
                movePaddleDown();
            } else if (event.key === "ArrowUp") {
                event.preventDefault();
                movePaddleUp();
            }
        };

        const handleKeyUp = (event) => {
            if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                event.preventDefault();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
            stopGame();
        };
    }, []);

    // Fonction pour gérer le changement de score cible
    const handleTargetScoreChange = (e) => {
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value) && value > 0) {
            setTargetScore(value);
        }
    };

    // Fonction pour gérer le changement de temps limite
    const handleTimeLimitChange = (e) => {
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value) && value > 0) {
            setTimeLimit(value);
            setTimeRemaining(value);
        }
    };

    // Fonction pour gérer le changement de difficulté du bot
    const handleBotDifficultyChange = (e) => {
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value) && value >= 0 && value <= 100) {
            setBotDifficulty(value);
        }
    };

    // Fonction pour fermer le popup
    const closePopup = () => {
        setShowPopup(false);
    };

    // Formatage du temps restant en MM:SS
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Styles améliorés with white background and softer text styles
    const styles = {
        container: {
            width: '37.5rem',
            margin: '2rem auto',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: '"Roboto", "Helvetica Neue", sans-serif',
            color: '#555',
            background: '#ffffff',
            padding: '2rem',
            borderRadius: '1rem',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.07)',
        },
        gameArea: {
            width: '100%',
            height: '25rem',
            border: 'none',
            backgroundColor: '#2c3e50',
            position: 'relative',
            borderRadius: '0.5rem',
            overflow: 'hidden',
            boxShadow: 'inset 0 0 50px rgba(0, 0, 0, 0.3)',
            margin: '1.5rem 0',
        },
        paddleLeft: {
            position: 'absolute',
            width: '1rem',
            height: '4rem',
            backgroundColor: '#3498db',
            transition: 'all 75ms linear',
            borderRadius: '0.5rem',
            top: '168px',
            left: '10px',
            boxShadow: '0 0 10px #3498db',
        },
        paddleRight: {
            position: 'absolute',
            width: '1rem',
            height: '4rem',
            backgroundColor: '#e74c3c',
            transition: 'all 75ms linear',
            borderRadius: '0.5rem',
            top: '168px',
            right: '10px',
            boxShadow: '0 0 10px #e74c3c',
        },
        ball: {
            position: 'absolute',
            width: '1rem',
            height: '1rem',
            backgroundColor: '#f1c40f',
            borderRadius: '50%',
            top: '190px',
            left: '290px',
            boxShadow: '0 0 15px rgba(241, 196, 15, 0.6)',
        },
        scoreboard: {
            textAlign: 'center',
            fontSize: '2.25rem',
            marginTop: '1rem',
            fontWeight: '600',
            color: '#555',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1.5rem',
        },
        scoreValue: {
            display: 'inline-block',
            width: '3rem',
            height: '3.5rem',
            backgroundColor: '#2c3e50',
            color: '#fff',
            padding: '0.5rem',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
        },
        scoreColon: {
            fontSize: '2rem',
            fontWeight: '500',
            color: '#555',
        },
        restartButton: {
            padding: '0.75rem 2rem',
            fontSize: '1.1rem',
            backgroundColor: '#3498db',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '2rem',
            fontWeight: '500',
            display: restartVisible ? 'block' : 'none',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
        },
        statsContainer: {
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            marginTop: '1.5rem',
            padding: '1rem 1.5rem',
            backgroundColor: 'rgba(240, 240, 240, 0.5)',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.03)',
        },
        statBox: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '0.5rem 1rem',
            backgroundColor: '#fff',
            borderRadius: '0.5rem',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
        },
        statLabel: {
            fontSize: '0.9rem',
            color: '#777',
            marginBottom: '0.25rem',
        },
        statValue: {
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#2c3e50',
        },
        settings: {
            marginTop: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
            width: '100%',
            backgroundColor: 'rgba(240, 240, 240, 0.5)',
            borderRadius: '0.5rem',
            padding: '1rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.03)',
        },
        settingGroup: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
        },
        settingLabel: {
            fontSize: '0.9rem',
            color: '#666',
            fontWeight: '400',
        },
        settingInput: {
            width: '3.5rem',
            padding: '0.4rem',
            fontSize: '0.9rem',
            textAlign: 'center',
            border: '1px solid #ddd',
            borderRadius: '0.25rem',
            backgroundColor: '#fff',
        },
        difficultyRange: {
            width: '8rem',
            accentColor: '#3498db',
        },
        difficultyValue: {
            backgroundColor: '#3498db',
            color: '#fff',
            padding: '0.2rem 0.5rem',
            borderRadius: '1rem',
            fontSize: '0.8rem',
            fontWeight: '500',
            minWidth: '2.5rem',
            textAlign: 'center',
        },
        timer: {
            fontSize: '1.25rem',
            marginTop: '1rem',
            color: timeRemaining < 10 ? '#e74c3c' : '#2c3e50',
            fontWeight: timeRemaining < 10 ? '600' : '400',
            padding: '0.5rem 1.5rem',
            backgroundColor: '#fff',
            borderRadius: '2rem',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.06)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
        },
        timerIcon: {
            display: 'inline-block',
            width: '0.75rem',
            height: '0.75rem',
            backgroundColor: timeRemaining < 10 ? '#e74c3c' : '#2c3e50',
            borderRadius: '50%',
            animation: timeRemaining < 10 ? 'pulsate 1s infinite' : 'none',
        },
        popup: {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: showPopup ? 'flex' : 'none',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(3px)',
        },
        popupContent: {
            backgroundColor: '#fff',
            padding: '3rem',
            borderRadius: '1rem',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 15px 50px rgba(0, 0, 0, 0.2)',
            transform: 'scale(1)',
            animation: 'popup-appear 0.3s ease-out',
        },
        popupLetter: {
            fontSize: '8rem',
            fontWeight: '600',
            color: '#e74c3c',
            marginBottom: '1rem',
            textShadow: '0 0 20px rgba(231, 76, 60, 0.4)',
        },
        popupMessage: {
            fontSize: '1.5rem',
            color: '#555',
            marginBottom: '1.5rem',
            fontWeight: '400',
        },
        popupClose: {
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            fontSize: '1.5rem',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: '#777',
            transition: 'color 0.2s ease',
        },
        '@keyframes pulsate': {
            '0%': { opacity: 0.6 },
            '50%': { opacity: 1 },
            '100%': { opacity: 0.6 }
        },
        '@keyframes popup-appear': {
            '0%': { opacity: 0, transform: 'scale(0.8)' },
            '100%': { opacity: 1, transform: 'scale(1)' }
        },
        centerLine: {
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            height: '100%',
            width: '2px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
        },
        centerDot: {
            width: '6px',
            height: '6px',
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            borderRadius: '50%',
            marginLeft: '-2px',
        },
        controlsHint: {
            position: 'absolute',
            top: '10px',
            left: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            padding: '5px 10px',
            borderRadius: '4px',
            fontSize: '0.8rem',
            color: 'rgba(255, 255, 255, 0.6)',
        },
        playerLabel: {
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            color: '#3498db',
            fontSize: '0.9rem',
            fontWeight: '500',
        },
        botLabel: {
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            color: '#e74c3c',
            fontSize: '0.9rem',
            fontWeight: '500',
        }
    };

    // Add a style for the document body
    useEffect(() => {
        // Set the background color of the body to white
        document.body.style.backgroundColor = '#ffffff';

        // Cleanup function to reset body style when component unmounts
        return () => {
            document.body.style.backgroundColor = '';
        };
    }, []);

    // Création des points de la ligne centrale
    const centerDots = [];
    for (let i = 0; i < 15; i++) {
        centerDots.push(<div key={i} style={styles.centerDot}></div>);
    }

    return (
        <div style={styles.container} className="pong-game-container">
            <h1 style={{ fontSize: '2rem', margin: '0 0 1.5rem', color: '#2c3e50', textAlign: 'center', fontWeight: '500' }}>
                Pong Challenge
            </h1>

            <div style={styles.settings}>
                <div style={styles.settingGroup}>
                    <label htmlFor="target-score" style={styles.settingLabel}>Score à atteindre:</label>
                    <input
                        id="target-score"
                        type="number"
                        min="1"
                        value={targetScore}
                        onChange={handleTargetScoreChange}
                        style={styles.settingInput}
                    />
                </div>

                <div style={styles.settingGroup}>
                    <label htmlFor="time-limit" style={styles.settingLabel}>Temps (sec):</label>
                    <input
                        id="time-limit"
                        type="number"
                        min="10"
                        value={timeLimit}
                        onChange={handleTimeLimitChange}
                        style={styles.settingInput}
                    />
                </div>

                <div style={styles.settingGroup}>
                    <label htmlFor="bot-difficulty" style={styles.settingLabel}>Difficulté:</label>
                    <input
                        id="bot-difficulty"
                        type="range"
                        min="0"
                        max="100"
                        value={botDifficulty}
                        onChange={handleBotDifficultyChange}
                        style={styles.difficultyRange}
                    />
                    <span style={styles.difficultyValue}>{botDifficulty}%</span>
                </div>
            </div>

            <div style={styles.timer}>
                <div style={styles.timerIcon}></div>
                {formatTime(timeRemaining)}
            </div>

            <div style={styles.gameArea} ref={gameAreaRef} className="pong-game-area">
                <div style={styles.controlsHint}>Utilisez ↑↓ pour déplacer</div>
                <div style={styles.centerLine}>
                    {centerDots}
                </div>
                <div style={styles.playerLabel}>JOUEUR</div>
                <div style={styles.botLabel}>BOT</div>
                <div style={styles.paddleLeft} ref={leftPaddleRef} className="pong-paddle-left"></div>
                <div style={styles.paddleRight} ref={rightPaddleRef} className="pong-paddle-right"></div>
                <div style={styles.ball} ref={ballRef} className="pong-ball"></div>
                <button
                    style={styles.restartButton}
                    onClick={!gameStarted || gameEnded ? startGame : resetGame}
                    className="pong-restart-button"
                >
                    {!gameStarted ? 'Jouer' : 'Continuer'}
                </button>
            </div>

            <div style={styles.scoreboard} className="pong-scoreboard">
                <div style={{ ...styles.scoreValue, backgroundColor: '#3498db', boxShadow: '0 0 10px rgba(52, 152, 219, 0.3)' }} id="pong-player-score">{scorePlayer}</div>
                <span style={styles.scoreColon}>:</span>
                <div style={{ ...styles.scoreValue, backgroundColor: '#e74c3c', boxShadow: '0 0 10px rgba(231, 76, 60, 0.3)' }} id="pong-bot-score">{scoreBot}</div>
            </div>

            <div style={styles.statsContainer}>
                <div style={styles.statBox}>
                    <div style={styles.statLabel}>Victoires</div>
                    <div style={styles.statValue} id="player-wins">{playerWins}</div>
                </div>
                <div style={styles.statBox}>
                    <div style={styles.statLabel}>Défaites</div>
                    <div style={styles.statValue} id="bot-wins">{botWins}</div>
                </div>
            </div>

            {/* Popup avec la lettre R qui apparaît lorsque le joueur gagne */}
            <div style={styles.popup} onClick={closePopup}>
                <div style={styles.popupContent} onClick={(e) => e.stopPropagation()}>
                    <button style={styles.popupClose} onClick={closePopup}>×</button>
                    <div style={styles.popupLetter}>R</div>
                    <div style={styles.popupMessage}>Félicitations, vous avez gagné !</div>
                </div>
            </div>
        </div>
    );
};

export default PongGame;