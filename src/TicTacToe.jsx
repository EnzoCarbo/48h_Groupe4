import React, { useState, useEffect } from "react";
import "./TicTacToe.css";

const TicTacToe = () => {
  const [board, setBoard] = useState([
    ["", "", ""],
    ["", "", ""],
    ["", "", ""]
  ]);
  const [playerTurn, setPlayerTurn] = useState(true);
  const [scores, setScores] = useState({ player: 0, bot: 0, draw: 0 });
  const [showS, setShowS] = useState(false); // État pour afficher la lettre "S"

  useEffect(() => {
    if (!playerTurn) {
      setTimeout(() => handleBotMove(), 500);
    }
  }, [playerTurn]);

  useEffect(() => {
    if (scores.player === 5) {
      setShowS(true); // Afficher "S" si le joueur atteint 5 victoires
    }
  }, [scores.player]);

  const handlePlayerMove = (row, col) => {
    if (board[row][col] !== "" || !playerTurn || showS) return;

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
    if (showS) return; // Bloquer le jeu si "S" est affiché

    let availableMoves = [];
    board.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell === "") availableMoves.push([i, j]);
      });
    });

    if (availableMoves.length === 0) return;

    const [row, col] = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    const newBoard = board.map((r, i) => r.map((cell, j) => (i === row && j === col ? "O" : cell)));
    setBoard(newBoard);

    if (checkWinner(newBoard, "O")) {
      setTimeout(() => alert("Le bot a gagné !"), 100);
      setScores(prev => ({ ...prev, bot: prev.bot + 1 }));
      resetGame();
    } else if (checkDraw(newBoard)) {
      setTimeout(() => alert("Match nul !"), 100);
      setScores(prev => ({ ...prev, draw: prev.draw + 1 }));
      resetGame();
    } else {
      setPlayerTurn(true);
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
      {showS ? (
        <div className="letter-s">S</div> // Affichage de la lettre S après 5 victoires
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

export default TicTacToe;