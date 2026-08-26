"use client"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RotateCcw, Target } from "lucide-react"
import { MobileFriendlyWrapper } from "../utils/mobile-touch-utils"

interface FocusLightMazeProps {
    onBack: () => void
}

interface Position {
    x: number
    y: number
}

export default function FocusLightMaze({ onBack }: FocusLightMazeProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [lightPosition, setLightPosition] = useState<Position>({ x: 25, y: 25 })
    const [trail, setTrail] = useState<Position[]>([])
    const [isComplete, setIsComplete] = useState(false)
    const [currentLevel, setCurrentLevel] = useState(1)
    const [isDragging, setIsDragging] = useState(false)

    const mazeSize = 300
    const cellSize = 25

    // Generate maze based on level (1000 levels)
    const generateMaze = (level: number) => {
        const rows = 12
        const cols = 12
        const maze = Array(rows).fill(null).map(() => Array(cols).fill(0))
        
        // Seeded random function for consistent maze generation per level
        const seededRandom = (seed: number) => {
            const x = Math.sin(seed) * 10000
            return x - Math.floor(x)
        }
        
        // Determine difficulty based on level
        const difficulty = Math.min(Math.floor((level - 1) / 100) + 1, 10) // 1-10 difficulty
        const wallDensity = 0.2 + (difficulty * 0.05) // More walls at higher levels
        const twistiness = difficulty * 0.1 // More complex paths
        
        // Generate walls with seeded randomness
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const seed = level * 1000 + row * cols + col
                if (seededRandom(seed) < wallDensity) {
                    maze[row][col] = 1
                }
            }
        }
        
        // Ensure start and end are clear
        maze[0][0] = 0 // Start
        maze[rows - 1][cols - 1] = 2 // Goal
        
        // Create some guaranteed paths for harder levels
        if (difficulty > 3) {
            // Vertical path variations
            for (let i = 0; i < rows; i++) {
                const pathCol = Math.floor(seededRandom(level * 100 + i) * cols)
                maze[i][pathCol] = 0
            }
            
            // Horizontal path variations  
            for (let j = 0; j < cols; j++) {
                const pathRow = Math.floor(seededRandom(level * 200 + j) * rows)
                maze[pathRow][j] = 0
            }
        }
        
        // Add spiral patterns for very high levels
        if (difficulty > 6) {
            const centerR = Math.floor(rows / 2)
            const centerC = Math.floor(cols / 2)
            const spiralRadius = Math.min(3, difficulty - 6)
            
            for (let r = 0; r < spiralRadius; r++) {
                for (let angle = 0; angle < 360; angle += 30) {
                    const spiralR = centerR + Math.floor(r * Math.cos(angle * Math.PI / 180))
                    const spiralC = centerC + Math.floor(r * Math.sin(angle * Math.PI / 180))
                    
                    if (spiralR >= 0 && spiralR < rows && spiralC >= 0 && spiralC < cols) {
                        if (seededRandom(level * 300 + angle) > 0.7) {
                            maze[spiralR][spiralC] = 1
                        }
                    }
                }
            }
        }
        
        // Ensure start position is always accessible
        maze[0][0] = 0
        maze[0][1] = 0
        maze[1][0] = 0
        
        // Ensure goal is accessible
        maze[rows - 1][cols - 1] = 2
        maze[rows - 1][cols - 2] = 0
        maze[rows - 2][cols - 1] = 0
        
        return maze
    }

    const currentMaze = generateMaze(currentLevel)

    useEffect(() => {
        drawMaze()
    }, [lightPosition, trail, currentLevel])

    const drawMaze = () => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Clear canvas
        ctx.fillStyle = '#1F2937' // Dark background
        ctx.fillRect(0, 0, mazeSize, mazeSize)

        // Draw maze
        for (let row = 0; row < currentMaze.length; row++) {
            for (let col = 0; col < currentMaze[row].length; col++) {
                const x = col * cellSize
                const y = row * cellSize

                if (currentMaze[row][col] === 1) {
                    // Wall
                    ctx.fillStyle = '#374151'
                    ctx.fillRect(x, y, cellSize, cellSize)
                } else if (currentMaze[row][col] === 2) {
                    // Goal
                    ctx.fillStyle = '#10B981'
                    ctx.fillRect(x, y, cellSize, cellSize)

                    // Goal glow effect
                    const gradient = ctx.createRadialGradient(
                        x + cellSize / 2, y + cellSize / 2, 0,
                        x + cellSize / 2, y + cellSize / 2, cellSize
                    )
                    gradient.addColorStop(0, 'rgba(16, 185, 129, 0.8)')
                    gradient.addColorStop(1, 'rgba(16, 185, 129, 0.1)')
                    ctx.fillStyle = gradient
                    ctx.fillRect(x, y, cellSize, cellSize)
                }
            }
        }

        // Draw trail
        if (trail.length > 1) {
            ctx.strokeStyle = 'rgba(59, 130, 246, 0.6)'
            ctx.lineWidth = 3
            ctx.lineCap = 'round'
            ctx.beginPath()

            for (let i = 0; i < trail.length; i++) {
                const point = trail[i]
                if (i === 0) {
                    ctx.moveTo(point.x, point.y)
                } else {
                    ctx.lineTo(point.x, point.y)
                }
            }
            ctx.stroke()
        }

        // Draw light dot
        const gradient = ctx.createRadialGradient(
            lightPosition.x, lightPosition.y, 0,
            lightPosition.x, lightPosition.y, 15
        )
        gradient.addColorStop(0, '#FBBF24')
        gradient.addColorStop(0.7, 'rgba(251, 191, 36, 0.8)')
        gradient.addColorStop(1, 'rgba(251, 191, 36, 0.1)')

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(lightPosition.x, lightPosition.y, 15, 0, 2 * Math.PI)
        ctx.fill()

        // Inner bright dot
        ctx.fillStyle = '#FEF3C7'
        ctx.beginPath()
        ctx.arc(lightPosition.x, lightPosition.y, 6, 0, 2 * Math.PI)
        ctx.fill()
    }

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDragging) return

        const canvas = canvasRef.current
        if (!canvas) return

        const rect = canvas.getBoundingClientRect()
        const newX = e.clientX - rect.left
        const newY = e.clientY - rect.top

        // Check if new position is valid (not in wall)
        const gridX = Math.floor(newX / cellSize)
        const gridY = Math.floor(newY / cellSize)

        if (gridX >= 0 && gridX < currentMaze[0].length &&
            gridY >= 0 && gridY < currentMaze.length &&
            currentMaze[gridY][gridX] !== 1) {

            setLightPosition({ x: newX, y: newY })
            setTrail(prev => [...prev, { x: newX, y: newY }].slice(-50)) // Keep last 50 points

            // Check if reached goal
            if (currentMaze[gridY][gridX] === 2) {
                setIsComplete(true)
            }
        }
    }

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        setIsDragging(true)
        handleMouseMove(e)
    }

    const handleMouseUp = () => {
        setIsDragging(false)
    }

    const resetMaze = () => {
        setLightPosition({ x: 25, y: 25 })
        setTrail([])
        setIsComplete(false)
    }

    const nextLevel = () => {
        if (currentLevel < 1000) {
            setCurrentLevel(prev => prev + 1)
            resetMaze()
        }
    }

    const prevLevel = () => {
        if (currentLevel > 1) {
            setCurrentLevel(prev => prev - 1)
            resetMaze()
        }
    }

    const jumpToLevel = (level: number) => {
        if (level >= 1 && level <= 1000) {
            setCurrentLevel(level)
            resetMaze()
        }
    }

    const getDifficultyName = (level: number) => {
        const difficulty = Math.min(Math.floor((level - 1) / 100) + 1, 10)
        const names = ["Beginner", "Easy", "Medium", "Hard", "Expert", "Master", "Legend", "Nightmare", "Impossible", "Godlike"]
        return names[difficulty - 1] || "Godlike"
    }

    return (
        <div className="mobile-container min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            <div className="max-w-md mx-auto pb-6">
                <div className="text-center mb-4 px-2">
                    <h3 className="mobile-heading font-semibold text-gray-800 dark:text-gray-100 mb-2">Focus Light Maze</h3>
                    <p className="mobile-subtext text-gray-600 dark:text-gray-300">Guide the light through the dark maze</p>
                </div>

                <Card className="mobile-card bg-gradient-to-br from-gray-50 to-blue-50">
                <div className="flex justify-between items-center mb-4">
                    <div className="mobile-subtext font-semibold">
                        Level: {currentLevel}/1000
                        <br />
                        <span className="text-xs text-blue-600">{getDifficultyName(currentLevel)}</span>
                    </div>
                    <div className="mobile-subtext font-semibold">Trail Length: {trail.length}</div>
                </div>

                {/* Canvas */}
                <div className="flex justify-center mb-4">
                    <div className="relative border-2 border-gray-300 rounded-lg overflow-hidden shadow-lg">
                        <canvas
                            ref={canvasRef}
                            width={280}
                            height={280}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                            onTouchStart={(e) => { e.preventDefault(); handleMouseDown(e as any) }}
                            onTouchMove={(e) => { e.preventDefault(); handleMouseMove(e as any) }}
                            onTouchEnd={(e) => { e.preventDefault(); handleMouseUp() }}
                            className="cursor-crosshair bg-gray-900 select-none touch-manipulation"
                            style={{ touchAction: 'none' }}
                        />

                        {isComplete && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <div className="bg-white p-4 rounded-lg text-center shadow-xl">
                                    <div className="text-3xl mb-2">🎯</div>
                                    <h4 className="mobile-text font-bold text-green-600 mb-2">Maze Complete!</h4>
                                    <p className="mobile-subtext text-gray-600 mb-3">Your focus guided you through!</p>
                                    <div className="flex space-x-2">
                                        {currentLevel < 1000 && (
                                            <Button onClick={nextLevel} className="bg-green-500 hover:bg-green-600 touch-manipulation mobile-subtext">
                                                Next Level
                                            </Button>
                                        )}
                                        <Button variant="outline" onClick={resetMaze} className="touch-manipulation mobile-subtext">
                                            Try Again
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Instructions */}
                <Card className="mobile-card bg-yellow-50 mb-4">
                    <div className="text-center">
                        <Target className="w-5 h-5 text-yellow-600 mx-auto mb-2" />
                        <h4 className="font-semibold text-yellow-800 mb-2 mobile-subtext">How to Play:</h4>
                        <p className="mobile-subtext text-yellow-700">
                            Drag the glowing light dot through the dark maze to reach the green goal.
                            Avoid the gray walls and focus on the path ahead.
                        </p>
                    </div>
                </Card>

                {/* Controls */}
                <div className="space-y-3">
                    <div className="grid grid-cols-4 gap-2">
                        <Button variant="outline" size="sm" onClick={() => jumpToLevel(1)} className="touch-manipulation mobile-subtext">
                            Level 1
                        </Button>
                        <Button variant="outline" size="sm" onClick={prevLevel} disabled={currentLevel === 1} className="touch-manipulation mobile-subtext">
                            -1
                        </Button>
                        <Button variant="outline" size="sm" onClick={nextLevel} disabled={currentLevel >= 1000} className="touch-manipulation mobile-subtext">
                            +1
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => jumpToLevel(Math.min(1000, currentLevel + 10))} className="touch-manipulation mobile-subtext">
                            +10
                        </Button>
                    </div>
                    
                    <div className="flex justify-center">
                        <Button variant="outline" onClick={resetMaze} className="touch-manipulation">
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Reset
                        </Button>
                    </div>
                    
                    <div className="flex justify-center">
                        <div className="flex items-center space-x-2">
                            <span className="mobile-subtext text-gray-600">Jump to level:</span>
                            <input
                                type="number"
                                min="1"
                                max="1000"
                                value={currentLevel}
                                onChange={(e) => jumpToLevel(parseInt(e.target.value) || 1)}
                                className="w-16 px-2 py-2 mobile-subtext border rounded text-center touch-manipulation"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="mobile-subtext text-blue-800 text-center">
                        <strong>🔦 Benefits:</strong> Sharpens concentration • Reduces intrusive thoughts • Improves focus control • Visual tracking
                    </p>
                </div>
            </Card>
            </div>
        </div>
    )
}