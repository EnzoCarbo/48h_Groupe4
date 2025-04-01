import React, { useState, useEffect } from "react";
import "../style/TicTacToe.css";

const TicTacToe = () => {
  const [board, setBoard] = useState([
    ["", "", ""],
    ["", "", ""],
    ["", "", ""]
  ]);
  const [playerTurn, setPlayerTurn] = useState(true);
  const [scores, setScores] = useState({ player: 0, bot: 0, draw: 0 });

  useEffect(() => {
    if (!playerTurn) {
      setTimeout(() => handleBotMove(), 500);
    }
  }, [playerTurn]);

  useEffect(() => {
    if (scores.player === 5) {
      alert("Félicitations ! Vous avez atteint 5 victoires 🎉\nVoici votre lettre : S");
    }
  }, [scores.player]);

  const handlePlayerMove = (row, col) => {
    if (board[row][col] !== "" || !playerTurn) return;

    const newBoard = board.map((r, i) => r.map((cell, j) => (i === row && j === col ? "X" : cell)));
    setBoard(newBoard);

    if (checkWinner(newBoard, "X")) {
      setTimeout(() => alert("Tu as gagné !"), 100);
      setScores(prev => ({ ...prev, player: prev.player + 1 }));
      resetGame();
    } else if (checkDraw(newBoard)) {
      setTimeout(() => alert("Match nul !"), 100);
      setScores(prev => ({ ...prev, draw: prev.draw + 1 }));
      resetGame();
    } else {
      setPlayerTurn(false);
    }
  };

  const handleBotMove = () => {
    // 30% de chance que le bot joue un coup aléatoire
    if (Math.random() < 0.3) {
      const emptyCells = [];
      board.forEach((row, i) => {
        row.forEach((cell, j) => {
          if (cell === "") emptyCells.push({ row: i, col: j });
        });
      });

      if (emptyCells.length > 0) {
        const randomMove = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        const { row, col } = randomMove;
        const newBoard = board.map((r, i) =>
          r.map((cell, j) => (i === row && j === col ? "O" : cell))
        );
        setBoard(newBoard);

        if (checkWinner(newBoard, "O")) {
          setTimeout(() => alert("Le bot a gagné !"), 100);
          setScores((prev) => ({ ...prev, bot: prev.bot + 1 }));
          resetGame();
        } else if (checkDraw(newBoard)) {
          setTimeout(() => alert("Match nul !"), 100);
          setScores((prev) => ({ ...prev, draw: prev.draw + 1 }));
          resetGame();
        } else {
          setPlayerTurn(true);
        }
        return;
      }
    }

    // Sinon, le bot joue de manière optimale avec Minimax
    let bestScore = -Infinity;
    let bestMove;

    board.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell === "") {
          let tempBoard = board.map((row) => [...row]);
          tempBoard[i][j] = "O";
          let score = minimax(tempBoard, 0, false, -Infinity, Infinity);
          if (score > bestScore) {
            bestScore = score;
            bestMove = { row: i, col: j };
          }
        }
      });
    });

    if (!bestMove) return;
    const { row, col } = bestMove;
    const newBoard = board.map((r, i) =>
      r.map((cell, j) => (i === row && j === col ? "O" : cell))
    );
    setBoard(newBoard);

    if (checkWinner(newBoard, "O")) {
      setTimeout(() => alert("Le bot a gagné !"), 100);
      setScores((prev) => ({ ...prev, bot: prev.bot + 1 }));
      resetGame();
    } else if (checkDraw(newBoard)) {
      setTimeout(() => alert("Match nul !"), 100);
      setScores((prev) => ({ ...prev, draw: prev.draw + 1 }));
      resetGame();
    } else {
      setPlayerTurn(true);
    }
  };

  const minimax = (board, depth, isMax, alpha, beta) => {
    if (checkWinner(board, "O")) return 10 - depth;
    if (checkWinner(board, "X")) return depth - 10;
    if (checkDraw(board)) return 0;

    if (isMax) {
      let bestScore = -Infinity;
      board.forEach((row, i) => {
        row.forEach((cell, j) => {
          if (cell === "") {
            board[i][j] = "O";
            let score = minimax(board, depth + 1, false, alpha, beta);
            board[i][j] = "";
            bestScore = Math.max(score, bestScore);
            alpha = Math.max(alpha, bestScore);
            if (beta <= alpha) return;
          }
        });
      });
      return bestScore;
    } else {
      let bestScore = Infinity;
      board.forEach((row, i) => {
        row.forEach((cell, j) => {
          if (cell === "") {
            board[i][j] = "X";
            let score = minimax(board, depth + 1, true, alpha, beta);
            board[i][j] = "";
            bestScore = Math.min(score, bestScore);
            beta = Math.min(beta, bestScore);
            if (beta <= alpha) return;
          }
        });
      });
      return bestScore;
    }
  };

  const checkWinner = (board, symbol) => {
    for (let i = 0; i < 3; i++) {
      if (board[i].every(cell => cell === symbol)) return true;
      if (board.every(row => row[i] === symbol)) return true;
    }
    if (board[0][0] === symbol && board[1][1] === symbol && board[2][2] === symbol) return true;
    if (board[0][2] === symbol && board[1][1] === symbol && board[2][0] === symbol) return true;
    return false;
  };

  const checkDraw = (board) => board.flat().every(cell => cell !== "");

  const resetGame = () => {
    setBoard([
      ["", "", ""],
      ["", "", ""],
      ["", "", ""]
    ]);
    setPlayerTurn(true);
  };

  return (
    <div id="tictactoeContainer">
      <table>
        <tbody>
          {board.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td
                  key={j}
                  onClick={() => handlePlayerMove(i, j)}
                  className={cell === "X" ? "player-symbol" : cell === "O" ? "bot-symbol" : ""}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div id="tictactoe-scoreboard">
        <span>Joueur : {scores.player}</span>
        <span>Matchs nuls : {scores.draw}</span>
        <span>Bot : {scores.bot}</span>
      </div>
      <p className="victory-message">Marquez 5 points pour atteindre la victoire !</p>
    </div>
  );
};

export default TicTacToe;