
import { useState } from 'react'
import './App.css'

type GameType = 'tic-tac-toe' | 'rock-paper-scissors' | 'number-guess' | null
type Player = 'human' | 'ai'
type TicTacToeCell = 'X' | 'O' | null
type RpsChoice = 'rock' | 'paper' | 'scissors'

export default function App() {
  const [currentGame, setCurrentGame] = useState<GameType>(null)
  const [gameStats, setGameStats] = useState({ wins: 0, losses: 0, draws: 0 })

  // Tic-tac-toe state
  const [board, setBoard] = useState<TicTacToeCell[]>(Array(9).fill(null))
  const [isPlayerTurn, setIsPlayerTurn] = useState(true)
  const [gameOver, setGameOver] = useState(false)
  const [winner, setWinner] = useState<string | null>(null)

  // Rock-paper-scissors state
  const [playerChoice, setPlayerChoice] = useState<RpsChoice | null>(null)
  const [aiChoice, setAiChoice] = useState<RpsChoice | null>(null)
  const [rpsResult, setRpsResult] = useState<string | null>(null)

  // Number guessing state
  const [targetNumber, setTargetNumber] = useState<number>(0)
  const [guess, setGuess] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [numberGameOver, setNumberGameOver] = useState(false)

  const checkWinner = (squares: TicTacToeCell[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ]
    
    for (let line of lines) {
      const [a, b, c] = line
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a]
      }
    }
    return null
  }

  const makeAIMove = (currentBoard: TicTacToeCell[]) => {
    const availableMoves = currentBoard
      .map((cell, index) => cell === null ? index : null)
      .filter(val => val !== null) as number[]
    
    if (availableMoves.length === 0) return
    
    const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)]
    const newBoard = [...currentBoard]
    newBoard[randomMove] = 'O'
    
    setTimeout(() => {
      setBoard(newBoard)
      const gameWinner = checkWinner(newBoard)
      if (gameWinner) {
        setWinner(gameWinner === 'X' ? 'You win!' : 'AI wins!')
        setGameOver(true)
        setGameStats(prev => ({
          ...prev,
          [gameWinner === 'X' ? 'wins' : 'losses']: prev[gameWinner === 'X' ? 'wins' : 'losses'] + 1
        }))
      } else if (newBoard.every(cell => cell !== null)) {
        setWinner('Draw!')
        setGameOver(true)
        setGameStats(prev => ({ ...prev, draws: prev.draws + 1 }))
      } else {
        setIsPlayerTurn(true)
      }
    }, 500)
  }

  const handleTicTacToeClick = (index: number) => {
    if (board[index] || gameOver || !isPlayerTurn) return
    
    const newBoard = [...board]
    newBoard[index] = 'X'
    setBoard(newBoard)
    setIsPlayerTurn(false)
    
    const gameWinner = checkWinner(newBoard)
    if (gameWinner) {
      setWinner('You win!')
      setGameOver(true)
      setGameStats(prev => ({ ...prev, wins: prev.wins + 1 }))
      return
    }
    
    if (newBoard.every(cell => cell !== null)) {
      setWinner('Draw!')
      setGameOver(true)
      setGameStats(prev => ({ ...prev, draws: prev.draws + 1 }))
      return
    }
    
    makeAIMove(newBoard)
  }

  const playRockPaperScissors = (choice: RpsChoice) => {
    const choices: RpsChoice[] = ['rock', 'paper', 'scissors']
    const aiChoice = choices[Math.floor(Math.random() * choices.length)]
    
    setPlayerChoice(choice)
    setAiChoice(aiChoice)
    
    let result = ''
    if (choice === aiChoice) {
      result = "It's a draw!"
      setGameStats(prev => ({ ...prev, draws: prev.draws + 1 }))
    } else if (
      (choice === 'rock' && aiChoice === 'scissors') ||
      (choice === 'paper' && aiChoice === 'rock') ||
      (choice === 'scissors' && aiChoice === 'paper')
    ) {
      result = 'You win!'
      setGameStats(prev => ({ ...prev, wins: prev.wins + 1 }))
    } else {
      result = 'AI wins!'
      setGameStats(prev => ({ ...prev, losses: prev.losses + 1 }))
    }
    
    setRpsResult(result)
  }

  const handleNumberGuess = () => {
    const guessNum = parseInt(guess)
    const newAttempts = attempts + 1
    setAttempts(newAttempts)
    
    if (guessNum === targetNumber) {
      setFeedback(`Correct! You got it in ${newAttempts} attempts!`)
      setNumberGameOver(true)
      setGameStats(prev => ({ ...prev, wins: prev.wins + 1 }))
    } else if (guessNum < targetNumber) {
      setFeedback('Too low! Try higher.')
    } else {
      setFeedback('Too high! Try lower.')
    }
    
    if (newAttempts >= 7 && guessNum !== targetNumber) {
      setFeedback(`Game over! The number was ${targetNumber}`)
      setNumberGameOver(true)
      setGameStats(prev => ({ ...prev, losses: prev.losses + 1 }))
    }
    
    setGuess('')
  }

  const startGame = (game: GameType) => {
    setCurrentGame(game)
    
    switch (game) {
      case 'tic-tac-toe':
        setBoard(Array(9).fill(null))
        setIsPlayerTurn(true)
        setGameOver(false)
        setWinner(null)
        break
      case 'rock-paper-scissors':
        setPlayerChoice(null)
        setAiChoice(null)
        setRpsResult(null)
        break
      case 'number-guess':
        setTargetNumber(Math.floor(Math.random() * 100) + 1)
        setGuess('')
        setAttempts(0)
        setFeedback('')
        setNumberGameOver(false)
        break
    }
  }

  const renderGameSelection = () => (
    <div className="game-selection">
      <h1>🎮 AI Gaming Platform</h1>
      <div className="stats">
        <div className="stat">
          <span className="stat-label">Wins</span>
          <span className="stat-value wins">{gameStats.wins}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Losses</span>
          <span className="stat-value losses">{gameStats.losses}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Draws</span>
          <span className="stat-value draws">{gameStats.draws}</span>
        </div>
      </div>
      
      <div className="games-grid">
        <div className="game-card" onClick={() => startGame('tic-tac-toe')}>
          <div className="game-icon">⭕</div>
          <h3>Tic-Tac-Toe</h3>
          <p>Classic 3x3 grid game against AI</p>
        </div>
        
        <div className="game-card" onClick={() => startGame('rock-paper-scissors')}>
          <div className="game-icon">✂️</div>
          <h3>Rock Paper Scissors</h3>
          <p>Beat the AI in this classic game</p>
        </div>
        
        <div className="game-card" onClick={() => startGame('number-guess')}>
          <div className="game-icon">🔢</div>
          <h3>Number Guessing</h3>
          <p>Guess the AI's secret number (1-100)</p>
        </div>
      </div>
    </div>
  )

  const renderTicTacToe = () => (
    <div className="game-container">
      <div className="game-header">
        <h2>🎯 Tic-Tac-Toe vs AI</h2>
        <button onClick={() => setCurrentGame(null)} className="back-btn">← Back</button>
      </div>
      
      {winner && <div className="game-result">{winner}</div>}
      
      <div className="tic-tac-toe-board">
        {board.map((cell, index) => (
          <button
            key={index}
            className="tic-tac-toe-cell"
            onClick={() => handleTicTacToeClick(index)}
            disabled={gameOver || !isPlayerTurn}
          >
            {cell}
          </button>
        ))}
      </div>
      
      <div className="game-status">
        {!gameOver && (isPlayerTurn ? "Your turn (X)" : "AI thinking...")}
      </div>
      
      {gameOver && (
        <button onClick={() => startGame('tic-tac-toe')} className="play-again-btn">
          Play Again
        </button>
      )}
    </div>
  )

  const renderRockPaperScissors = () => (
    <div className="game-container">
      <div className="game-header">
        <h2>✂️ Rock Paper Scissors vs AI</h2>
        <button onClick={() => setCurrentGame(null)} className="back-btn">← Back</button>
      </div>
      
      <div className="rps-choices">
        {(['rock', 'paper', 'scissors'] as RpsChoice[]).map(choice => (
          <button
            key={choice}
            onClick={() => playRockPaperScissors(choice)}
            className="rps-choice"
          >
            {choice === 'rock' ? '🪨' : choice === 'paper' ? '📄' : '✂️'}
            <span>{choice}</span>
          </button>
        ))}
      </div>
      
      {playerChoice && aiChoice && (
        <div className="rps-result">
          <div className="choices">
            <div className="choice">
              <div>You chose:</div>
              <div className="choice-display">
                {playerChoice === 'rock' ? '🪨' : playerChoice === 'paper' ? '📄' : '✂️'}
              </div>
            </div>
            <div className="vs">VS</div>
            <div className="choice">
              <div>AI chose:</div>
              <div className="choice-display">
                {aiChoice === 'rock' ? '🪨' : aiChoice === 'paper' ? '📄' : '✂️'}
              </div>
            </div>
          </div>
          <div className="result">{rpsResult}</div>
          <button onClick={() => startGame('rock-paper-scissors')} className="play-again-btn">
            Play Again
          </button>
        </div>
      )}
    </div>
  )

  const renderNumberGuess = () => (
    <div className="game-container">
      <div className="game-header">
        <h2>🔢 Number Guessing vs AI</h2>
        <button onClick={() => setCurrentGame(null)} className="back-btn">← Back</button>
      </div>
      
      <div className="number-guess-info">
        <p>Guess the number between 1 and 100!</p>
        <p>Attempts: {attempts}/7</p>
      </div>
      
      {!numberGameOver && (
        <div className="number-input-section">
          <input
            type="number"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="Enter your guess"
            min="1"
            max="100"
            className="number-input"
          />
          <button 
            onClick={handleNumberGuess} 
            className="guess-btn"
            disabled={!guess}
          >
            Guess!
          </button>
        </div>
      )}
      
      {feedback && <div className="feedback">{feedback}</div>}
      
      {numberGameOver && (
        <button onClick={() => startGame('number-guess')} className="play-again-btn">
          Play Again
        </button>
      )}
    </div>
  )

  return (
    <main className="app">
      {!currentGame && renderGameSelection()}
      {currentGame === 'tic-tac-toe' && renderTicTacToe()}
      {currentGame === 'rock-paper-scissors' && renderRockPaperScissors()}
      {currentGame === 'number-guess' && renderNumberGuess()}
    </main>
  )
}
