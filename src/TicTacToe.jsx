import React, { useState } from "react";
import "./TicTacToe.css";

const TicTacToe = () => {
  // Initialisation du tableau de jeu
  const [board, setBoard] = useState([
    ["", "", ""],
    ["", "", ""],
    ["", "", ""]
  ]);
  const [playerTurn, setPlayerTurn] = useState(true); // Le joueur commence
  const [scores, setScores] = useState({ player: 0, bot: 0, draw: 0 }); // Initialisation des scores

  // Fonction pour gérer le mouvement du joueur
  const handlePlayerMove = (row, col) => {
    if (board[row][col] !== "" || !playerTurn) return; // Si la case est déjà occupée ou ce n'est pas le tour du joueur

    // Mise à jour du tableau avec la croix ("X")
    const newBoard = board.map((r, i) => r.map((cell, j) => (i === row && j === col ? "X" : cell)));
    setBoard(newBoard);

    // Vérification de la victoire du joueur
    if (checkWinner(newBoard, "X")) {
      setTimeout(() => alert("Tu as gagné !"), 100); // Message de victoire
      setScores(prevScores => ({ ...prevScores, player: prevScores.player + 1 }));
      resetGame();
    } else if (checkDraw(newBoard)) {
      setTimeout(() => alert("Match nul !"), 100); // Message de match nul
      setScores(prevScores => ({ ...prevScores, draw: prevScores.draw + 1 }));
      resetGame();
    } else {
      setPlayerTurn(false); // C'est maintenant le tour du bot
      setTimeout(() => handleBotMove(newBoard), 500); // Le bot joue après un délai
    }
  };

  // Fonction pour gérer le mouvement du bot
  const handleBotMove = (currentBoard) => {
    let availableMoves = [];
    currentBoard.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell === "") availableMoves.push([i, j]); // Trouver les cases vides
      });
    });

    if (availableMoves.length === 0) {
      setScores(prevScores => ({ ...prevScores, draw: prevScores.draw + 1 })); // Match nul si aucune case vide
      resetGame();
      return;
    }

    const [row, col] = availableMoves[Math.floor(Math.random() * availableMoves.length)]; // Le bot choisit une case aléatoire

    // Mise à jour du tableau avec le rond ("O")
    const newBoard = currentBoard.map((r, i) => r.map((cell, j) => (i === row && j === col ? "O" : cell)));
    setBoard(newBoard);

    // Vérification de la victoire du bot
    if (checkWinner(newBoard, "O")) {
      setScores(prevScores => ({ ...prevScores, bot: prevScores.bot + 1 }));
      resetGame();
    } else if (checkDraw(newBoard)) {
      setScores(prevScores => ({ ...prevScores, draw: prevScores.draw + 1 }));
      resetGame();
    } else {
      setPlayerTurn(true); // C'est à nouveau le tour du joueur
    }
  };

  // Fonction pour vérifier si un joueur a gagné
  const checkWinner = (board, symbol) => {
    for (let i = 0; i < 3; i++) {
      if (board[i].every(cell => cell === symbol)) return true; // Vérifie les lignes
      if (board.every(row => row[i] === symbol)) return true; // Vérifie les colonnes
    }
    if (board[0][0] === symbol && board[1][1] === symbol && board[2][2] === symbol) return true; // Vérifie la diagonale
    if (board[0][2] === symbol && board[1][1] === symbol && board[2][0] === symbol) return true; // Vérifie l'autre diagonale
    return false;
  };

  // Fonction pour vérifier si la partie est un match nul
  const checkDraw = (board) => board.flat().every(cell => cell !== ""); // Si toutes les cases sont remplies sans gagnant

  // Fonction pour réinitialiser le jeu
  const resetGame = () => {
    setBoard([
      ["", "", ""],
      ["", "", ""],
      ["", "", ""]
    ]);
    setPlayerTurn(true); // Le joueur commence à nouveau
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
    </div>
  );
};

export default TicTacToe;
