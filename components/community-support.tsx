"use client"

import React, { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Users, Heart, MessageCircle, Phone, Globe, BookOpen, Shield, Star, Search, Filter, Plus, MapPin, Clock, Bookmark, Share2, ThumbsUp, MessageSquare, Video, Mic, Calendar } from "lucide-react"

interface CommunityResource {
  id: string
  title: string
  description: string
  type: "hotline" | "website" | "app" | "community" | "article" | "forum" | "group" | "event"
  category: "crisis" | "support" | "therapy" | "peer" | "education" | "wellness" | "local"
  contact?: string
  website?: string
  rating: number
  available24h?: boolean
  location?: string
  language?: string[]
  cost?: "free" | "paid" | "sliding-scale"
  lastActive?: string
  memberCount?: number
  tags?: string[]
}

interface CommunityPost {
  id: string
  author: string
  title: string
  content: string
  category: string
  timestamp: string
  likes: number
  replies: number
  isAnonymous: boolean
  tags: string[]
}

interface SupportGroup {
  id: string
  name: string
  description: string
  type: "online" | "in-person" | "hybrid"
  schedule: string
  memberCount: number
  isOpen: boolean
  nextMeeting?: string
  facilitator?: string
}

interface CommunitySupportProps {
  onBack: () => void
}

export default function CommunitySupport({ onBack }: CommunitySupportProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [currentView, setCurrentView] = useState<"resources" | "community" | "groups" | "posts">("resources")
  const [searchQuery, setSearchQuery] = useState("")
  const [bookmarkedResources, setBookmarkedResources] = useState<string[]>([])
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category: "support",
    isAnonymous: true,
    tags: [] as string[]
  })

  useEffect(() => {
    const saved = localStorage.getItem("bookmarked_resources")
    if (saved) {
      setBookmarkedResources(JSON.parse(saved))
    }
  }, [])

  const toggleBookmark = (resourceId: string) => {
    const updated = bookmarkedResources.includes(resourceId)
      ? bookmarkedResources.filter(id => id !== resourceId)
      : [...bookmarkedResources, resourceId]
    
    setBookmarkedResources(updated)
    localStorage.setItem("bookmarked_resources", JSON.stringify(updated))
  }

  const resources: CommunityResource[] = [
    // Indian National Crisis Support
    {
      id: "1",
      title: "National Suicide Prevention Helpline (India)",
      description: "24/7 crisis support and suicide prevention helpline for India.",
      type: "hotline",
      category: "crisis",
      contact: "9152987821",
      rating: 5,
      available24h: true,
      language: ["Hindi", "English"],
      cost: "free",
      tags: ["crisis", "suicide prevention", "national"]
    },
    {
      id: "2",
      title: "Vandrevala Foundation Helpline",
      description: "Free 24/7 mental health support and crisis intervention.",
      type: "hotline",
      category: "crisis",
      contact: "9999666555",
      rating: 5,
      available24h: true
    },
    {
      id: "3",
      title: "KIRAN Mental Health Helpline",
      description: "Government of India's 24/7 toll-free mental health helpline.",
      type: "hotline",
      category: "crisis",
      contact: "1800-599-0019",
      rating: 5,
      available24h: true
    },
    {
      id: "4",
      title: "Tamil Nadu Health Helpline",
      description: "Tamil Nadu Government health and mental wellness support.",
      type: "hotline",
      category: "support",
      contact: "104",
      rating: 5,
      available24h: true
    },
    {
      id: "5",
      title: "Sneha India Foundation",
      description: "Chennai-based suicide prevention and emotional support center.",
      type: "hotline",
      category: "crisis",
      contact: "044-24640050",
      rating: 5,
      available24h: true
    },
    {
      id: "6",
      title: "Fortis Stress Helpline",
      description: "Professional mental health support and counseling.",
      type: "hotline",
      category: "therapy",
      contact: "8376804102",
      rating: 4
    },
    {
      id: "7",
      title: "Mpower 1on1",
      description: "Online therapy and counseling platform for India.",
      type: "website",
      category: "therapy",
      website: "https://www.mpowerminds.com",
      rating: 4
    },
    {
      id: "8",
      title: "YourDOST",
      description: "Online emotional wellness coaching and counseling.",
      type: "website",
      category: "support",
      website: "https://yourdost.com",
      rating: 4
    },
    {
      id: "9",
      title: "Manastha",
      description: "Mental health awareness and support community.",
      type: "community",
      category: "peer",
      website: "https://manastha.com",
      rating: 4
    },
    {
      id: "10",
      title: "NIMHANS Helpline",
      description: "National Institute of Mental Health support services.",
      type: "hotline",
      category: "therapy",
      contact: "080-26995000",
      rating: 5
    },
    {
      id: "11",
      title: "Roshni Helpline",
      description: "Hyderabad-based suicide prevention helpline.",
      type: "hotline",
      category: "crisis",
      contact: "040-66202000",
      rating: 5,
      available24h: true
    },
    {
      id: "12",
      title: "Sahai Helpline",
      description: "Bangalore-based emotional support and crisis intervention.",
      type: "hotline",
      category: "crisis",
      contact: "080-25497777",
      rating: 5,
      available24h: true
    },
    {
      id: "13",
      title: "Jeevan Aastha Helpline",
      description: "Mumbai-based suicide prevention and mental health support.",
      type: "hotline",
      category: "crisis",
      contact: "022-25521111",
      rating: 5,
      available24h: true
    },
    {
      id: "14",
      title: "Sumaitri Helpline",
      description: "Delhi-based emotional support and befriending service.",
      type: "hotline",
      category: "support",
      contact: "011-23389090",
      rating: 5,
      available24h: true
    },
    {
      id: "15",
      title: "Parivarthan Counselling",
      description: "Professional counseling and therapy services.",
      type: "website",
      category: "therapy",
      website: "https://parivarthan.org",
      rating: 4
    }
  ]

  const categories = [
    { id: "all", name: "All", icon: "🌟" },
    { id: "crisis", name: "Crisis", icon: "🚨" },
    { id: "support", name: "Support", icon: "💙" },
    { id: "therapy", name: "Therapy", icon: "🗣️" },
    { id: "peer", name: "Peer Support", icon: "👥" },
    { id: "education", name: "Education", icon: "📚" },
    { id: "wellness", name: "Wellness", icon: "🌱" },
    { id: "local", name: "Local", icon: "📍" }
  ]

  const supportGroups: SupportGroup[] = [
    {
      id: "1",
      name: "Anxiety Support Circle",
      description: "A safe space to share experiences and coping strategies for anxiety management.",
      type: "online",
      schedule: "Every Tuesday 7:00 PM IST",
      memberCount: 24,
      isOpen: true,
      nextMeeting: "2024-01-23T19:00:00",
      facilitator: "Dr. Priya Sharma"
    },
    {
      id: "2",
      name: "Depression Recovery Group",
      description: "Peer support group focused on recovery and building resilience.",
      type: "hybrid",
      schedule: "Fridays 6:00 PM IST",
      memberCount: 18,
      isOpen: true,
      nextMeeting: "2024-01-26T18:00:00",
      facilitator: "Counselor Raj Kumar"
    },
    {
      id: "3",
      name: "Mindfulness & Meditation",
      description: "Practice mindfulness together and learn meditation techniques.",
      type: "online",
      schedule: "Daily 6:30 AM IST",
      memberCount: 45,
      isOpen: true,
      nextMeeting: "2024-01-23T06:30:00"
    }
  ]

  const communityPosts: CommunityPost[] = [
    {
      id: "1",
      author: "Anonymous",
      title: "Dealing with work stress - need advice",
      content: "I've been struggling with overwhelming work pressure lately. How do you all manage stress?",
      category: "support",
      timestamp: "2 hours ago",
      likes: 12,
      replies: 8,
      isAnonymous: true,
      tags: ["stress", "work", "advice"]
    },
    {
      id: "2",
      author: "MindfulSoul",
      title: "Gratitude practice changed my life",
      content: "Started a daily gratitude journal 3 months ago. The positive impact has been incredible!",
      category: "wellness",
      timestamp: "5 hours ago",
      likes: 28,
      replies: 15,
      isAnonymous: false,
      tags: ["gratitude", "mindfulness", "success-story"]
    },
    {
      id: "3",
      author: "Anonymous",
      title: "Local support groups in Mumbai?",
      content: "Looking for in-person support groups in Mumbai area. Any recommendations?",
      category: "local",
      timestamp: "1 day ago",
      likes: 5,
      replies: 12,
      isAnonymous: true,
      tags: ["mumbai", "local", "support-groups"]
    }
  ]

  const viewTabs = [
    { id: "resources", name: "Resources", icon: <BookOpen className="w-4 h-4" /> },
    { id: "community", name: "Community", icon: <MessageSquare className="w-4 h-4" /> },
    { id: "groups", name: "Groups", icon: <Users className="w-4 h-4" /> },
    { id: "posts", name: "Posts", icon: <MessageCircle className="w-4 h-4" /> }
  ]

  const filteredResources = selectedCategory === "all" 
    ? resources.filter(r => 
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : resources.filter(r => 
        r.category === selectedCategory &&
        (r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
         r.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )

  const filteredPosts = communityPosts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const getTypeIcon = (type: CommunityResource["type"]) => {
    const icons = {
      hotline: <Phone className="w-4 h-4" />,
      website: <Globe className="w-4 h-4" />,
      app: <MessageCircle className="w-4 h-4" />,
      community: <Users className="w-4 h-4" />,
      article: <BookOpen className="w-4 h-4" />,
      forum: <MessageSquare className="w-4 h-4" />,
      group: <Users className="w-4 h-4" />,
      event: <Calendar className="w-4 h-4" />
    }
    return icons[type] || <BookOpen className="w-4 h-4" />
  }

  const getTypeColor = (type: CommunityResource["type"]) => {
    const colors = {
      hotline: "bg-red-100 text-red-800",
      website: "bg-blue-100 text-blue-800",
      app: "bg-green-100 text-green-800",
      community: "bg-purple-100 text-purple-800",
      article: "bg-yellow-100 text-yellow-800",
      forum: "bg-indigo-100 text-indigo-800",
      group: "bg-pink-100 text-pink-800",
      event: "bg-orange-100 text-orange-800"
    }
    return colors[type]
  }

  const getCategoryColor = (category: CommunityResource["category"]) => {
    const colors = {
      crisis: "bg-red-100 text-red-800",
      support: "bg-blue-100 text-blue-800",
      therapy: "bg-green-100 text-green-800",
      peer: "bg-purple-100 text-purple-800",
      education: "bg-yellow-100 text-yellow-800",
      wellness: "bg-teal-100 text-teal-800",
      local: "bg-gray-100 text-gray-800"
    }
    return colors[category]
  }

  return (
    <div className="mobile-container min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-md mx-auto pb-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 px-2">
          <Button variant="ghost" size="sm" onClick={onBack} className="touch-manipulation">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="text-center flex-1 mx-2">
            <h1 className="mobile-heading font-bold text-gray-800 dark:text-white">Community Support</h1>
            <p className="mobile-subtext text-gray-600 dark:text-gray-300">You're not alone in this journey</p>
          </div>
          <div className="w-8" />
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-4 bg-white dark:bg-gray-800 rounded-lg p-1">
          {viewTabs.map(tab => (
            <Button
              key={tab.id}
              variant={currentView === tab.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setCurrentView(tab.id as any)}
              className="flex-1 mobile-subtext touch-manipulation"
            >
              {tab.icon}
              <span className="ml-1">{tab.name}</span>
            </Button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder={`Search ${currentView}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 mobile-input"
          />
        </div>

        {/* Emergency Notice */}
        <Card className="mobile-card mb-4 bg-gradient-to-r from-red-500 to-pink-600 text-white">
          <div className="flex items-center space-x-3">
            <Shield className="mobile-icon flex-shrink-0" />
            <div className="min-w-0">
              <h3 className="font-semibold mobile-text">In Crisis?</h3>
              <p className="text-xs opacity-90">Call 9152987821 or KIRAN 1800-599-0019</p>
            </div>
          </div>
        </Card>

        {/* Content based on current view */}
        {currentView === "resources" && (
          <>
            {/* Category Filter */}
            <div className="flex space-x-1 mb-4 overflow-x-auto pb-2">
              {categories.map(category => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="whitespace-nowrap mobile-button text-xs"
                >
                  <span className="mr-1">{category.icon}</span>
                  {category.name}
                </Button>
              ))}
            </div>

            {/* Resources List */}
            <div className="space-y-4 pb-8">
              {filteredResources.map(resource => (
                <Card key={resource.id} className="p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold mobile-text truncate">{resource.title}</h3>
                        {resource.available24h && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs flex-shrink-0">
                            24/7
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleBookmark(resource.id)}
                          className="p-1 h-auto"
                        >
                          <Bookmark 
                            className={`w-3 h-3 ${bookmarkedResources.includes(resource.id) ? 'fill-current text-yellow-500' : 'text-gray-400'}`}
                          />
                        </Button>
                      </div>
                      <div className="flex items-center space-x-1 mb-2 flex-wrap">
                        <Badge className={getTypeColor(resource.type)} variant="secondary">
                          <span className="mr-1">{getTypeIcon(resource.type)}</span>
                          <span className="text-xs">{resource.type}</span>
                        </Badge>
                        <Badge className={getCategoryColor(resource.category)} variant="secondary">
                          <span className="text-xs">{resource.category}</span>
                        </Badge>
                        {resource.cost && (
                          <Badge variant="outline" className="text-xs">
                            {resource.cost === "free" ? "🆓 Free" : resource.cost === "paid" ? "💳 Paid" : "💰 Sliding Scale"}
                          </Badge>
                        )}
                      </div>
                      {resource.language && (
                        <div className="flex items-center space-x-1 mb-2">
                          <Globe className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            {resource.language.join(", ")}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${i < resource.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">{resource.description}</p>

                  <div className="flex items-center justify-between">
                    {resource.contact && (
                      <div className="flex items-center space-x-2 min-w-0 flex-1">
                        <Phone className="w-3 h-3 text-gray-500 flex-shrink-0" />
                        <span className="text-xs font-medium truncate">{resource.contact}</span>
                      </div>
                    )}
                    <div className="flex space-x-1">
                      {resource.website && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(resource.website, '_blank')}
                          className="mobile-button text-xs flex-shrink-0"
                        >
                          <Globe className="w-3 h-3 mr-1" />
                          Visit
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (navigator.share) {
                            navigator.share({
                              title: resource.title,
                              text: resource.description,
                              url: resource.website || ''
                            })
                          }
                        }}
                        className="mobile-button text-xs p-2"
                      >
                        <Share2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        {currentView === "groups" && (
          <div className="space-y-4 pb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Support Groups</h2>
              <Badge variant="secondary" className="text-xs">
                {supportGroups.length} Active Groups
              </Badge>
            </div>
            
            {supportGroups.map(group => (
              <Card key={group.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold mobile-text">{group.name}</h3>
                      <Badge 
                        variant={group.isOpen ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {group.isOpen ? "Open" : "Closed"}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{group.description}</p>
                    
                    <div className="flex items-center space-x-3 text-xs text-gray-500 mb-2">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{group.schedule}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span>{group.memberCount} members</span>
                      </div>
                    </div>
                    
                    {group.facilitator && (
                      <p className="text-xs text-gray-600 mb-2">
                        <strong>Facilitator:</strong> {group.facilitator}
                      </p>
                    )}
                    
                    {group.nextMeeting && (
                      <div className="flex items-center space-x-1 text-xs text-green-600 mb-2">
                        <Video className="w-3 h-3" />
                        <span>Next meeting: {new Date(group.nextMeeting).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button size="sm" className="mobile-button text-xs flex-1">
                    Join Group
                  </Button>
                  <Button variant="outline" size="sm" className="mobile-button text-xs">
                    Learn More
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {currentView === "posts" && (
          <div className="space-y-4 pb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Community Posts</h2>
              <Button 
                size="sm" 
                onClick={() => setShowCreatePost(true)}
                className="mobile-button text-xs"
              >
                <Plus className="w-3 h-3 mr-1" />
                New Post
              </Button>
            </div>

            {filteredPosts.map(post => (
              <Card key={post.id} className="p-4">
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-800 dark:text-white">
                        {post.author}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {post.category}
                      </Badge>
                    </div>
                    <span className="text-xs text-gray-500">{post.timestamp}</span>
                  </div>
                  
                  <h3 className="font-semibold mobile-text mb-2">{post.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{post.content}</p>
                  
                  <div className="flex items-center space-x-1 mb-3">
                    {post.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="sm" className="p-1 h-auto">
                      <ThumbsUp className="w-3 h-3 mr-1" />
                      <span className="text-xs">{post.likes}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="p-1 h-auto">
                      <MessageCircle className="w-3 h-3 mr-1" />
                      <span className="text-xs">{post.replies}</span>
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm" className="p-1 h-auto">
                    <Share2 className="w-3 h-3" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {currentView === "community" && (
          <div className="space-y-6 pb-8">
            <Card className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
              <div className="text-center">
                <Users className="w-8 h-8 mx-auto mb-3 text-purple-500" />
                <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Join Our Community</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  Connect with others, share experiences, and find support in a safe environment.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <Button onClick={() => setCurrentView("groups")} className="mobile-button text-xs">
                    <Users className="w-3 h-3 mr-1" />
                    Join Groups
                  </Button>
                  <Button onClick={() => setCurrentView("posts")} variant="outline" className="mobile-button text-xs">
                    <MessageSquare className="w-3 h-3 mr-1" />
                    Browse Posts
                  </Button>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 text-center">
                <MessageCircle className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                <div className="text-lg font-bold text-gray-800 dark:text-white">150+</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Active Posts</div>
              </Card>
              <Card className="p-4 text-center">
                <Users className="w-6 h-6 mx-auto mb-2 text-green-500" />
                <div className="text-lg font-bold text-gray-800 dark:text-white">12</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Support Groups</div>
              </Card>
            </div>
          </div>
        )}

        {/* Create Post Modal */}
        {showCreatePost && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-lg max-h-[80vh] overflow-y-auto">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800 dark:text-white">Create New Post</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowCreatePost(false)}
                    className="p-1"
                  >
                    ✕
                  </Button>
                </div>
                
                <div className="space-y-3">
                  <Input
                    placeholder="Post title"
                    value={newPost.title}
                    onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                    className="text-sm"
                  />
                  
                  <textarea
                    placeholder="Share your thoughts, ask for advice, or offer support..."
                    value={newPost.content}
                    onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                    className="w-full p-2 border rounded-md text-sm min-h-[100px] resize-none"
                    rows={4}
                  />
                  
                  <select
                    value={newPost.category}
                    onChange={(e) => setNewPost(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full p-2 border rounded-md text-sm"
                  >
                    <option value="support">Support</option>
                    <option value="wellness">Wellness</option>
                    <option value="local">Local</option>
                    <option value="education">Education</option>
                  </select>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="anonymous"
                      checked={newPost.isAnonymous}
                      onChange={(e) => setNewPost(prev => ({ ...prev, isAnonymous: e.target.checked }))}
                    />
                    <label htmlFor="anonymous" className="text-sm text-gray-600 dark:text-gray-400">
                      Post anonymously
                    </label>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button className="flex-1 mobile-button text-xs">
                      Create Post
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowCreatePost(false)}
                      className="mobile-button text-xs"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}



        {/* Support Message */}
        <Card className="p-6 mt-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
          <div className="text-center">
            <Heart className="w-8 h-8 mx-auto mb-3 text-pink-500" />
            <h3 className="font-semibold text-gray-800 dark:text-white mb-3 text-lg">Remember</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Seeking help is a sign of strength, not weakness. You deserve support and care.
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}