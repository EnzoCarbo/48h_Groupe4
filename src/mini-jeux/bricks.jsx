import React, { useEffect, useRef, useState } from 'react';

const BreakoutGame = () => {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const intervalIdRef = useRef(null);
  const contextRef = useRef(null);
  const leftPressedRef = useRef(false);
  const rightPressedRef = useRef(false);
  const ballSpeedRef = useRef(0.7);
  const gameWonRef = useRef(false);
  const checkCollisionRef = useRef(true);

  // Game constants
  const BRICK_ROW_COUNT = 3;
  const BRICK_COLUMN_COUNT = 5;
  const BRICK_WIDTH = 80;
  const BRICK_HEIGHT = 20;
  const BRICK_PADDING = 10;
  const BRICK_OFFSET_TOP = 30;

  // Game objects
  const ballRef = useRef({ x: 0, y: 0, dx: 2, dy: -2, radius: 10 });
  const paddleRef = useRef({ x: 0, y: 0, width: 80, height: 10 });
  const bricksRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    contextRef.current = canvas.getContext('2d');
    
    // Setup event listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    
    // Cleanup event listeners
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, []);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    contextRef.current.clearRect(0, 0, canvas.width, canvas.height);
  };

  const resetBall = () => {
    const canvas = canvasRef.current;
    ballRef.current = {
      x: canvas.width / 2,
      y: canvas.height - 180,
      dx: 2,
      dy: 2,
      radius: 10
    };
  };

  const resetPaddle = () => {
    const canvas = canvasRef.current;
    paddleRef.current = {
      x: canvas.width / 2,
      y: canvas.height - 10,
      width: 80,
      height: 10
    };
  };

  const resetBricks = () => {
    const canvas = canvasRef.current;
    const brickOffsetLeft = (canvas.width - (BRICK_COLUMN_COUNT * (BRICK_WIDTH + BRICK_PADDING))) / 2;
    
    const bricks = [];
    for (let c = 0; c < BRICK_COLUMN_COUNT; c++) {
      bricks[c] = [];
      for (let r = 0; r < BRICK_ROW_COUNT; r++) {
        const brickX = c * (BRICK_WIDTH + BRICK_PADDING) + brickOffsetLeft;
        const brickY = r * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_OFFSET_TOP;
        bricks[c][r] = { x: brickX, y: brickY, status: 1 };
      }
    }
    bricksRef.current = bricks;
  };

  const drawBricks = () => {
    const ctx = contextRef.current;
    for (let c = 0; c < BRICK_COLUMN_COUNT; c++) {
      for (let r = 0; r < BRICK_ROW_COUNT; r++) {
        const brick = bricksRef.current[c][r];
        if (brick && brick.status === 1) {
          ctx.fillStyle = "#f5f5f5";
          ctx.fillRect(brick.x, brick.y, BRICK_WIDTH, BRICK_HEIGHT);
        }
      }
    }
  };

  const drawBall = () => {
    const ctx = contextRef.current;
    const ball = ballRef.current;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#fdd33c";
    ctx.fill();
    ctx.closePath();
  };

  const drawPaddle = () => {
    const ctx = contextRef.current;
    const paddle = paddleRef.current;
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.fillStyle = "#f5f5f5";
    ctx.fill();
    ctx.closePath();
  };

  const moveBall = () => {
    const ball = ballRef.current;
    ball.x += ball.dx * ballSpeedRef.current;
    ball.y += ball.dy * ballSpeedRef.current;
  };

  const movePaddle = () => {
    const canvas = canvasRef.current;
    const paddle = paddleRef.current;
    
    if (leftPressedRef.current && paddle.x > 0) {
      paddle.x -= 6;
    } else if (rightPressedRef.current && paddle.x + paddle.width < canvas.width) {
      paddle.x += 6;
    }
  };

  const checkCollision = () => {
    if (!checkCollisionRef.current) {
      return;
    }
    
    const canvas = canvasRef.current;
    const ball = ballRef.current;
    const paddle = paddleRef.current;
    
    // Wall collisions
    if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
      ball.dx = -ball.dx;
    }
    
    if (ball.y + ball.dy < ball.radius) {
      ball.dy = -ball.dy;
    }
    
    // Paddle collision
    if (ball.y + ball.dy > canvas.height - ball.radius - paddle.height + 10) {
      if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
        const paddleCenter = paddle.x + paddle.width / 2;
        const ballOffsetFromCenter = ball.x - paddleCenter;
        ball.dy = -ball.dy;
        ball.dx = ballOffsetFromCenter / (paddle.width / 2);
      } else {
        setGameOver(true);
        clearInterval(intervalIdRef.current);
        if (score > bestScore) {
          setBestScore(score);
        }
        alert(`Partie terminée ! Score: ${score}`);
        setScore(0);
        resetPaddle();
        resetBricks();
      }
    }
    
    // Brick collision
    let allBricksDestroyed = true;
    for (let c = 0; c < BRICK_COLUMN_COUNT; c++) {
      for (let r = 0; r < BRICK_ROW_COUNT; r++) {
        const brick = bricksRef.current[c][r];
        if (brick && brick.status === 1) {
          allBricksDestroyed = false;
          if (
            ball.x > brick.x &&
            ball.x < brick.x + BRICK_WIDTH &&
            ball.y > brick.y &&
            ball.y < brick.y + BRICK_HEIGHT
          ) {
            ball.dy = -ball.dy;
            brick.status = 0;
            setScore(prevScore => {
              const newScore = prevScore + 1;
              ballSpeedRef.current += 0.15;
              return newScore;
            });
          }
        }
      }
    }
    
    if (allBricksDestroyed) {
      gameWonRef.current = true;
      checkCollisionRef.current = false;
      clearInterval(intervalIdRef.current);
      alert(`Bravo, vous avez gagné ! Score: ${score}`);
      setBestScore(Math.max(bestScore, 15));
      setScore(0);
      resetPaddle();
      resetBricks();
      setGameStarted(false);
    }
  };

  const updateGame = () => {
    clearCanvas();
    drawBricks();
    drawBall();
    drawPaddle();
    moveBall();
    movePaddle();
    checkCollision();
  };

  const restartGame = () => {
    resetBall();
    resetPaddle();
    resetBricks();
    setScore(0);
    setGameStarted(true);
    setGameOver(false);
    gameWonRef.current = false;
    checkCollisionRef.current = true;
    ballSpeedRef.current = 0.7;
    
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
    }
    intervalIdRef.current = setInterval(updateGame, 10);
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowLeft") {
      leftPressedRef.current = true;
    } else if (event.key === "ArrowRight") {
      rightPressedRef.current = true;
    }
  };

  const handleKeyUp = (event) => {
    if (event.key === "ArrowLeft") {
      leftPressedRef.current = false;
    } else if (event.key === "ArrowRight") {
      rightPressedRef.current = false;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center relative w-96 mx-auto" style={{background:"rgb(67, 67, 67)"}}>
      <canvas 
        ref={canvasRef} 
        width={500} 
        height={500} 
        className="border border-solid border-yellow-300 bg-gray-900"
      />
      <div className="flex justify-between w-full mt-4">
        <div className="text-base">Score : {score}</div>
        <div className="text-base text-gray-500">Meilleur Score : {bestScore}</div>
      </div>
      <button 
        onClick={restartGame}
        className="text-base py-2.5 px-4 bg-gray-800 text-white border-none cursor-pointer absolute hover:bg-gray-600" style={{ marginTop:"1%"}}
      >
        {gameStarted && !gameOver ? "Redémarrer" : "Jouer"}
      </button>
    </div>
  );
};

export default BreakoutGame;