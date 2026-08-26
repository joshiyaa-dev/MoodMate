"use client"

import { useState, useEffect, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Play, Pause, RotateCcw, ArrowUp, ArrowDown, ArrowLeft as ArrowLeftIcon, ArrowRight, Trophy } from "lucide-react"

interface NokiaSnakeProps {
  onBack: () => void
}

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'
type GameStatus = 'WAITING' | 'PLAYING' | 'PAUSED' | 'GAME_OVER'

interface Position {
  x: number
  y: number
}

interface GameState {
  snake: Position[]
  food: Position
  direction: Direction
  nextDirection: Direction
  status: GameStatus
  score: number
  highScore: number
  speed: number
  level: number
}

const BOARD_SIZE = 20
const INITIAL_SNAKE = [{ x: 10, y: 10 }]
const INITIAL_SPEED = 350  // Slower initial speed
const SPEED_INCREMENT = 25 // Faster acceleration as snake grows

export default function NokiaSnake({ onBack }: NokiaSnakeProps) {
  const [gameState, setGameState] = useState<GameState>({
    snake: INITIAL_SNAKE,
    food: { x: 15, y: 15 },
    direction: 'RIGHT',
    nextDirection: 'RIGHT',
    status: 'WAITING',
    score: 0,
    highScore: parseInt(localStorage.getItem('snake-high-score') || '0'),
    speed: INITIAL_SPEED,
    level: 1
  })

  const generateFood = useCallback((snake: Position[]): Position => {
    let newFood: Position
    do {
      newFood = {
        x: Math.floor(Math.random() * BOARD_SIZE),
        y: Math.floor(Math.random() * BOARD_SIZE)
      }
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y))
    
    return newFood
  }, [])

  const checkCollision = (head: Position, snake: Position[]): boolean => {
    // Wall collision
    if (head.x < 0 || head.x >= BOARD_SIZE || head.y < 0 || head.y >= BOARD_SIZE) {
      return true
    }
    
    // Self collision
    return snake.some(segment => segment.x === head.x && segment.y === head.y)
  }

  const moveSnake = useCallback(() => {
    if (gameState.status !== 'PLAYING') return

    setGameState(prevState => {
      const { snake, food, nextDirection, score, speed, level } = prevState
      const head = { ...snake[0] }

      // Update direction
      const direction = nextDirection

      // Move head based on direction
      switch (direction) {
        case 'UP':
          head.y -= 1
          break
        case 'DOWN':
          head.y += 1
          break
        case 'LEFT':
          head.x -= 1
          break
        case 'RIGHT':
          head.x += 1
          break
      }

      // Check collision
      if (checkCollision(head, snake)) {
        const newHighScore = Math.max(score, prevState.highScore)
        localStorage.setItem('snake-high-score', newHighScore.toString())
        
        return {
          ...prevState,
          status: 'GAME_OVER',
          highScore: newHighScore
        }
      }

      const newSnake = [head, ...snake]
      let newFood = food
      let newScore = score
      let newSpeed = speed
      let newLevel = level

      // Check if food is eaten
      if (head.x === food.x && head.y === food.y) {
        newFood = generateFood(newSnake)
        newScore = score + 10
        
        // Increase speed and level every 50 points
        if (newScore % 50 === 0) {
          newLevel = Math.floor(newScore / 50) + 1
          newSpeed = Math.max(50, INITIAL_SPEED - (newLevel - 1) * SPEED_INCREMENT)
        }
      } else {
        // Remove tail if no food eaten
        newSnake.pop()
      }

      return {
        ...prevState,
        snake: newSnake,
        food: newFood,
        direction,
        score: newScore,
        speed: newSpeed,
        level: newLevel
      }
    })
  }, [gameState.status, generateFood])

  // Game loop
  useEffect(() => {
    if (gameState.status === 'PLAYING') {
      const gameInterval = setInterval(moveSnake, gameState.speed)
      return () => clearInterval(gameInterval)
    }
  }, [gameState.status, gameState.speed, moveSnake])

  // Handle keyboard and touch input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameState.status !== 'PLAYING') return

      let newDirection: Direction | null = null

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (gameState.direction !== 'DOWN') newDirection = 'UP'
          break
        case 'ArrowDown':
        case 's':
        case 'S':
          if (gameState.direction !== 'UP') newDirection = 'DOWN'
          break
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (gameState.direction !== 'RIGHT') newDirection = 'LEFT'
          break
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (gameState.direction !== 'LEFT') newDirection = 'RIGHT'
          break
        case ' ':
          e.preventDefault()
          togglePause()
          break
      }

      if (newDirection) {
        e.preventDefault()
        setGameState(prev => ({ ...prev, nextDirection: newDirection! }))
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [gameState.direction, gameState.status])

  // Touch/swipe controls
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)
  
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    setTouchStart({ x: touch.clientX, y: touch.clientY })
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart || gameState.status !== 'PLAYING') return

    const touch = e.changedTouches[0]
    const deltaX = touch.clientX - touchStart.x
    const deltaY = touch.clientY - touchStart.y
    const minSwipeDistance = 30

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX > 0 && gameState.direction !== 'LEFT') {
          changeDirection('RIGHT')
        } else if (deltaX < 0 && gameState.direction !== 'RIGHT') {
          changeDirection('LEFT')
        }
      }
    } else {
      // Vertical swipe
      if (Math.abs(deltaY) > minSwipeDistance) {
        if (deltaY > 0 && gameState.direction !== 'UP') {
          changeDirection('DOWN')
        } else if (deltaY < 0 && gameState.direction !== 'DOWN') {
          changeDirection('UP')
        }
      }
    }
    
    setTouchStart(null)
  }

  const startGame = () => {
    setGameState(prev => ({
      ...prev,
      snake: INITIAL_SNAKE,
      food: generateFood(INITIAL_SNAKE),
      direction: 'RIGHT',
      nextDirection: 'RIGHT',
      status: 'PLAYING',
      score: 0,
      speed: INITIAL_SPEED,
      level: 1
    }))
  }

  const togglePause = () => {
    setGameState(prev => ({
      ...prev,
      status: prev.status === 'PLAYING' ? 'PAUSED' : 'PLAYING'
    }))
  }

  const resetGame = () => {
    setGameState(prev => ({
      ...prev,
      snake: INITIAL_SNAKE,
      food: generateFood(INITIAL_SNAKE),
      direction: 'RIGHT',
      nextDirection: 'RIGHT',
      status: 'WAITING',
      score: 0,
      speed: INITIAL_SPEED,
      level: 1
    }))
  }

  const changeDirection = (newDirection: Direction) => {
    if (gameState.status !== 'PLAYING') return

    const opposites = {
      'UP': 'DOWN',
      'DOWN': 'UP',
      'LEFT': 'RIGHT',
      'RIGHT': 'LEFT'
    }

    if (gameState.direction !== opposites[newDirection]) {
      setGameState(prev => ({ ...prev, nextDirection: newDirection }))
    }
  }

  const renderCell = (x: number, y: number) => {
    const isSnakeHead = gameState.snake.length > 0 && gameState.snake[0].x === x && gameState.snake[0].y === y
    const isSnakeBody = gameState.snake.some((segment, index) => index > 0 && segment.x === x && segment.y === y)
    const isFood = gameState.food.x === x && gameState.food.y === y

    let cellContent = ''
    let cellStyle = 'bg-green-900'

    if (isSnakeHead) {
      cellContent = '●'
      cellStyle = 'bg-black text-green-300 font-bold shadow-lg border-green-400 animate-pulse'
    } else if (isSnakeBody) {
      cellContent = '■'
      cellStyle = 'bg-black text-green-400 border-green-500'
    } else if (isFood) {
      cellContent = '◆'
      cellStyle = 'bg-black text-yellow-400 border-yellow-500 animate-bounce shadow-lg'
    }

    return (
      <div
        key={`${x}-${y}`}
        className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 border border-green-800 flex items-center justify-center text-xs sm:text-sm font-bold ${cellStyle} transition-all duration-75`}
      >
        {cellContent}
      </div>
    )
  }

  const renderBoard = () => {
    const board = []
    for (let y = 0; y < BOARD_SIZE; y++) {
      const row = []
      for (let x = 0; x < BOARD_SIZE; x++) {
        row.push(renderCell(x, y))
      }
      board.push(
        <div key={y} className="flex">
          {row}
        </div>
      )
    }
    return board
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-2 sm:p-4">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg space-y-4 sm:space-y-0">
          <Button 
            variant="outline" 
            onClick={onBack} 
            onTouchEnd={(e) => { e.preventDefault(); onBack() }}
            size="lg"
            className="touch-manipulation"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100 flex items-center justify-center gap-2">
              🐍 Nokia Snake
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">Classic retro gaming</p>
          </div>
          <div className="hidden sm:block w-32"></div> {/* Spacer for centering */}
        </div>

        {/* Game Board - Responsive Layout */}
        <div className="flex justify-center">
          <Card className="p-3 sm:p-6 bg-black border-green-600 shadow-2xl max-w-sm sm:max-w-md mx-auto">
            <div className="space-y-3 sm:space-y-4">
              {/* Score Display */}
              <div className="flex justify-between items-center text-green-400 font-mono text-sm sm:text-lg">
                <div>
                  Score: <span className="text-yellow-400 font-bold">{gameState.score}</span>
                </div>
                <div>
                  Level: <span className="text-blue-400 font-bold">{gameState.level}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Trophy className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-orange-400 font-bold">{gameState.highScore}</span>
                </div>
              </div>

              {/* Game Board */}
              <div 
                className="border-2 border-green-600 bg-green-950 p-1 sm:p-2 select-none touch-manipulation mx-auto"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                style={{ touchAction: 'none', maxWidth: 'fit-content' }}
              >
                {renderBoard()}
              </div>

              {/* Game Status */}
              {gameState.status === 'WAITING' && (
                <div className="text-center text-green-400 font-mono">
                  <p className="text-xl mb-2">Ready to Play!</p>
                  <p className="text-sm">Swipe or use arrow keys to control</p>
                </div>
              )}
              
              {gameState.status === 'PAUSED' && (
                <div className="text-center text-yellow-400 font-mono">
                  <p className="text-xl animate-pulse">PAUSED</p>
                </div>
              )}
              
              {gameState.status === 'GAME_OVER' && (
                <div className="text-center text-red-400 font-mono">
                  <p className="text-xl mb-2">GAME OVER!</p>
                  <p className="text-sm">Final Score: {gameState.score}</p>
                  {gameState.score === gameState.highScore && (
                    <p className="text-yellow-400 text-sm animate-bounce">🎉 NEW HIGH SCORE! 🎉</p>
                  )}
                </div>
              )}

              {/* Control Buttons */}
              <div className="flex justify-center gap-2 sm:gap-4">
                {gameState.status === 'WAITING' && (
                  <Button 
                    onClick={startGame} 
                    onTouchEnd={(e) => { e.preventDefault(); startGame() }}
                    size="lg" 
                    className="bg-green-600 hover:bg-green-700 touch-manipulation"
                  >
                    <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Start
                  </Button>
                )}
                
                {gameState.status === 'PLAYING' && (
                  <Button 
                    onClick={togglePause} 
                    onTouchEnd={(e) => { e.preventDefault(); togglePause() }}
                    size="lg" 
                    className="bg-yellow-600 hover:bg-yellow-700 touch-manipulation"
                  >
                    <Pause className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Pause
                  </Button>
                )}
                
                {gameState.status === 'PAUSED' && (
                  <>
                    <Button 
                      onClick={togglePause} 
                      onTouchEnd={(e) => { e.preventDefault(); togglePause() }}
                      size="lg" 
                      className="bg-green-600 hover:bg-green-700 touch-manipulation"
                    >
                      <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Resume
                    </Button>
                    <Button 
                      onClick={resetGame} 
                      onTouchEnd={(e) => { e.preventDefault(); resetGame() }}
                      size="lg" 
                      variant="outline"
                      className="touch-manipulation"
                    >
                      <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Reset
                    </Button>
                  </>
                )}
                
                {gameState.status === 'GAME_OVER' && (
                  <>
                    <Button 
                      onClick={startGame} 
                      onTouchEnd={(e) => { e.preventDefault(); startGame() }}
                      size="lg" 
                      className="bg-green-600 hover:bg-green-700 touch-manipulation"
                    >
                      <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Play Again
                    </Button>
                    <Button 
                      onClick={resetGame} 
                      onTouchEnd={(e) => { e.preventDefault(); resetGame() }}
                      size="lg" 
                      variant="outline"
                      className="touch-manipulation"
                    >
                      <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      Reset
                    </Button>
                  </>
                )}
              </div>

              {/* Mobile Touch Controls */}
              <div className="sm:hidden">
                <p className="text-center text-green-400 text-xs mb-2 font-mono">Touch Controls</p>
                <div className="grid grid-cols-3 gap-1 max-w-36 mx-auto">
                  <div></div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-10 border-green-600 text-green-400 hover:bg-green-900 touch-manipulation"
                    onTouchStart={(e) => { e.preventDefault(); changeDirection('UP') }}
                    onClick={() => changeDirection('UP')}
                  >
                    <ArrowUp className="w-4 h-4" />
                  </Button>
                  <div></div>
                  
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-10 border-green-600 text-green-400 hover:bg-green-900 touch-manipulation"
                    onTouchStart={(e) => { e.preventDefault(); changeDirection('LEFT') }}
                    onClick={() => changeDirection('LEFT')}
                  >
                    <ArrowLeftIcon className="w-4 h-4" />
                  </Button>
                  <div></div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-10 border-green-600 text-green-400 hover:bg-green-900 touch-manipulation"
                    onTouchStart={(e) => { e.preventDefault(); changeDirection('RIGHT') }}
                    onClick={() => changeDirection('RIGHT')}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                  
                  <div></div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-10 border-green-600 text-green-400 hover:bg-green-900 touch-manipulation"
                    onTouchStart={(e) => { e.preventDefault(); changeDirection('DOWN') }}
                    onClick={() => changeDirection('DOWN')}
                  >
                    <ArrowDown className="w-4 h-4" />
                  </Button>
                  <div></div>
                </div>
              </div>

              {/* Instructions */}
              <div className="text-center text-green-400 text-xs font-mono space-y-1">
                <p className="hidden sm:block">🖱️ Desktop: Arrow keys or WASD</p>
                <p>📱 Mobile: Swipe on board or use buttons</p>
                <p className="hidden sm:block">⏸️ Space to pause</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}