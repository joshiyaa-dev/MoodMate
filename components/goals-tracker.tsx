"use client"

import React, { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Plus, Target, CheckCircle, Circle, Calendar, Trophy, Star } from "lucide-react"

interface Goal {
  id: string
  title: string
  description: string
  category: "health" | "personal" | "career" | "relationships" | "learning"
  targetDate: string
  progress: number
  completed: boolean
  createdAt: number
  milestones: string[]
  completedMilestones: string[]
}

interface GoalsTrackerProps {
  onBack: () => void
}

export default function GoalsTracker({ onBack }: GoalsTrackerProps) {
  const [goals, setGoals] = useState<Goal[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    category: "personal" as Goal["category"],
    targetDate: "",
    milestones: [""]
  })

  useEffect(() => {
    const savedGoals = localStorage.getItem("user_goals")
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("user_goals", JSON.stringify(goals))
  }, [goals])

  const addGoal = () => {
    if (!newGoal.title.trim()) return

    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal.title,
      description: newGoal.description,
      category: newGoal.category,
      targetDate: newGoal.targetDate,
      progress: 0,
      completed: false,
      createdAt: Date.now(),
      milestones: newGoal.milestones.filter(m => m.trim()),
      completedMilestones: []
    }

    setGoals(prev => [...prev, goal])
    setNewGoal({
      title: "",
      description: "",
      category: "personal",
      targetDate: "",
      milestones: [""]
    })
    setShowAddForm(false)
  }

  const toggleMilestone = (goalId: string, milestone: string) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id === goalId) {
        const isCompleted = goal.completedMilestones.includes(milestone)
        const completedMilestones = isCompleted
          ? goal.completedMilestones.filter(m => m !== milestone)
          : [...goal.completedMilestones, milestone]
        
        const progress = Math.round((completedMilestones.length / goal.milestones.length) * 100)
        const completed = progress === 100

        return {
          ...goal,
          completedMilestones,
          progress,
          completed
        }
      }
      return goal
    }))
  }

  const getCategoryColor = (category: Goal["category"]) => {
    const colors = {
      health: "bg-green-100 text-green-800",
      personal: "bg-blue-100 text-blue-800",
      career: "bg-purple-100 text-purple-800",
      relationships: "bg-pink-100 text-pink-800",
      learning: "bg-yellow-100 text-yellow-800"
    }
    return colors[category]
  }

  const getCategoryIcon = (category: Goal["category"]) => {
    const icons = {
      health: "💪",
      personal: "🌟",
      career: "💼",
      relationships: "❤️",
      learning: "📚"
    }
    return icons[category]
  }

  const completedGoals = goals.filter(g => g.completed).length
  const totalGoals = goals.length

  return (
    <div className="mobile-container min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-md mx-auto pb-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 px-2">
          <Button variant="ghost" size="sm" onClick={onBack} className="touch-manipulation">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="text-center flex-1 mx-2">
            <h1 className="mobile-heading font-bold text-gray-800 dark:text-white">Goals Tracker</h1>
            <p className="mobile-subtext text-gray-600 dark:text-gray-300">Set and achieve your dreams</p>
          </div>
          <Button size="sm" onClick={() => setShowAddForm(true)} className="touch-manipulation">
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Stats */}
        <Card className="mobile-card mb-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold mobile-text">Your Progress</h3>
              <p className="mobile-subtext opacity-90">{completedGoals} of {totalGoals} goals completed</p>
            </div>
            <div className="text-right flex-shrink-0">
              <Trophy className="w-6 h-6 mb-1" />
              <p className="mobile-subtext">Keep going!</p>
            </div>
          </div>
        </Card>

      {/* Add Goal Form */}
      {showAddForm && (
        <Card className="mobile-card mb-4">
          <h3 className="font-semibold mb-3 mobile-text">Add New Goal</h3>
          <div className="space-y-3">
            <Input
              placeholder="Goal title"
              value={newGoal.title}
              onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
              className="mobile-input"
            />
            <Textarea
              placeholder="Description (optional)"
              value={newGoal.description}
              onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="mobile-input"
            />
            <select
              className="w-full p-3 border rounded-md mobile-text touch-manipulation"
              value={newGoal.category}
              onChange={(e) => setNewGoal(prev => ({ ...prev, category: e.target.value as Goal["category"] }))}
            >
              <option value="personal">Personal</option>
              <option value="health">Health</option>
              <option value="career">Career</option>
              <option value="relationships">Relationships</option>
              <option value="learning">Learning</option>
            </select>
            <Input
              type="date"
              value={newGoal.targetDate}
              onChange={(e) => setNewGoal(prev => ({ ...prev, targetDate: e.target.value }))}
              className="mobile-input"
            />
            <div>
              <label className="mobile-subtext font-medium">Milestones</label>
              {newGoal.milestones.map((milestone, index) => (
                <Input
                  key={index}
                  placeholder={`Milestone ${index + 1}`}
                  value={milestone}
                  onChange={(e) => {
                    const milestones = [...newGoal.milestones]
                    milestones[index] = e.target.value
                    setNewGoal(prev => ({ ...prev, milestones }))
                  }}
                  className="mt-2 mobile-input"
                />
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setNewGoal(prev => ({ ...prev, milestones: [...prev.milestones, ""] }))}
                className="mt-2 touch-manipulation mobile-subtext"
              >
                Add Milestone
              </Button>
            </div>
            <div className="flex space-x-2">
              <Button onClick={addGoal} className="flex-1 touch-manipulation">Add Goal</Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)} className="touch-manipulation">Cancel</Button>
            </div>
          </div>
        </Card>
      )}

        {/* Goals List */}
        <div className="space-y-4 pb-8">
          {goals.length === 0 ? (
            <Card className="p-8 text-center">
              <Target className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="font-semibold text-gray-600 dark:text-gray-300 mb-3 text-lg">No goals yet</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Start by setting your first goal!</p>
              <Button onClick={() => setShowAddForm(true)} className="mobile-button">
                <Plus className="w-4 h-4 mr-2" />
                Add Goal
              </Button>
            </Card>
          ) : (
            goals.map(goal => (
              <Card key={goal.id} className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-base">{getCategoryIcon(goal.category)}</span>
                    <h3 className={`font-semibold mobile-text truncate ${goal.completed ? 'line-through text-gray-500' : ''}`}>
                      {goal.title}
                    </h3>
                    {goal.completed && <Star className="w-3 h-3 text-yellow-500 flex-shrink-0" />}
                  </div>
                  <Badge className={getCategoryColor(goal.category)} variant="secondary">
                    <span className="text-xs">{goal.category}</span>
                  </Badge>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <p className="text-xs font-medium">{goal.progress}%</p>
                  {goal.targetDate && (
                    <p className="text-xs text-gray-500 flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(goal.targetDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>

              {goal.description && (
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">{goal.description}</p>
              )}

              <Progress value={goal.progress} className="mb-3 h-2" />

              <div className="space-y-2">
                <h4 className="text-xs font-medium">Milestones:</h4>
                {goal.milestones.map((milestone, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 cursor-pointer active:scale-95"
                    onClick={() => toggleMilestone(goal.id, milestone)}
                  >
                    {goal.completedMilestones.includes(milestone) ? (
                      <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                    ) : (
                      <Circle className="w-3 h-3 text-gray-400 flex-shrink-0" />
                    )}
                    <span className={`text-xs ${goal.completedMilestones.includes(milestone) ? 'line-through text-gray-500' : ''}`}>
                      {milestone}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}