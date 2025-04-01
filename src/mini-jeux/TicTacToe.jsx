import { useState, useEffect } from "react";
// import "../App.css";

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(3).fill().map(() => Array(3).fill("")));
  const [playerTurn, setPlayerTurn] = useState(true);
  const [scores, setScores] = useState({ player: 0, bot: 0, draw: 0 });

  const checkWinner = (symbol) => {
    for (let i = 0; i < 3; i++) {
      if (board[i].every(cell => cell === symbol)) return true;
      if (board.every(row => row[i] === symbol)) return true;
    }
    if (board[0][0] === symbol && board[1][1] === symbol && board[2][2] === symbol) return true;
    if (board[0][2] === symbol && board[1][1] === symbol && board[2][0] === symbol) return true;
    return false;
  };

  const checkDraw = () => board.flat().every(cell => cell !== "");
  
  const handlePlayerMove = (row, col) => {
    if (!playerTurn || board[row][col] !== "") return;
    
    const newBoard = board.map((r, i) => r.map((c, j) => (i === row && j === col ? "X" : c)));
    setBoard(newBoard);
    
    if (checkWinner("X")) {
      alert("Tu as gagné !");
      setScores((prev) => ({ ...prev, player: prev.player + 1 }));
      resetGame();
    } else if (checkDraw()) {
      alert("Match nul !");
      setScores((prev) => ({ ...prev, draw: prev.draw + 1 }));
      resetGame();
    } else {
      setPlayerTurn(false);
      setTimeout(botMove, 500);
    }
  };

  const botMove = () => {
    let availableMoves = [];
    board.forEach((row, i) => row.forEach((cell, j) => {
      if (cell === "") availableMoves.push([i, j]);
    }));
    if (availableMoves.length === 0) return;
    
    const [row, col] = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    const newBoard = board.map((r, i) => r.map((c, j) => (i === row && j === col ? "O" : c)));
    setBoard(newBoard);
    
    if (checkWinner("O")) {
      alert("Le bot a gagné !");
      setScores((prev) => ({ ...prev, bot: prev.bot + 1 }));
      resetGame();
    } else if (checkDraw()) {
      alert("Match nul !");
      setScores((prev) => ({ ...prev, draw: prev.draw + 1 }));
      resetGame();
    } else {
      setPlayerTurn(true);
    }
  };

  const resetGame = () => {
    setBoard(Array(3).fill().map(() => Array(3).fill("")));
    setPlayerTurn(true);
  };

  return (
    <div id="tictactoeContainer">
      <table>
        <tbody>
          {board.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} onClick={() => handlePlayerMove(i, j)} className={cell === "X" ? "player-symbol" : cell === "O" ? "bot-symbol" : ""}>
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