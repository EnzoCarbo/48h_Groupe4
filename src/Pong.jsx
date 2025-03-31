import React, { useEffect, useRef, useState } from 'react';

const PongGame = () => {
    // State variables
    const [scorePlayer, setScorePlayer] = useState(0);
    const [scoreBot, setScoreBot] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);
    const [gameEnded, setGameEnded] = useState(false);
    const [restartVisible, setRestartVisible] = useState(true);

    // Refs for DOM elements
    const leftPaddleRef = useRef(null);
    const rightPaddleRef = useRef(null);
    const ballRef = useRef(null);
    const gameAreaRef = useRef(null);

    // Game variables
    const gameIntervalRef = useRef(null);
    const ballSpeedInitial = 4;
    const ballSpeedRef = useRef(ballSpeedInitial);
    const ballPosXRef = useRef(290);
    const ballPosYRef = useRef(190);
    const ballDirXRef = useRef(1);
    const ballDirYRef = useRef(1);

    const paddleSpeed = 28;
    const leftPaddlePosYRef = useRef(168);
    const rightPaddlePosYRef = useRef(168);

    // Function to start the game
    const startGame = () => {
        resetBall();
        resetPaddles();
        setRestartVisible(false);
        setGameStarted(true);
        setGameEnded(false);

        gameIntervalRef.current = setInterval(updateGame, 20);
    };

    // Function to reset the game
    const resetGame = () => {
        resetBall();
        resetPaddles();
        startGame();
    };

    // Function to reset ball position
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

    // Function to reset paddle positions
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

    // Function to update game state
    const updateGame = () => {
        moveBall();
        movePaddles();
        checkCollision();
        checkRoundEnd();
        updateBotPaddle();
    };

    // Function to move the ball
    const moveBall = () => {
        ballPosXRef.current += ballSpeedRef.current * ballDirXRef.current;
        ballPosYRef.current += ballSpeedRef.current * ballDirYRef.current;

        if (ballRef.current) {
            ballRef.current.style.left = ballPosXRef.current + "px";
            ballRef.current.style.top = ballPosYRef.current + "px";
        }
    };

    // Function to move paddles
    const movePaddles = () => {
        if (leftPaddleRef.current) {
            leftPaddleRef.current.style.top = leftPaddlePosYRef.current + "px";
        }

        if (rightPaddleRef.current) {
            rightPaddleRef.current.style.top = rightPaddlePosYRef.current + "px";
        }
    };

    // Function to check collisions
    const checkCollision = () => {
        // Collision with paddles
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

        // Collision with top and bottom walls
        if (ballPosYRef.current <= 0 || ballPosYRef.current >= 380) {
            ballDirYRef.current *= -1;
        }
    };

    // Function to increase ball speed
    const increaseBallSpeed = () => {
        if (ballSpeedRef.current < 12) {
            ballSpeedRef.current += 0.25;
        }
    };

    // Function to check round end
    const checkRoundEnd = () => {
        if (ballPosXRef.current <= 0) {
            setScoreBot(prev => prev + 1);
            alert("Le bot a marqué un point !");
            stopGame();
            resetBall();
            setRestartVisible(true);
        } else if (ballPosXRef.current >= 585) {
            setScorePlayer(prev => prev + 1);
            alert("Vous avez marqué un point !");
            stopGame();
            resetBall();
            setRestartVisible(true);
        }
    };

    // Function to update bot paddle
    const updateBotPaddle = () => {
        const botPaddleSpeed = 14;

        if (rightPaddlePosYRef.current + 32 > ballPosYRef.current + 35 && rightPaddlePosYRef.current > 0) {
            rightPaddlePosYRef.current -= botPaddleSpeed;
        } else if (rightPaddlePosYRef.current + 32 < ballPosYRef.current - 35 && rightPaddlePosYRef.current + 64 < 336) {
            rightPaddlePosYRef.current += botPaddleSpeed;
        }
    };

    // Function to stop the game
    const stopGame = () => {
        if (gameIntervalRef.current) {
            clearInterval(gameIntervalRef.current);
            gameIntervalRef.current = null;
        }
    };

    // Function to move paddle up
    const movePaddleUp = () => {
        if (leftPaddlePosYRef.current > 0) {
            leftPaddlePosYRef.current -= paddleSpeed;
        }
    };

    // Function to move paddle down
    const movePaddleDown = () => {
        if (leftPaddlePosYRef.current < 336) {
            leftPaddlePosYRef.current += paddleSpeed;
        }
    };

    // Handle keyboard events
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
                // Stop paddle movement (not needed in this implementation)
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

    // Styles
    const styles = {
        container: {
            width: '37.5rem',
            margin: '0 auto',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
        },
        gameArea: {
            top: 0,
            left: 0,
            width: '100%',
            height: '25rem',
            border: '1.5px solid #f5f5f5',
            backgroundColor: '#101010',
            position: 'relative',
        },
        paddleLeft: {
            position: 'absolute',
            width: '1.25rem',
            height: '4rem',
            backgroundColor: '#f5f5f5',
            transition: 'all 75ms linear',
            borderRadius: '0.75rem',
            top: '168px',
            left: '10px',
        },
        paddleRight: {
            position: 'absolute',
            width: '1.25rem',
            height: '4rem',
            backgroundColor: '#f5f5f5',
            transition: 'all 75ms linear',
            borderRadius: '0.75rem',
            top: '168px',
            right: '10px',
        },
        ball: {
            position: 'absolute',
            width: '1.25rem',
            height: '1.25rem',
            backgroundColor: '#fdd33c',
            borderRadius: '50%',
            top: '190px',
            left: '290px',
        },
        scoreboard: {
            textAlign: 'center',
            fontSize: '1.5rem',
            marginTop: '1.25rem',
        },
        restartButton: {
            padding: '0.625rem 1rem',
            fontSize: '1rem',
            backgroundColor: '#333',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            position: 'absolute',
            display: restartVisible ? 'block' : 'none',
        },
        mediaQuery: {
            '@media screen and (max-width: 992px)': {
                container: {
                    display: 'none',
                },
            },
        },
    };

    return (
        <div style={styles.container} className="pong-game-container">
            <div style={styles.gameArea} ref={gameAreaRef} className="pong-game-area">
                <div style={styles.paddleLeft} ref={leftPaddleRef} className="pong-paddle-left"></div>
                <div style={styles.paddleRight} ref={rightPaddleRef} className="pong-paddle-right"></div>
                <div style={styles.ball} ref={ballRef} className="pong-ball"></div>
            </div>
            <button
                style={styles.restartButton}
                onClick={!gameStarted || gameEnded ? startGame : resetGame}
                className="pong-restart-button"
            >
                Jouer
            </button>
            <div style={styles.scoreboard} className="pong-scoreboard">
                <span id="pong-player-score">{scorePlayer}</span> : <span id="pong-bot-score">{scoreBot}</span>
            </div>
        </div>
    );
};

export default PongGame;