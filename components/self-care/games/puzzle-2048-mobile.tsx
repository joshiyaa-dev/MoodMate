"use client"

import { useState, useEffect, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RotateCcw, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Zap } from "lucide-react"
import { MobileFriendlyWrapper, useSwipeDetection } from "../utils/mobile-touch-utils"

interface Puzzle2048MobileProps {
  onBack: () => void
}

type Grid = (number | null)[][]
type Direction = 'up' | 'down' | 'left' | 'right'

export default function Puzzle2048Mobile({ onBack }: Puzzle2048MobileProps) {
  const [grid, setGrid] = useState<Grid>(() =>
    Array(4).fill(null).map(() => Array(4).fill(null))
  )
  const [score, setScore] = useState(0)
  const [bestScore, setBestScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)
  const [animatingCells, setAnimatingCells] = useState<Set<string>>(new Set())

  // Load best score from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('puzzle2048-best')
    if (saved) {
      setBestScore(parseInt(saved))
    }
  }, [])

  // Save best score
  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score)
      localStorage.setItem('puzzle2048-best', score.toString())
    }
  }, [score, bestScore])

  const addRandomTile = useCallback((currentGrid: Grid) => {
    const emptyCells: [number, number][] = []

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (currentGrid[i][j] === null) {
          emptyCells.push([i, j])
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)]
      const newGrid = currentGrid.map(row => [...row])
      newGrid[randomCell[0]][randomCell[1]] = Math.random() < 0.9 ? 2 : 4

      // Add animation for new tile
      setAnimatingCells(prev => new Set([...prev, `${randomCell[0]}-${randomCell[1]}`]))
      setTimeout(() => {
        setAnimatingCells(prev => {
          const newSet = new Set(prev)
          newSet.delete(`${randomCell[0]}-${randomCell[1]}`)
          return newSet
        })
      }, 300)

      return newGrid
    }

    return currentGrid
  }, [])

  const initializeGame = useCallback(() => {
    let newGrid: Grid = Array(4).fill(null).map(() => Array(4).fill(null))
    newGrid = addRandomTile(newGrid)
    newGrid = addRandomTile(newGrid)
    setGrid(newGrid)
    setScore(0)
    setGameOver(false)
    setWon(false)
    setAnimatingCells(new Set())
  }, [addRandomTile])

  useEffect(() => {
    initializeGame()
  }, [initializeGame])

  const moveLeft = (currentGrid: Grid) => {
    const newGrid = currentGrid.map(row => [...row])
    let scoreIncrease = 0
    let moved = false

    for (let i = 0; i < 4; i++) {
      const row = newGrid[i].filter(cell => cell !== null)
      const newRow: (number | null)[] = []

      for (let j = 0; j < row.length; j++) {
        if (j < row.length - 1 && row[j] === row[j + 1]) {
          const mergedValue = row[j]! * 2
          newRow.push(mergedValue)
          scoreIncrease += mergedValue
          j++ // Skip next element as it's merged
          moved = true
        } else {
          newRow.push(row[j])
        }
      }

      while (newRow.length < 4) {
        newRow.push(null)
      }

      // Check if row changed
      if (JSON.stringify(newRow) !== JSON.stringify(currentGrid[i])) {
        moved = true
      }

      newGrid[i] = newRow
    }

    return { grid: newGrid, scoreIncrease, moved }
  }

  const moveRight = (currentGrid: Grid) => {
    const rotatedGrid = currentGrid.map(row => [...row].reverse())
    const { grid: movedGrid, scoreIncrease, moved } = moveLeft(rotatedGrid)
    const finalGrid = movedGrid.map(row => [...row].reverse())
    return { grid: finalGrid, scoreIncrease, moved }
  }

  const moveUp = (currentGrid: Grid) => {
    const transposedGrid = currentGrid[0].map((_, colIndex) =>
      currentGrid.map(row => row[colIndex])
    )
    const { grid: movedGrid, scoreIncrease, moved } = moveLeft(transposedGrid)
    const finalGrid = movedGrid[0].map((_, colIndex) =>
      movedGrid.map(row => row[colIndex])
    )
    return { grid: finalGrid, scoreIncrease, moved }
  }

  const moveDown = (currentGrid: Grid) => {
    const transposedGrid = currentGrid[0].map((_, colIndex) =>
      currentGrid.map(row => row[colIndex])
    )
    const rotatedGrid = transposedGrid.map(row => [...row].reverse())
    const { grid: movedGrid, scoreIncrease, moved } = moveLeft(rotatedGrid)
    const finalRotatedGrid = movedGrid.map(row => [...row].reverse())
    const finalGrid = finalRotatedGrid[0].map((_, colIndex) =>
      finalRotatedGrid.map(row => row[colIndex])
    )
    return { grid: finalGrid, scoreIncrease, moved }
  }

  const move = (direction: Direction) => {
    if (gameOver || won) return

    let result
    switch (direction) {
      case 'left': result = moveLeft(grid); break
      case 'right': result = moveRight(grid); break
      case 'up': result = moveUp(grid); break
      case 'down': result = moveDown(grid); break
    }

    if (result.moved) {
      // Add slide animation class
      setAnimatingCells(new Set(Array.from({ length: 16 }, (_, i) => `${Math.floor(i / 4)}-${i % 4}`)))

      setTimeout(() => {
        const newGrid = addRandomTile(result.grid)
        setGrid(newGrid)
        setScore(prev => prev + result.scoreIncrease)

        // Check for 2048 win condition
        if (!won && newGrid.some(row => row.some(cell => cell === 2048))) {
          setWon(true)
        }

        // Clear animations
        setAnimatingCells(new Set())

        // Check for game over
        setTimeout(() => {
          const hasEmptyCell = newGrid.some(row => row.some(cell => cell === null))
          const canMove = !hasEmptyCell && [
            moveLeft(newGrid).moved,
            moveRight(newGrid).moved,
            moveUp(newGrid).moved,
            moveDown(newGrid).moved
          ].some(Boolean)

          if (!hasEmptyCell && !canMove) {
            setGameOver(true)
          }
        }, 100)
      }, 150)

      // Haptic feedback
      if ('vibrate' in navigator) {
        navigator.vibrate(30)
      }
    }
  }

  // Touch handlers are now handled by MobileFriendlyWrapper

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameOver) return

      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault()
          move('left')
          break
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault()
          move('right')
          break
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault()
          move('up')
          break
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault()
          move('down')
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [gameOver])

  const getTileColor = (value: number | null) => {
    if (!value) return 'bg-gray-100 border-2 border-gray-200'
    const colors: { [key: number]: string } = {
      2: 'bg-gradient-to-br from-blue-100 to-blue-200 text-blue-800 border-2 border-blue-300',
      4: 'bg-gradient-to-br from-blue-200 to-blue-300 text-blue-900 border-2 border-blue-400',
      8: 'bg-gradient-to-br from-green-200 to-green-300 text-green-900 border-2 border-green-400',
      16: 'bg-gradient-to-br from-green-300 to-green-400 text-white border-2 border-green-500',
      32: 'bg-gradient-to-br from-yellow-300 to-yellow-400 text-yellow-900 border-2 border-yellow-500',
      64: 'bg-gradient-to-br from-yellow-400 to-orange-400 text-white border-2 border-orange-500',
      128: 'bg-gradient-to-br from-orange-400 to-orange-500 text-white border-2 border-orange-600',
      256: 'bg-gradient-to-br from-orange-500 to-red-500 text-white border-2 border-red-600',
      512: 'bg-gradient-to-br from-red-500 to-red-600 text-white border-2 border-red-700',
      1024: 'bg-gradient-to-br from-purple-500 to-purple-600 text-white border-2 border-purple-700',
      2048: 'bg-gradient-to-br from-purple-600 to-pink-600 text-white border-2 border-pink-700 animate-pulse'
    }
    return colors[value] || 'bg-gradient-to-br from-pink-500 to-purple-500 text-white border-2 border-purple-600'
  }

  const getTileSize = (value: number | null) => {
    if (!value) return 'text-lg'
    if (value >= 1000) return 'text-sm'
    if (value >= 100) return 'text-base'
    return 'text-lg'
  }

  return (
    <div className="mobile-container min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-blue-900">
      <div className="max-w-md mx-auto pb-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 px-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="touch-manipulation"
          >
            ← Back
          </Button>
          <h2 className="mobile-heading font-bold text-blue-800 dark:text-blue-200">
            2048 Puzzle
          </h2>
          <Button
            onClick={initializeGame}
            variant="outline"
            size="sm"
            className="touch-manipulation"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        {/* Score Cards */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Card className="p-3 text-center bg-white/90 shadow-sm">
            <div className="text-xs text-gray-500 mb-1">Score</div>
            <div className="text-lg font-bold text-blue-600">{score}</div>
          </Card>
          <Card className="p-3 text-center bg-white/90 shadow-sm">
            <div className="text-xs text-gray-500 mb-1">Best</div>
            <div className="text-lg font-bold text-purple-600">{bestScore}</div>
          </Card>
        </div>

        {/* Game Status */}
        {won && (
          <Card className="p-4 mb-4 bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-300">
            <div className="text-center">
              <div className="text-2xl mb-2">🎉</div>
              <h3 className="font-bold text-orange-800 text-sm mb-1">You Won!</h3>
              <p className="text-xs text-orange-700 mb-3">You reached 2048! Keep playing for a higher score.</p>
              <Button
                onClick={initializeGame}
                size="sm"
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                New Game
              </Button>
            </div>
          </Card>
        )}

        {gameOver && (
          <Card className="p-4 mb-4 bg-gradient-to-r from-red-100 to-pink-100 border border-red-300">
            <div className="text-center">
              <div className="text-2xl mb-2">💔</div>
              <h3 className="font-bold text-red-800 text-sm mb-1">Game Over</h3>
              <p className="text-xs text-red-700 mb-3">No more moves available. Try again!</p>
              <Button
                onClick={initializeGame}
                size="sm"
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Try Again
              </Button>
            </div>
          </Card>
        )}

        {/* Game Grid */}
        <Card className="p-4 mb-4 bg-white/95 shadow-lg">
          <MobileFriendlyWrapper
            className="grid grid-cols-4 gap-3 select-none"
            onSwipe={(swipe) => {
              if (swipe.direction) {
                move(swipe.direction as Direction)
              }
            }}
          >
            {grid.flat().map((cell, index) => {
              const row = Math.floor(index / 4)
              const col = index % 4
              const cellKey = `${row}-${col}`
              const isAnimating = animatingCells.has(cellKey)

              return (
                <div
                  key={`${row}-${col}`}
                  className={`
                    aspect-square rounded-xl flex items-center justify-center font-bold
                    transition-all duration-300 ease-out ${getTileColor(cell)} ${getTileSize(cell)}
                    ${isAnimating ? 'transform scale-105' : ''}
                    ${cell ? 'shadow-lg' : 'shadow-inner'}
                  `}
                  style={{
                    minHeight: '70px',
                    transform: isAnimating ? 'scale(1.05)' : 'scale(1)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  {cell && (
                    <span className={`transition-all duration-200 font-extrabold ${cell > 999 ? 'text-xs' : cell > 99 ? 'text-sm' : 'text-lg'}`}>
                      {cell}
                    </span>
                  )}
                </div>
              )
            })}
          </MobileFriendlyWrapper>
        </Card>

        {/* Control Buttons - Optional for devices without good swipe support */}
        <div className="grid grid-cols-3 gap-2 mb-4 opacity-60">
          <div></div>
          <Button
            onClick={() => move('up')}
            variant="ghost"
            size="sm"
            className="touch-manipulation aspect-square border border-gray-300"
            disabled={gameOver}
          >
            <ArrowUp className="w-4 h-4" />
          </Button>
          <div></div>

          <Button
            onClick={() => move('left')}
            variant="ghost"
            size="sm"
            className="touch-manipulation aspect-square border border-gray-300"
            disabled={gameOver}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>

          <div className="flex items-center justify-center">
            <span className="text-xs text-gray-500">Swipe or tap</span>
          </div>

          <Button
            onClick={() => move('right')}
            variant="ghost"
            size="sm"
            className="touch-manipulation aspect-square border border-gray-300"
            disabled={gameOver}
          >
            <ArrowRight className="w-4 h-4" />
          </Button>

          <div></div>
          <Button
            onClick={() => move('down')}
            variant="ghost"
            size="sm"
            className="touch-manipulation aspect-square border border-gray-300"
            disabled={gameOver}
          >
            <ArrowDown className="w-4 h-4" />
          </Button>
          <div></div>
        </div>

        {/* Benefits Card */}
        <Card className="p-3 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200">
          <div className="text-center">
            <div className="text-lg mb-1">🧠</div>
            <h4 className="font-semibold text-sm text-green-800 mb-1">Cognitive Benefits</h4>
            <div className="flex justify-center space-x-3 text-xs">
              <span className="text-green-600">🎯 Focus</span>
              <span className="text-blue-600">🧩 Logic</span>
              <span className="text-purple-600">⚡ Strategy</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}