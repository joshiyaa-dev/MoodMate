"use client"

import React, { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, CheckCircle, Circle, Calendar, Flame, Award, Clock, Target, TrendingUp, Edit3, Trash2, BarChart3, Star, Trophy } from "lucide-react"

interface Habit {
  id: string
  name: string
  description?: string
  category: "health" | "productivity" | "mindfulness" | "social" | "learning"
  frequency: "daily" | "weekly"
  streak: number
  bestStreak: number
  completedDates: string[]
  createdAt: number
  targetDays?: number
  priority: "low" | "medium" | "high"
  reminder?: string
  notes?: string[]
}

interface HabitsTrackerProps {
  onBack: () => void
}

export default function HabitsTracker({ onBack }: HabitsTrackerProps) {
  const [habits, setHabits] = useState<Habit[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingHabit, setEditingHabit] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"list" | "stats">("list")
  const [newHabit, setNewHabit] = useState({
    name: "",
    description: "",
    category: "health" as Habit["category"],
    frequency: "daily" as Habit["frequency"],
    priority: "medium" as Habit["priority"],
    targetDays: 30,
    reminder: ""
  })
  const [newNote, setNewNote] = useState("")

  useEffect(() => {
    const savedHabits = localStorage.getItem("user_habits")
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("user_habits", JSON.stringify(habits))
  }, [habits])

  const addHabit = () => {
    if (!newHabit.name.trim()) return

    const habit: Habit = {
      id: Date.now().toString(),
      name: newHabit.name,
      description: newHabit.description,
      category: newHabit.category,
      frequency: newHabit.frequency,
      priority: newHabit.priority,
      targetDays: newHabit.targetDays,
      reminder: newHabit.reminder,
      streak: 0,
      bestStreak: 0,
      completedDates: [],
      createdAt: Date.now(),
      notes: []
    }

    setHabits(prev => [...prev, habit])
    setNewHabit({
      name: "",
      description: "",
      category: "health",
      frequency: "daily",
      priority: "medium",
      targetDays: 30,
      reminder: ""
    })
    setShowAddForm(false)
  }

  const deleteHabit = (habitId: string) => {
    setHabits(prev => prev.filter(h => h.id !== habitId))
  }

  const addNote = (habitId: string) => {
    if (!newNote.trim()) return
    
    setHabits(prev => prev.map(habit => 
      habit.id === habitId 
        ? { ...habit, notes: [...(habit.notes || []), `${new Date().toLocaleDateString()}: ${newNote}`] }
        : habit
    ))
    setNewNote("")
  }

  const toggleHabit = (habitId: string) => {
    const today = new Date().toDateString()
    
    setHabits(prev => prev.map(habit => {
      if (habit.id === habitId) {
        const isCompleted = habit.completedDates.includes(today)
        let completedDates: string[]
        let streak = habit.streak

        if (isCompleted) {
          // Remove today's completion
          completedDates = habit.completedDates.filter(date => date !== today)
          streak = Math.max(0, streak - 1)
        } else {
          // Add today's completion
          completedDates = [...habit.completedDates, today]
          
          // Calculate new streak
          const yesterday = new Date()
          yesterday.setDate(yesterday.getDate() - 1)
          const yesterdayStr = yesterday.toDateString()
          
          if (habit.completedDates.includes(yesterdayStr) || streak === 0) {
            streak = streak + 1
          } else {
            streak = 1
          }
        }

        const bestStreak = Math.max(habit.bestStreak, streak)

        return {
          ...habit,
          completedDates,
          streak,
          bestStreak
        }
      }
      return habit
    }))
  }

  const getCategoryColor = (category: Habit["category"]) => {
    const colors = {
      health: "bg-green-100 text-green-800",
      productivity: "bg-blue-100 text-blue-800",
      mindfulness: "bg-purple-100 text-purple-800",
      social: "bg-pink-100 text-pink-800",
      learning: "bg-yellow-100 text-yellow-800"
    }
    return colors[category]
  }

  const getPriorityColor = (priority: Habit["priority"]) => {
    const colors = {
      low: "bg-gray-100 text-gray-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-red-100 text-red-800"
    }
    return colors[priority]
  }

  const getHabitStats = () => {
    const totalHabits = habits.length
    const completedToday = habits.filter(isCompletedToday).length
    const totalStreaks = habits.reduce((sum, habit) => sum + habit.streak, 0)
    const avgStreak = totalHabits > 0 ? Math.round(totalStreaks / totalHabits) : 0
    const longestStreak = Math.max(...habits.map(h => h.bestStreak), 0)
    
    return { totalHabits, completedToday, totalStreaks, avgStreak, longestStreak }
  }

  const getCategoryIcon = (category: Habit["category"]) => {
    const icons = {
      health: "💪",
      productivity: "⚡",
      mindfulness: "🧘",
      social: "👥",
      learning: "📚"
    }
    return icons[category]
  }

  const isCompletedToday = (habit: Habit) => {
    const today = new Date().toDateString()
    return habit.completedDates.includes(today)
  }

  const getWeeklyProgress = (habit: Habit) => {
    const today = new Date()
    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - today.getDay())
    
    let completed = 0
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart)
      date.setDate(weekStart.getDate() + i)
      if (habit.completedDates.includes(date.toDateString())) {
        completed++
      }
    }
    return completed
  }

  const stats = getHabitStats()

  return (
    <div className="mobile-container bg-gradient-to-br from-green-50 to-blue-100 dark:from-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="mobile-button">
          <ArrowLeft className="mobile-icon" />
        </Button>
        <div className="text-center flex-1 mx-2">
          <h1 className="text-lg font-bold text-gray-800 dark:text-white">Habits Tracker</h1>
          <p className="text-xs text-gray-600 dark:text-gray-300">Build positive daily routines</p>
        </div>
        <div className="flex space-x-1">
          <Button 
            size="sm" 
            variant={viewMode === "stats" ? "default" : "outline"} 
            onClick={() => setViewMode(viewMode === "list" ? "stats" : "list")} 
            className="mobile-button p-2"
          >
            <BarChart3 className="w-3 h-3" />
          </Button>
          <Button size="sm" onClick={() => setShowAddForm(true)} className="mobile-button">
            <Plus className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Stats - Enhanced */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <Card className="mobile-card bg-gradient-to-r from-orange-400 to-red-500 text-white">
          <div className="flex items-center space-x-2">
            <Flame className="mobile-icon flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs opacity-90">Total Streaks</p>
              <p className="text-lg font-bold">{stats.totalStreaks}</p>
            </div>
          </div>
        </Card>
        <Card className="mobile-card bg-gradient-to-r from-green-400 to-blue-500 text-white">
          <div className="flex items-center space-x-2">
            <CheckCircle className="mobile-icon flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs opacity-90">Today</p>
              <p className="text-lg font-bold">{stats.completedToday}/{stats.totalHabits}</p>
            </div>
          </div>
        </Card>
        <Card className="mobile-card bg-gradient-to-r from-purple-400 to-pink-500 text-white">
          <div className="flex items-center space-x-2">
            <Trophy className="mobile-icon flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs opacity-90">Best Streak</p>
              <p className="text-lg font-bold">{stats.longestStreak}</p>
            </div>
          </div>
        </Card>
        <Card className="mobile-card bg-gradient-to-r from-indigo-400 to-purple-500 text-white">
          <div className="flex items-center space-x-2">
            <TrendingUp className="mobile-icon flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs opacity-90">Avg Streak</p>
              <p className="text-lg font-bold">{stats.avgStreak}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Enhanced Add Habit Form */}
      {showAddForm && (
        <Card className="mobile-card mb-4">
          <h3 className="font-semibold mb-3 mobile-text">Add New Habit</h3>
          <div className="space-y-3">
            <Input
              placeholder="Habit name (e.g., Drink 8 glasses of water)"
              value={newHabit.name}
              onChange={(e) => setNewHabit(prev => ({ ...prev, name: e.target.value }))}
              className="text-sm"
            />
            <Input
              placeholder="Description (optional)"
              value={newHabit.description}
              onChange={(e) => setNewHabit(prev => ({ ...prev, description: e.target.value }))}
              className="text-sm"
            />
            <div className="grid grid-cols-2 gap-2">
              <select
                className="w-full p-2 border rounded-md text-sm"
                value={newHabit.category}
                onChange={(e) => setNewHabit(prev => ({ ...prev, category: e.target.value as Habit["category"] }))}
              >
                <option value="health">💪 Health</option>
                <option value="productivity">⚡ Productivity</option>
                <option value="mindfulness">🧘 Mindfulness</option>
                <option value="social">👥 Social</option>
                <option value="learning">📚 Learning</option>
              </select>
              <select
                className="w-full p-2 border rounded-md text-sm"
                value={newHabit.priority}
                onChange={(e) => setNewHabit(prev => ({ ...prev, priority: e.target.value as Habit["priority"] }))}
              >
                <option value="low">🔵 Low Priority</option>
                <option value="medium">🟡 Medium Priority</option>
                <option value="high">🔴 High Priority</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <select
                className="w-full p-2 border rounded-md text-sm"
                value={newHabit.frequency}
                onChange={(e) => setNewHabit(prev => ({ ...prev, frequency: e.target.value as Habit["frequency"] }))}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
              <Input
                type="number"
                placeholder="Target days"
                value={newHabit.targetDays}
                onChange={(e) => setNewHabit(prev => ({ ...prev, targetDays: parseInt(e.target.value) || 30 }))}
                className="text-sm"
                min="1"
                max="365"
              />
            </div>
            <Input
              placeholder="Reminder time (e.g., 9:00 AM)"
              value={newHabit.reminder}
              onChange={(e) => setNewHabit(prev => ({ ...prev, reminder: e.target.value }))}
              className="text-sm"
            />
            <div className="flex space-x-2">
              <Button onClick={addHabit} className="flex-1 mobile-button">Add Habit</Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)} className="mobile-button">Cancel</Button>
            </div>
          </div>
        </Card>
      )}

      {/* Enhanced Habits List with Stats View */}
      {viewMode === "stats" ? (
        <div className="space-y-4">
          <Card className="mobile-card">
            <h3 className="font-semibold mb-3 mobile-text">Weekly Performance</h3>
            <div className="space-y-2">
              {habits.map(habit => (
                <div key={habit.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 flex-1">
                    <span className="text-sm">{getCategoryIcon(habit.category)}</span>
                    <span className="text-xs truncate flex-1">{habit.name}</span>
                  </div>
                  <div className="w-20 h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-green-400 to-blue-500"
                      style={{ width: `${(getWeeklyProgress(habit) / 7) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs ml-2 w-8 text-right">{getWeeklyProgress(habit)}/7</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      ) : (
        <div className="space-y-3">
          {habits.length === 0 ? (
            <Card className="mobile-card text-center">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="font-semibold text-gray-600 mb-2 mobile-text">No habits yet</h3>
              <p className="text-xs text-gray-500 mb-4">Start building positive routines!</p>
              <Button onClick={() => setShowAddForm(true)} className="mobile-button">
                <Plus className="w-3 h-3 mr-2" />
                Add Habit
              </Button>
            </Card>
          ) : (
            habits.map(habit => (
              <Card key={habit.id} className="mobile-card">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <Button
                      variant={isCompletedToday(habit) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleHabit(habit.id)}
                      className="mobile-button p-2 flex-shrink-0"
                    >
                      {isCompletedToday(habit) ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <Circle className="w-3 h-3" />
                      )}
                    </Button>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-base flex-shrink-0">{getCategoryIcon(habit.category)}</span>
                        <h3 className="font-semibold mobile-text truncate">{habit.name}</h3>
                      </div>
                      <div className="flex items-center space-x-1 flex-wrap">
                        <Badge className={getCategoryColor(habit.category)} variant="secondary">
                          <span className="text-xs">{habit.category}</span>
                        </Badge>
                        <Badge className={getPriorityColor(habit.priority)} variant="secondary">
                          <span className="text-xs">{habit.priority}</span>
                        </Badge>
                      </div>
                      {habit.description && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 truncate">{habit.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
                    <div className="text-right">
                      <div className="flex items-center space-x-1 text-orange-500">
                        <Flame className="w-3 h-3" />
                        <span className="font-bold text-sm">{habit.streak}</span>
                      </div>
                      <p className="text-xs text-gray-500">Best: {habit.bestStreak}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteHabit(habit.id)}
                      className="p-1 h-auto"
                    >
                      <Trash2 className="w-3 h-3 text-gray-400" />
                    </Button>
                  </div>
                </div>

                {/* Progress Bar for Target */}
                {habit.targetDays && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span>Progress to goal:</span>
                      <span>{habit.streak}/{habit.targetDays} days</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-400 to-pink-500 h-2 rounded-full transition-all"
                        style={{ width: `${Math.min((habit.streak / habit.targetDays) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {habit.frequency === "weekly" && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs">
                      <span>This week:</span>
                      <span>{getWeeklyProgress(habit)}/7 days</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all"
                        style={{ width: `${(getWeeklyProgress(habit) / 7) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Reminder */}
                {habit.reminder && (
                  <div className="mb-2 flex items-center space-x-1 text-xs text-gray-600">
                    <Clock className="w-3 h-3" />
                    <span>Reminder: {habit.reminder}</span>
                  </div>
                )}

                {/* Achievement Badges */}
                {habit.streak >= 7 && (
                  <div className="mb-2 flex items-center space-x-1 text-yellow-600">
                    <Award className="w-3 h-3" />
                    <span className="text-xs font-medium">
                      {habit.streak >= 100 ? "Legend!" : habit.streak >= 50 ? "Champion!" : habit.streak >= 30 ? "Habit Master!" : habit.streak >= 21 ? "Habit Builder!" : "Week Warrior!"}
                    </span>
                  </div>
                )}

                {/* Notes Section */}
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2 mb-2">
                    <Input
                      placeholder="Add a note..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      className="text-xs flex-1"
                      onKeyPress={(e) => e.key === 'Enter' && addNote(habit.id)}
                    />
                    <Button
                      size="sm"
                      onClick={() => addNote(habit.id)}
                      className="p-1 h-auto"
                      disabled={!newNote.trim()}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                  {habit.notes && habit.notes.length > 0 && (
                    <div className="space-y-1 max-h-20 overflow-y-auto">
                      {habit.notes.slice(-2).map((note, index) => (
                        <p key={index} className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded px-2 py-1">
                          {note}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  )
}