"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Trophy, Bot, User } from "lucide-react"
import { MobileFriendlyWrapper } from "../utils/mobile-touch-utils"

interface SnakeAndLadderProps {
  onBack: () => void
}

type Player = 'human' | 'robot'

interface GameState {
  humanPosition: number
  robotPosition: number
  currentPlayer: Player
  diceValue: number
  isRolling: boolean
  gameOver: boolean
  winner: Player | null
  gameLog: string[]
}

export default function SnakeAndLadder({ onBack }: SnakeAndLadderProps) {
  const [gameState, setGameState] = useState<GameState>({
    humanPosition: 1,
    robotPosition: 1,
    currentPlayer: 'human',
    diceValue: 1,
    isRolling: false,
    gameOver: false,
    winner: null,
    gameLog: ['🎮 Welcome to Snake & Ladder! Roll the dice to start your adventure!']
  })

  // Snakes (head -> tail)
  const snakes = {
    16: 6,
    47: 26,
    49: 11,
    56: 53,
    62: 19,
    64: 60,
    87: 24,
    93: 73,
    95: 75,
    98: 78
  }

  // Ladders (bottom -> top)
  const ladders = {
    1: 38,
    4: 14,
    9: 21,
    21: 42,
    28: 84,
    36: 44,
    51: 67,
    71: 91,
    80: 100
  }

  const getDiceIcon = (value: number) => {
    const icons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6]
    const DiceIcon = icons[value - 1]
    return <DiceIcon className="w-8 h-8 text-gray-700" />
  }

  const addToLog = (message: string) => {
    setGameState(prev => ({
      ...prev,
      gameLog: [message, ...prev.gameLog.slice(0, 9)]
    }))
  }

  const movePlayer = (player: Player, steps: number) => {
    const currentPos = player === 'human' ? gameState.humanPosition : gameState.robotPosition
    let newPos = currentPos + steps

    // Can't go beyond 100
    if (newPos > 100) {
      newPos = currentPos
      addToLog(`${player === 'human' ? '👤 You' : '🤖 Robot'} rolled ${steps} but can't move beyond 100!`)
      return currentPos
    }

    // Check for ladders
    if (ladders[newPos as keyof typeof ladders]) {
      const ladderTop = ladders[newPos as keyof typeof ladders]
      addToLog(`${player === 'human' ? '👤 You' : '🤖 Robot'} climbed a ladder from ${newPos} to ${ladderTop}! 🪜`)
      newPos = ladderTop
    }
    // Check for snakes
    else if (snakes[newPos as keyof typeof snakes]) {
      const snakeTail = snakes[newPos as keyof typeof snakes]
      addToLog(`${player === 'human' ? '👤 You' : '🤖 Robot'} got bitten by a snake! Slid from ${newPos} to ${snakeTail} 🐍`)
      newPos = snakeTail
    }
    else {
      addToLog(`${player === 'human' ? '👤 You' : '🤖 Robot'} moved from ${currentPos} to ${newPos}`)
    }

    return newPos
  }

  const rollDice = () => {
    if (gameState.isRolling || gameState.gameOver) return

    setGameState(prev => ({ ...prev, isRolling: true }))

    // Animate dice rolling
    let rollCount = 0
    const rollInterval = setInterval(() => {
      setGameState(prev => ({ ...prev, diceValue: Math.floor(Math.random() * 6) + 1 }))
      rollCount++
      
      if (rollCount >= 10) {
        clearInterval(rollInterval)
        
        const finalDiceValue = Math.floor(Math.random() * 6) + 1
        const newPos = movePlayer(gameState.currentPlayer, finalDiceValue)
        
        setGameState(prev => {
          const newState = { ...prev }
          newState.diceValue = finalDiceValue
          newState.isRolling = false
          
          if (gameState.currentPlayer === 'human') {
            newState.humanPosition = newPos
          } else {
            newState.robotPosition = newPos
          }
          
          // Check for winner
          if (newPos === 100) {
            newState.gameOver = true
            newState.winner = gameState.currentPlayer
            addToLog(`🎉 ${gameState.currentPlayer === 'human' ? 'You won!' : 'Robot won!'} Game Over!`)
          } else {
            // Switch turns
            newState.currentPlayer = gameState.currentPlayer === 'human' ? 'robot' : 'human'
          }
          
          return newState
        })
      }
    }, 100)
  }

  // Robot's turn - auto roll after delay
  useEffect(() => {
    if (gameState.currentPlayer === 'robot' && !gameState.isRolling && !gameState.gameOver) {
      const timer = setTimeout(() => {
        rollDice()
      }, 1500)
      
      return () => clearTimeout(timer)
    }
  }, [gameState.currentPlayer, gameState.isRolling, gameState.gameOver])

  const resetGame = () => {
    setGameState({
      humanPosition: 1,
      robotPosition: 1,
      currentPlayer: 'human',
      diceValue: 1,
      isRolling: false,
      gameOver: false,
      winner: null,
      gameLog: ['🎮 New game started! Roll the dice to begin!']
    })
  }

  const getCellColor = (cellNum: number) => {
    if (gameState.humanPosition === cellNum && gameState.robotPosition === cellNum) {
      return 'bg-gradient-to-br from-blue-200 via-purple-200 to-red-200 text-gray-800 border-purple-400 shadow-lg' // Both players
    } else if (gameState.humanPosition === cellNum) {
      return 'bg-gradient-to-br from-blue-200 to-blue-300 text-blue-800 border-blue-400 shadow-lg' // Human player
    } else if (gameState.robotPosition === cellNum) {
      return 'bg-gradient-to-br from-red-200 to-red-300 text-red-800 border-red-400 shadow-lg' // Robot player
    } else if (snakes[cellNum as keyof typeof snakes]) {
      return 'bg-gradient-to-br from-red-100 to-red-200 text-red-800 border-red-300' // Snake head
    } else if (ladders[cellNum as keyof typeof ladders]) {
      return 'bg-gradient-to-br from-green-100 to-green-200 text-green-800 border-green-300' // Ladder bottom
    } else if (cellNum === 100) {
      return 'bg-gradient-to-br from-yellow-200 to-gold-300 text-yellow-800 border-yellow-400 shadow-lg' // Finish line
    } else if (cellNum === 1) {
      return 'bg-gradient-to-br from-cyan-100 to-cyan-200 text-cyan-800 border-cyan-300' // Start
    } else {
      return (cellNum % 2 === 0) 
        ? 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-700 border-gray-300' 
        : 'bg-gradient-to-br from-white to-gray-50 text-gray-700 border-gray-300'
    }
  }

  const renderBoard = () => {
    const cells = []
    
    // Create 10x10 board (100 to 1, zigzag pattern like real Snake & Ladder)
    for (let row = 0; row < 10; row++) {
      const rowCells = []
      
      for (let col = 0; col < 10; col++) {
        let cellNum
        if (row % 2 === 0) {
          // Even rows: left to right (91-100, 71-80, etc.)
          cellNum = 100 - (row * 10) - col
        } else {
          // Odd rows: right to left (81-90, 61-70, etc.)
          cellNum = 100 - (row * 10) - (9 - col)
        }
        
        rowCells.push(
          <div
            key={cellNum}
            className={`w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 border border-gray-400 flex flex-col items-center justify-center text-xs font-bold cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg relative ${getCellColor(cellNum)}`}
          >
            <span className="text-[7px] sm:text-[8px] md:text-[9px] leading-none">{cellNum}</span>
            {snakes[cellNum as keyof typeof snakes] && (
              <span className="absolute top-0 right-0 text-red-600 text-xs sm:text-sm transform -translate-y-1 translate-x-1">🐍</span>
            )}
            {ladders[cellNum as keyof typeof ladders] && (
              <span className="absolute top-0 right-0 text-green-600 text-xs sm:text-sm transform -translate-y-1 translate-x-1">🪜</span>
            )}
            {gameState.humanPosition === cellNum && (
              <User className="w-2 h-2 sm:w-3 sm:h-3 text-blue-700 absolute bottom-0 left-0 transform translate-y-1 -translate-x-1" />
            )}
            {gameState.robotPosition === cellNum && (
              <Bot className="w-2 h-2 sm:w-3 sm:h-3 text-red-700 absolute bottom-0 right-0 transform translate-y-1 translate-x-1" />
            )}
          </div>
        )
      }
      
      cells.push(
        <div key={row} className="flex">
          {rowCells}
        </div>
      )
    }
    
    return cells
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 p-2 sm:p-4">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-6 shadow-xl border border-orange-200 space-y-4 sm:space-y-0">
          <Button 
            variant="outline" 
            onClick={onBack} 
            onTouchEnd={(e) => { e.preventDefault(); onBack() }}
            size="lg" 
            className="border-orange-300 hover:bg-orange-50 touch-manipulation"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 flex items-center justify-center gap-2">
              🐍🪜 Snake & Ladder
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">Classic board game</p>
          </div>
          <div className="hidden sm:block w-32"></div> {/* Spacer for centering */}
        </div>

        {/* Game Board - Square Layout Centered */}
        <div className="flex justify-center">
          <Card className="p-6 bg-white dark:bg-gray-800 shadow-2xl border-2 border-orange-300 rounded-2xl">
            <div className="flex flex-col items-center space-y-6">
              {/* Current Turn Display - Above Board */}
              <Card className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-xl w-full max-w-md">
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center space-x-3">
                    {gameState.currentPlayer === 'human' ? (
                      <User className="w-6 h-6 text-yellow-300" />
                    ) : (
                      <Bot className="w-6 h-6 text-red-300" />
                    )}
                    <div>
                      <p className="text-lg font-bold">
                        {gameState.currentPlayer === 'human' ? "Your Turn" : "Robot's Turn"}
                      </p>
                      <p className="text-xs opacity-90">
                        {gameState.currentPlayer === 'human' ? "Click to roll dice!" : "AI is thinking..."}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Game Board - Responsive Square */}
              <div className="bg-gradient-to-br from-orange-100 via-yellow-100 to-red-100 p-2 sm:p-4 rounded-xl shadow-inner border-2 border-orange-300">
                <div className="flex flex-col border-2 sm:border-4 border-orange-600 bg-white rounded-lg overflow-hidden shadow-2xl max-w-sm sm:max-w-md mx-auto">
                  {renderBoard()}
                </div>
              </div>

              {/* Dice Control - Below Board */}
              <Card className="p-6 bg-gradient-to-br from-green-400 to-blue-500 text-white shadow-xl w-full max-w-md">
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center space-x-4">
                    <div className={`bg-white p-4 rounded-xl shadow-lg transition-all duration-300 ${
                      gameState.isRolling ? 'animate-bounce' : ''
                    }`}>
                      {getDiceIcon(gameState.diceValue)}
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{gameState.diceValue}</p>
                      <p className="text-sm opacity-90">Last Roll</p>
                    </div>
                  </div>
                  
                  {!gameState.gameOver && gameState.currentPlayer === 'human' && (
                    <Button 
                      onClick={rollDice} 
                      onTouchEnd={(e) => { e.preventDefault(); rollDice() }}
                      disabled={gameState.isRolling} 
                      size="lg" 
                      className="w-full bg-yellow-500 hover:bg-yellow-600 text-yellow-900 font-bold py-3 touch-manipulation"
                    >
                      {gameState.isRolling ? '🎲 Rolling...' : '🎲 Roll Dice'}
                    </Button>
                  )}

                  {gameState.currentPlayer === 'robot' && !gameState.gameOver && (
                    <div className="bg-red-50 bg-opacity-20 p-4 rounded-lg border border-red-200">
                      <div className="flex items-center justify-center space-x-2 animate-pulse">
                        <Bot className="w-5 h-5 text-red-200" />
                        <span className="text-red-100 font-medium">Robot is thinking...</span>
                      </div>
                    </div>
                  )}

                  {gameState.gameOver && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-center space-x-2 text-yellow-300">
                        <Trophy className="w-8 h-8" />
                        <span className="text-2xl font-bold">
                          {gameState.winner === 'human' ? '🎉 You Won!' : '🤖 Robot Won!'}
                        </span>
                      </div>
                      <Button 
                        onClick={resetGame} 
                        onTouchEnd={(e) => { e.preventDefault(); resetGame() }}
                        size="lg" 
                        className="w-full bg-green-600 hover:bg-green-700 touch-manipulation"
                      >
                        🎮 Play Again
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </Card>
        </div>

        {/* Controls and Stats Row - Responsive Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Combined Player Stats & Progress */}
          <Card className="p-4 shadow-xl">
            <h4 className="font-bold text-sm mb-3 text-center">👥 Players & Progress</h4>
            <div className="space-y-3">
              {/* Player Positions - Compact */}
              <div className={`flex items-center justify-between p-2 rounded-lg transition-all duration-300 ${
                gameState.currentPlayer === 'human' 
                  ? 'bg-gradient-to-r from-blue-100 to-blue-200 border border-blue-400' 
                  : 'bg-gray-50 border border-gray-200'
              }`}>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <User className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-blue-700 text-xs">You</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-700">{gameState.humanPosition}</p>
                  <p className="text-xs text-blue-600">of 100</p>
                </div>
              </div>
              
              <div className={`flex items-center justify-between p-2 rounded-lg transition-all duration-300 ${
                gameState.currentPlayer === 'robot' 
                  ? 'bg-gradient-to-r from-red-100 to-red-200 border border-red-400' 
                  : 'bg-gray-50 border border-gray-200'
              }`}>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <Bot className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-red-700 text-xs">Robot</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-red-700">{gameState.robotPosition}</p>
                  <p className="text-xs text-red-600">of 100</p>
                </div>
              </div>

              {/* Progress Bars - Compact */}
              <div className="space-y-2 mt-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>You: {gameState.humanPosition}%</span>
                    <span>{gameState.humanPosition}/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
                      style={{width: `${gameState.humanPosition}%`}}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Robot: {gameState.robotPosition}%</span>
                    <span>{gameState.robotPosition}/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full transition-all duration-500" 
                      style={{width: `${gameState.robotPosition}%`}}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Game Controls & Status */}
          <Card className="p-4 shadow-xl">
            <h4 className="font-bold text-sm mb-3 text-center">🎮 Game Controls</h4>
            <div className="space-y-3">
              {/* Current Turn Status */}
              <div className="text-center p-2 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg">
                <div className="flex items-center justify-center space-x-2">
                  {gameState.currentPlayer === 'human' ? (
                    <User className="w-4 h-4 text-blue-600" />
                  ) : (
                    <Bot className="w-4 h-4 text-red-600" />
                  )}
                  <p className="text-sm font-bold">
                    {gameState.currentPlayer === 'human' ? "Your Turn" : "Robot's Turn"}
                  </p>
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {gameState.currentPlayer === 'human' ? "Click to roll dice!" : "AI is thinking..."}
                </p>
              </div>

              {/* Reset Game Button */}
              <Button 
                onClick={resetGame} 
                onTouchEnd={(e) => { e.preventDefault(); resetGame() }}
                variant="outline" 
                className="w-full border-orange-300 text-orange-700 hover:bg-orange-50 text-sm touch-manipulation"
                size="sm"
              >
                🔄 New Game
              </Button>
              
              {gameState.gameOver && (
                <div className="text-center p-2 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg">
                  <div className="flex items-center justify-center space-x-2 text-yellow-800">
                    <Trophy className="w-5 h-5" />
                    <span className="font-bold text-sm">
                      {gameState.winner === 'human' ? '🎉 You Won!' : '🤖 Robot Won!'}
                    </span>
                  </div>
                  <Button 
                    onClick={resetGame} 
                    onTouchEnd={(e) => { e.preventDefault(); resetGame() }}
                    size="sm" 
                    className="mt-2 bg-green-600 hover:bg-green-700 text-xs touch-manipulation"
                  >
                    🎯 Play Again
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Game Legend */}
        <Card className="p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-purple-50 shadow-xl border-2 border-blue-200">
          <h4 className="font-bold text-base sm:text-lg mb-4 text-center text-blue-800">🎯 Game Legend</h4>
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-2 sm:gap-4 text-xs sm:text-sm">
            <div className="flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full shadow-sm">
              <span>🪜</span>
              <span className="text-green-700 font-medium">Ladder (Climb Up)</span>
            </div>
            <div className="flex items-center gap-2 bg-red-100 px-4 py-2 rounded-full shadow-sm">
              <span>🐍</span>
              <span className="text-red-700 font-medium">Snake (Slide Down)</span>
            </div>
            <div className="flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full shadow-sm">
              <User className="w-4 h-4 text-blue-600" />
              <span className="text-blue-700 font-medium">You</span>
            </div>
            <div className="flex items-center gap-2 bg-red-100 px-4 py-2 rounded-full shadow-sm">
              <Bot className="w-4 h-4 text-red-600" />
              <span className="text-red-700 font-medium">Robot</span>
            </div>
          </div>
        </Card>

        {/* Benefits Footer */}
        <Card className="p-4 sm:p-6 bg-gradient-to-r from-purple-100 via-pink-100 to-orange-100 shadow-xl border-2 border-purple-200">
          <div className="text-center">
            <h3 className="font-bold text-lg sm:text-xl mb-3 text-purple-800">🧠 Mental Benefits</h3>
            <p className="text-sm sm:text-base text-purple-700 leading-relaxed">
              <strong>Cognitive Development:</strong> Strategic thinking • Decision making • Patience and resilience • 
              Probability understanding • Emotional regulation • Social interaction • Stress relief through fun gameplay
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}