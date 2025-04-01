import React, { useEffect, useRef, useState } from 'react';
import "./pong.css";

function PongGame() {
    // Game state
    const [scores, setScores] = useState({ player: 0, bot: 0, playerWins: 0, botWins: 0 });
    const [gameState, setGameState] = useState({
        started: false,
        ended: false,
        restartVisible: true,
        showPopup: false
    });
    const [settings, setSettings] = useState({
        targetScore: 5,
        timeLimit: 60,
        timeRemaining: 60,
        botDifficulty: 50
    });

    // DOM refs
    const refs = {
        leftPaddle: useRef(null),
        rightPaddle: useRef(null),
        ball: useRef(null),
        gameArea: useRef(null),
        gameInterval: useRef(null),
        timerInterval: useRef(null)
    };

    // Game variables
    const gameVars = {
        ballSpeedInitial: 4,
        ballSpeed: useRef(4),
        ballPos: useRef({ x: 290, y: 190 }),
        ballDir: useRef({ x: 1, y: 1 }),
        paddleSpeed: 28,
        leftPaddlePos: useRef(168),
        rightPaddlePos: useRef(168),
        botMistake: useRef(0)
    };

    // Update element positions
    const updatePositions = () => {
        const { ball, leftPaddle, rightPaddle } = refs;
        const { ballPos, leftPaddlePos, rightPaddlePos } = gameVars;

        if (ball.current) {
            ball.current.style.left = ballPos.current.x + "px";
            ball.current.style.top = ballPos.current.y + "px";
        }

        if (leftPaddle.current) {
            leftPaddle.current.style.top = leftPaddlePos.current + "px";
        }

        if (rightPaddle.current) {
            rightPaddle.current.style.top = rightPaddlePos.current + "px";
        }
    };

    // Reset game elements
    const resetElements = () => {
        const { ballPos, ballDir, ballSpeed, leftPaddlePos, rightPaddlePos } = gameVars;

        // Reset ball
        ballPos.current = { x: 290, y: 190 };
        ballDir.current = { x: 1, y: 1 };
        ballSpeed.current = gameVars.ballSpeedInitial;

        // Reset paddles
        leftPaddlePos.current = 168;
        rightPaddlePos.current = 168;

        updatePositions();
    };

    // Game control functions
    const startGame = () => {
        resetElements();
        setGameState(prev => ({
            ...prev,
            started: true,
            ended: false,
            restartVisible: false,
            showPopup: false
        }));
        setScores(prev => ({ ...prev, player: 0, bot: 0 }));
        setSettings(prev => ({ ...prev, timeRemaining: prev.timeLimit }));
        gameVars.botMistake.current = 0;

        refs.gameInterval.current = setInterval(updateGame, 20);
        refs.timerInterval.current = setInterval(() => {
            setSettings(prev => {
                if (prev.timeRemaining <= 1) {
                    endGameByTimeout();
                    return { ...prev, timeRemaining: 0 };
                }
                return { ...prev, timeRemaining: prev.timeRemaining - 1 };
            });
        }, 1000);
    };

    const stopGame = () => {
        [refs.gameInterval, refs.timerInterval].forEach(interval => {
            if (interval.current) {
                clearInterval(interval.current);
                interval.current = null;
            }
        });
    };

    const endGameByTimeout = () => {
        stopGame();

        const { player, bot } = scores;
        let message;

        if (player > bot) {
            setScores(prev => ({ ...prev, playerWins: prev.playerWins + 1 }));
            setGameState(prev => ({ ...prev, showPopup: true }));
            message = `Temps écoulé ! Vous avez gagné ! Score final: ${player}-${bot}`;
        } else if (bot > player) {
            setScores(prev => ({ ...prev, botWins: prev.botWins + 1 }));
            message = `Temps écoulé ! Vous avez perdu ! Score final: ${player}-${bot}`;
        } else {
            message = `Temps écoulé ! Match nul ! Score final: ${player}-${bot}`;
        }

        alert(message);
        setGameState(prev => ({ ...prev, ended: true, restartVisible: true }));
    };

    // Game mechanics
    const updateGame = () => {
        // Move ball
        const { ballPos, ballDir, ballSpeed } = gameVars;
        ballPos.current.x += ballSpeed.current * ballDir.current.x;
        ballPos.current.y += ballSpeed.current * ballDir.current.y;

        updatePositions();
        checkCollision();
        checkRoundEnd();
        updateBotPaddle();
    };

    const checkCollision = () => {
        const { ballPos, ballDir, ballSpeed, leftPaddlePos, rightPaddlePos } = gameVars;

        // Paddle collisions
        if (ballPos.current.x <= 30 &&
            ballPos.current.y + 10 >= leftPaddlePos.current &&
            ballPos.current.y <= leftPaddlePos.current + 64) {
            ballDir.current.x = 1;
            if (ballSpeed.current < 12) ballSpeed.current += 0.25;
        } else if (ballPos.current.x >= 560 &&
            ballPos.current.y + 10 >= rightPaddlePos.current &&
            ballPos.current.y <= rightPaddlePos.current + 64) {
            ballDir.current.x = -1;
            if (ballSpeed.current < 12) ballSpeed.current += 0.25;
        }

        // Wall collisions
        if (ballPos.current.y <= 0 || ballPos.current.y >= 380) {
            ballDir.current.y *= -1;
        }
    };

    const checkRoundEnd = () => {
        const { ballPos } = gameVars;
        const { player, bot } = scores;
        const { targetScore } = settings;

        if (ballPos.current.x <= 0) {
            const newBotScore = bot + 1;
            setScores(prev => ({ ...prev, bot: newBotScore }));

            if (newBotScore >= targetScore) {
                alert(`Vous avez perdu la partie ! Score final: ${player}-${newBotScore}`);
                setScores(prev => ({ ...prev, botWins: prev.botWins + 1 }));
                setGameState(prev => ({ ...prev, ended: true, restartVisible: true }));
                stopGame();
            } else {
                alert("Le bot a marqué un point !");
                stopGame();
                resetElements();
                setGameState(prev => ({ ...prev, restartVisible: true }));
            }
        } else if (ballPos.current.x >= 585) {
            const newPlayerScore = player + 1;
            setScores(prev => ({ ...prev, player: newPlayerScore }));

            if (newPlayerScore >= targetScore) {
                alert(`Vous avez gagné la partie ! Score final: ${newPlayerScore}-${bot}`);
                setScores(prev => ({ ...prev, playerWins: prev.playerWins + 1 }));
                setGameState(prev => ({ ...prev, ended: true, showPopup: true, restartVisible: true }));
                stopGame();
            } else {
                alert("Vous avez marqué un point !");
                stopGame();
                resetElements();
                setGameState(prev => ({ ...prev, restartVisible: true }));
            }
        }
    };

    const updateBotPaddle = () => {
        const { rightPaddlePos } = gameVars;
        const { ballPos, ballDir, ballSpeed } = gameVars;
        const { botDifficulty } = settings;

        // Calculate bot parameters based on difficulty
        const botPaddleSpeed = 8 + (12 * (botDifficulty / 100));
        const errorMargin = 30 * (1 - (botDifficulty / 100));
        const errorFrequency = 100 - botDifficulty;
        const shouldMakeMistake = Math.random() * 100 < errorFrequency;

        if (shouldMakeMistake) {
            // Make a mistake with random movement
            if (Math.random() < 0.5 && rightPaddlePos.current > 0) {
                rightPaddlePos.current -= botPaddleSpeed * (Math.random() * 0.7);
            } else if (rightPaddlePos.current + 64 < 336) {
                rightPaddlePos.current += botPaddleSpeed * (Math.random() * 0.7);
            }
        } else {
            // Intelligent movement
            const ballMovingTowardsBot = ballDir.current.x > 0;

            if (ballMovingTowardsBot) {
                // Calculate ball trajectory and anticipate
                const ballTrajectory = ballPos.current.y + (ballDir.current.y * (580 - ballPos.current.x) /
                    (ballSpeed.current * ballDir.current.x));
                const adjustedTrajectory = Math.min(Math.max(ballTrajectory, 0), 380);
                let targetY = adjustedTrajectory + (Math.random() * errorMargin * 2 - errorMargin) - 32;
                targetY = Math.min(Math.max(targetY, 0), 336);

                // Move paddle toward target
                const distanceToTarget = targetY - rightPaddlePos.current;
                const reactionSpeed = botPaddleSpeed * (0.5 + (botDifficulty / 200));

                if (Math.abs(distanceToTarget) > 5) {
                    rightPaddlePos.current += distanceToTarget > 0
                        ? Math.min(reactionSpeed, distanceToTarget)
                        : Math.max(-reactionSpeed, distanceToTarget);
                }
            } else {
                // Return to center when ball moving away
                const centerPosition = 168;
                const returnSpeed = botPaddleSpeed * 0.4 * (botDifficulty / 100);

                if (Math.abs(rightPaddlePos.current - centerPosition) > 20) {
                    rightPaddlePos.current += rightPaddlePos.current > centerPosition
                        ? -returnSpeed : returnSpeed;
                }
            }
        }

        // Keep paddle within bounds
        rightPaddlePos.current = Math.max(0, Math.min(rightPaddlePos.current, 336));
    };

    // Player controls
    const movePlayerPaddle = (direction) => {
        const { leftPaddlePos, paddleSpeed } = gameVars;
        if (direction === 'up' && leftPaddlePos.current > 0) {
            leftPaddlePos.current -= paddleSpeed;
        } else if (direction === 'down' && leftPaddlePos.current < 336) {
            leftPaddlePos.current += paddleSpeed;
        }
    };

    // Keyboard controls
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "ArrowDown") {
                event.preventDefault();
                movePlayerPaddle('down');
            } else if (event.key === "ArrowUp") {
                event.preventDefault();
                movePlayerPaddle('up');
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            stopGame();
        };
    }, []);

    // Set background color
    useEffect(() => {
        document.body.style.backgroundColor = 'rgb(67, 67, 67)';
        return () => { document.body.style.backgroundColor = ''; };
    }, []);

    // Settings handlers
    const handleSettingChange = (setting, value) => {
        if (!isNaN(value) && value > 0) {
            setSettings(prev => ({
                ...prev,
                [setting]: value,
                ...(setting === 'timeLimit' ? { timeRemaining: value } : {})
            }));
        }
    };

    // Format time as MM:SS
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Center line dots
    const centerDots = Array(15).fill().map((_, i) => <div key={i} className="center-dot"></div>);

    const { player, bot, playerWins, botWins } = scores;
    const { started, ended, restartVisible, showPopup } = gameState;
    const { targetScore, timeLimit, timeRemaining, botDifficulty } = settings;

    return (
        <div className="pong-game-container">
            <h1>Pong Challenge</h1>

            <div className="settings">
                <div className="setting-group">
                    <label htmlFor="target-score" className="setting-label">Score à atteindre:</label>
                    <input
                        id="target-score"
                        type="number"
                        min="1"
                        value={targetScore}
                        onChange={(e) => handleSettingChange('targetScore', parseInt(e.target.value, 10))}
                        className="setting-input" />
                </div>

                <div className="setting-group">
                    <label htmlFor="time-limit" className="setting-label">Temps (sec):</label>
                    <input
                        id="time-limit"
                        type="number"
                        min="10"
                        value={timeLimit}
                        onChange={(e) => handleSettingChange('timeLimit', parseInt(e.target.value, 10))}
                        className="setting-input" />
                </div>

                <div className="setting-group">
                    <label htmlFor="bot-difficulty" className="setting-label">Difficulté:</label>
                    <input
                        id="bot-difficulty"
                        type="range"
                        min="0"
                        max="100"
                        value={botDifficulty}
                        onChange={(e) => handleSettingChange('botDifficulty', parseInt(e.target.value, 10))}
                        className="difficulty-range" />
                    <span className="difficulty-value">{botDifficulty}%</span>
                </div>
            </div>

            <div className="timer">
                <div className="timer-icon"></div>
                {formatTime(timeRemaining)}
                <button
                    className="pong-restart-button"
                    onClick={!started || ended ? startGame : startGame} // Simplified logic
                >
                    {!started ? 'Jouer' : 'Continuer'}
                </button>
            </div>

            <div className="pong-game-area" ref={refs.gameArea}>
                <div className="controls-hint">Utilisez ↑↓ pour déplacer</div>
                <div className="center-line">{centerDots}</div>
                <div className="player-label">JOUEUR</div>
                <div className="bot-label">BOT</div>
                <div className="pong-paddle-left" ref={refs.leftPaddle}></div>
                <div className="pong-paddle-right" ref={refs.rightPaddle}></div>
                <div className="pong-ball" ref={refs.ball}></div>

            </div>

            <div className="pong-scoreboard">
                <div className="player-score">{player}</div>
                <span className="score-colon">:</span>
                <div className="bot-score">{bot}</div>
            </div>

            <p className="victory-message">Marquez 5 points pour atteindre la victoire !</p>


            <div className="stats-container">
                <div className="stat-box">
                    <div className="stat-label">Victoires</div>
                    <div className="stat-value">{playerWins}</div>
                </div>
                <div className="stat-box">
                    <div className="stat-label">Défaites</div>
                    <div className="stat-value">{botWins}</div>
                </div>
            </div>


            <div className={`popup ${showPopup ? 'show' : ''}`} onClick={() => setGameState(prev => ({ ...prev, showPopup: false }))}>
                <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                    <button className="popup-close" onClick={() => setGameState(prev => ({ ...prev, showPopup: false }))}>×</button>

                    <div className="popup-letter">R</div>
                    <div className="popup-message">Félicitations, vous avez gagné !</div>
                </div>
            </div>
        </div>
    );
}

export default PongGame;