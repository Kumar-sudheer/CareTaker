"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Heart,
  Brain,
  Phone,
  AlertTriangle,
  Plus,
  Trash2,
  Activity,
  MessageCircle,
  Clock,
  User,
  X,
  Send,
  TrendingUp,
  BarChart3,
  PieChartIcon,
} from "lucide-react"

interface EmotionEntry {
  id: string
  keywords: string[]
  mood: string
  notes: string
  timestamp: Date
  riskLevel: "low" | "medium" | "high"
}

interface EmergencyContact {
  id: string
  name: string
  phone: string
  relationship: string
}

interface HealthMetrics {
  heartRate?: number
  bloodPressure?: string
  temperature?: number
  lastUpdated: Date
}

interface ChatMessage {
  id: string
  message: string
  isBot: boolean
  timestamp: Date
}

export default function CaretakerApp() {
  const [emotionEntries, setEmotionEntries] = useState<EmotionEntry[]>([])
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([
    { id: "1", name: "Dr. Smith", phone: "+1-555-0123", relationship: "Primary Doctor" },
    { id: "2", name: "Sarah Johnson", phone: "+1-555-0456", relationship: "Daughter" },
  ])
  const [healthMetrics, setHealthMetrics] = useState<HealthMetrics>({
    heartRate: 72,
    bloodPressure: "120/80",
    temperature: 98.6,
    lastUpdated: new Date(),
  })
  const [currentMood, setCurrentMood] = useState("")
  const [currentKeywords, setCurrentKeywords] = useState("")
  const [currentNotes, setCurrentNotes] = useState("")
  const [newContact, setNewContact] = useState({ name: "", phone: "", relationship: "" })
  const [alerts, setAlerts] = useState<string[]>([])
  const [queryMessage, setQueryMessage] = useState("")
  const [queryEmail, setQueryEmail] = useState("")
  const [querySubmitted, setQuerySubmitted] = useState(false)
  const [selectedDashboardSection, setSelectedDashboardSection] = useState("overview")

  // Chat system states
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      message: "Hi there! 👋 I'm your CareTaker assistant. How are you feeling today?",
      isBot: true,
      timestamp: new Date(),
    },
  ])
  const [currentChatMessage, setCurrentChatMessage] = useState("")

  // Animation states
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Sample chart data
  const heartRateData = [
    { time: "6 AM", rate: 68 },
    { time: "9 AM", rate: 72 },
    { time: "12 PM", rate: 75 },
    { time: "3 PM", rate: 78 },
    { time: "6 PM", rate: 74 },
    { time: "9 PM", rate: 70 },
  ]

  const moodTrendData = [
    { date: "Mon", mood: 7, stress: 3 },
    { date: "Tue", mood: 6, stress: 4 },
    { date: "Wed", mood: 8, stress: 2 },
    { date: "Thu", mood: 5, stress: 6 },
    { date: "Fri", mood: 9, stress: 1 },
    { date: "Sat", mood: 8, stress: 2 },
    { date: "Sun", mood: 7, stress: 3 },
  ]

  const riskDistributionData = [
    { name: "Low Risk", value: 65, color: "#10B981" },
    { name: "Medium Risk", value: 25, color: "#F59E0B" },
    { name: "High Risk", value: 10, color: "#EF4444" },
  ]

  const weeklyHealthData = [
    { day: "Mon", heartRate: 72, temperature: 98.6, bloodPressure: 120 },
    { day: "Tue", heartRate: 75, temperature: 98.4, bloodPressure: 118 },
    { day: "Wed", heartRate: 70, temperature: 98.7, bloodPressure: 122 },
    { day: "Thu", heartRate: 78, temperature: 99.1, bloodPressure: 125 },
    { day: "Fri", heartRate: 73, temperature: 98.5, bloodPressure: 119 },
    { day: "Sat", heartRate: 69, temperature: 98.3, bloodPressure: 117 },
    { day: "Sun", heartRate: 71, temperature: 98.6, bloodPressure: 120 },
  ]

  // Risk keywords that trigger alerts
  const highRiskKeywords = ["suicide", "death", "hopeless", "worthless", "pain", "hurt", "alone", "scared"]
  const mediumRiskKeywords = ["sad", "anxious", "worried", "tired", "stressed", "angry", "frustrated"]

  const analyzeRiskLevel = (keywords: string[]): "low" | "medium" | "high" => {
    const keywordString = keywords.join(" ").toLowerCase()

    if (highRiskKeywords.some((word) => keywordString.includes(word))) {
      return "high"
    }
    if (mediumRiskKeywords.some((word) => keywordString.includes(word))) {
      return "medium"
    }
    return "low"
  }

  const addEmotionEntry = () => {
    if (!currentMood.trim()) return

    const keywords = currentKeywords
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k)
    const riskLevel = analyzeRiskLevel(keywords)

    const newEntry: EmotionEntry = {
      id: Date.now().toString(),
      keywords,
      mood: currentMood,
      notes: currentNotes,
      timestamp: new Date(),
      riskLevel,
    }

    setEmotionEntries((prev) => [newEntry, ...prev])

    // Trigger alert for high risk
    if (riskLevel === "high") {
      const alertMessage = `HIGH RISK ALERT: Concerning keywords detected - ${keywords.join(", ")}`
      setAlerts((prev) => [alertMessage, ...prev])
      notifyEmergencyContacts(alertMessage)
    }

    // Clear form
    setCurrentMood("")
    setCurrentKeywords("")
    setCurrentNotes("")
  }

  const addEmergencyContact = () => {
    if (!newContact.name.trim() || !newContact.phone.trim()) return

    const contact: EmergencyContact = {
      id: Date.now().toString(),
      ...newContact,
    }

    setEmergencyContacts((prev) => [...prev, contact])
    setNewContact({ name: "", phone: "", relationship: "" })
  }

  const removeEmergencyContact = (id: string) => {
    setEmergencyContacts((prev) => prev.filter((contact) => contact.id !== id))
  }

  const notifyEmergencyContacts = (message: string) => {
    console.log("Notifying emergency contacts:", message)
  }

  const getHealthSuggestions = () => {
    const suggestions = []
    const latestMood = emotionEntries[0]

    if (latestMood) {
      if (latestMood.riskLevel === "high") {
        suggestions.push({
          type: "urgent",
          title: "Immediate Support Needed",
          description: "Please reach out to a mental health professional or crisis hotline immediately.",
          actions: ["Call 988 (Suicide & Crisis Lifeline)", "Contact your therapist", "Reach out to a trusted friend"],
        })
      } else if (latestMood.riskLevel === "medium") {
        suggestions.push({
          type: "mental",
          title: "Stress Relief Techniques",
          description: "Try these techniques to improve your mental wellbeing.",
          actions: [
            "Practice deep breathing exercises",
            "Take a 10-minute walk",
            "Listen to calming music",
            "Try meditation",
          ],
        })
      } else {
        suggestions.push({
          type: "maintenance",
          title: "Maintain Your Wellbeing",
          description: "Keep up the good work with these positive habits.",
          actions: [
            "Continue regular exercise",
            "Maintain social connections",
            "Practice gratitude",
            "Get adequate sleep",
          ],
        })
      }
    }

    if (healthMetrics.heartRate && healthMetrics.heartRate > 100) {
      suggestions.push({
        type: "physical",
        title: "Elevated Heart Rate",
        description: "Your heart rate is elevated. Consider these calming activities.",
        actions: [
          "Practice slow, deep breathing",
          "Sit or lie down in a quiet space",
          "Avoid caffeine",
          "Contact your doctor if persistent",
        ],
      })
    }

    if (healthMetrics.temperature && healthMetrics.temperature > 99.5) {
      suggestions.push({
        type: "physical",
        title: "Elevated Temperature",
        description: "You may have a fever. Take these steps to feel better.",
        actions: [
          "Rest and stay hydrated",
          "Take fever-reducing medication if needed",
          "Monitor temperature regularly",
          "Contact healthcare provider if fever persists",
        ],
      })
    }

    suggestions.push({
      type: "general",
      title: "Daily Wellness Tips",
      description: "Maintain your overall health with these daily practices.",
      actions: [
        "Drink 8 glasses of water",
        "Get 7-9 hours of sleep",
        "Eat nutritious meals",
        "Take breaks from screens",
      ],
    })

    return suggestions
  }

  const submitQuery = () => {
    if (!queryMessage.trim() || !queryEmail.trim()) return

    console.log("Query submitted:", { email: queryEmail, message: queryMessage })
    setQuerySubmitted(true)

    setTimeout(() => {
      setQuerySubmitted(false)
      setQueryMessage("")
      setQueryEmail("")
    }, 3000)
  }

  const sendChatMessage = () => {
    if (!currentChatMessage.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: currentChatMessage,
      isBot: false,
      timestamp: new Date(),
    }

    setChatMessages((prev) => [...prev, userMessage])

    // Simulate bot response
    setTimeout(() => {
      const botResponses = [
        "I understand how you're feeling. Would you like to talk about what's bothering you? 💙",
        "That sounds challenging. Remember, it's okay to take things one step at a time. 🌟",
        "Thank you for sharing that with me. How can I help you feel better today? 🤗",
        "I'm here to listen. Would you like some suggestions for managing stress? 🧘‍♀️",
        "It's great that you're checking in with yourself. Self-awareness is important! ✨",
      ]

      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)]

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: randomResponse,
        isBot: true,
        timestamp: new Date(),
      }

      setChatMessages((prev) => [...prev, botMessage])
    }, 1000)

    setCurrentChatMessage("")
  }

  const getSuggestionColor = (type: string) => {
    switch (type) {
      case "urgent":
        return "border-red-200 bg-red-50"
      case "mental":
        return "border-purple-200 bg-purple-50"
      case "physical":
        return "border-blue-200 bg-blue-50"
      case "maintenance":
        return "border-green-200 bg-green-50"
      default:
        return "border-gray-200 bg-gray-50"
    }
  }

  const getRiskColor = (level: "low" | "medium" | "high") => {
    switch (level) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-green-100 text-green-800 border-green-200"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 font-inter">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        
        .font-inter {
          font-family: 'Inter', sans-serif;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }
        
        .animate-slide-up {
          animation: slideUp 0.6s ease-out;
        }
        
        .animate-bounce-in {
          animation: bounceIn 0.5s ease-out;
        }
        
        .animate-pulse-slow {
          animation: pulse 3s infinite;
        }
        
        .hover-lift {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .hover-lift:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(30px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .chat-bubble {
          animation: chatBubble 0.3s ease-out;
        }
        
        @keyframes chatBubble {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>

      <div className={`max-w-6xl mx-auto space-y-8 ${isLoaded ? "animate-fade-in" : ""}`}>
        {/* Enhanced Header */}
        <div className="text-center space-y-4 animate-slide-up">
          <h1 className="text-5xl font-bold gradient-text flex items-center justify-center gap-3">
            <Heart className="w-12 h-12 text-red-500 animate-pulse-slow" />
            CareTaker Health Monitor
          </h1>
          <p className="text-xl text-gray-600 font-medium">
            Monitor health and mental wellbeing with smart alerts & AI assistance
          </p>
          <div className="flex justify-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              System Active
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              AI Assistant Ready
            </span>
          </div>
        </div>

        {/* Enhanced Alerts */}
        {alerts.length > 0 && (
          <Alert className="border-red-200 bg-red-50 animate-bounce-in hover-lift">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <AlertDescription className="text-red-800 font-medium">
              <div className="space-y-1">
                {alerts.slice(0, 3).map((alert, index) => (
                  <div key={index} className="text-base">
                    {alert}
                  </div>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-5 h-14 text-base font-semibold">
            <TabsTrigger value="dashboard" className="text-base">
              📊 Dashboard
            </TabsTrigger>
            <TabsTrigger value="emotions" className="text-base">
              🧠 Emotions
            </TabsTrigger>
            <TabsTrigger value="contacts" className="text-base">
              📞 Contacts
            </TabsTrigger>
            <TabsTrigger value="health" className="text-base">
              ❤️ Health
            </TabsTrigger>
            <TabsTrigger value="charts" className="text-base">
              📈 Analytics
            </TabsTrigger>
          </TabsList>

          {/* Enhanced Dashboard Tab with Sub-Navigation */}
          <TabsContent value="dashboard" className="space-y-6 animate-slide-up">
            {/* Dashboard Sub-Navigation */}
            <Card className="hover-lift border-0 shadow-lg bg-gradient-to-r from-indigo-50 to-purple-50">
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-3 justify-center">
                  {[
                    { id: "overview", label: "📊 Overview", icon: Activity },
                    { id: "query", label: "❓ Ask Question", icon: MessageCircle },
                    { id: "about", label: "ℹ️ About Us", icon: User },
                    { id: "emergency", label: "🚨 Emergency", icon: AlertTriangle },
                  ].map((section) => (
                    <Button
                      key={section.id}
                      onClick={() => setSelectedDashboardSection(section.id)}
                      variant={selectedDashboardSection === section.id ? "default" : "outline"}
                      className={`
              h-12 px-6 text-base font-semibold transition-all duration-300 hover-lift
              ${
                selectedDashboardSection === section.id
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105 border-2 border-blue-300"
                  : "bg-white hover:bg-gray-50 text-gray-700 border-gray-200 hover:border-blue-300"
              }
            `}
                    >
                      <section.icon className="w-5 h-5 mr-2" />
                      {section.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Dashboard Content Based on Selection */}
            {selectedDashboardSection === "overview" && (
              <div className="space-y-6 animate-slide-up">
                {/* Current Status Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Enhanced Current Status */}
                  <Card className="hover-lift border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 transform transition-all duration-300 hover:scale-105">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-xl flex items-center gap-3 font-bold">
                        <Activity className="w-6 h-6 text-blue-600 animate-pulse" />
                        Current Status
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                          <span className="text-gray-700 font-medium">Heart Rate</span>
                          <span className="text-2xl font-bold text-blue-600 animate-pulse">
                            {healthMetrics.heartRate} bpm
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                          <span className="text-gray-700 font-medium">Blood Pressure</span>
                          <span className="text-2xl font-bold text-blue-600">{healthMetrics.bloodPressure}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                          <span className="text-gray-700 font-medium">Temperature</span>
                          <span className="text-2xl font-bold text-blue-600">{healthMetrics.temperature}°F</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Enhanced Recent Mood */}
                  <Card className="hover-lift border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 transform transition-all duration-300 hover:scale-105">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-xl flex items-center gap-3 font-bold">
                        <Brain className="w-6 h-6 text-purple-600 animate-pulse" />
                        Recent Mood
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {emotionEntries.length > 0 ? (
                        <div className="space-y-3">
                          <div className="text-2xl font-bold text-purple-700 p-3 bg-white/50 rounded-lg text-center">
                            {emotionEntries[0].mood}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {emotionEntries[0].keywords.slice(0, 3).map((keyword, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-sm font-medium animate-bounce-in"
                                style={{ animationDelay: `${index * 0.1}s` }}
                              >
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                          <Badge
                            className={`${getRiskColor(emotionEntries[0].riskLevel)} text-sm font-bold w-full justify-center py-2`}
                          >
                            {emotionEntries[0].riskLevel.toUpperCase()} RISK
                          </Badge>
                        </div>
                      ) : (
                        <p className="text-gray-500 text-lg text-center p-6">No mood entries yet</p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Enhanced Emergency Contacts */}
                  <Card className="hover-lift border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 transform transition-all duration-300 hover:scale-105">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-xl flex items-center gap-3 font-bold">
                        <Phone className="w-6 h-6 text-green-600 animate-pulse" />
                        Emergency Contacts
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {emergencyContacts.slice(0, 2).map((contact, index) => (
                          <div
                            key={contact.id}
                            className="p-3 bg-white/50 rounded-lg animate-slide-up"
                            style={{ animationDelay: `${index * 0.1}s` }}
                          >
                            <div className="font-bold text-green-700 text-lg">{contact.name}</div>
                            <div className="text-green-600 font-medium">{contact.relationship}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Enhanced Recent Entries */}
                <Card className="hover-lift border-0 shadow-lg bg-gradient-to-br from-gray-50 to-gray-100">
                  <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg">
                    <CardTitle className="text-2xl flex items-center gap-3 font-bold">
                      <Clock className="w-6 h-6" />
                      Recent Emotion Entries
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {emotionEntries.slice(0, 5).map((entry, index) => (
                        <div
                          key={entry.id}
                          className={`border-2 rounded-xl p-4 space-y-3 hover-lift animate-slide-up bg-white shadow-md transform transition-all duration-300 hover:shadow-lg`}
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <div className="flex justify-between items-start">
                            <div className="text-xl font-bold text-gray-800">{entry.mood}</div>
                            <Badge className={`${getRiskColor(entry.riskLevel)} text-sm font-bold animate-pulse`}>
                              {entry.riskLevel}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {entry.keywords.map((keyword, keywordIndex) => (
                              <Badge
                                key={keywordIndex}
                                variant="outline"
                                className="text-sm animate-bounce-in"
                                style={{ animationDelay: `${keywordIndex * 0.05}s` }}
                              >
                                {keyword}
                              </Badge>
                            ))}
                          </div>
                          <div className="text-sm text-gray-500 font-medium bg-gray-50 p-2 rounded">
                            {entry.timestamp.toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Query Section */}
            {selectedDashboardSection === "query" && (
              <Card className="hover-lift border-0 shadow-lg animate-slide-up bg-gradient-to-br from-blue-50 to-indigo-100">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-lg">
                  <CardTitle className="text-2xl flex items-center gap-3 font-bold">
                    <MessageCircle className="w-6 h-6" />
                    Have a Question?
                  </CardTitle>
                  <CardDescription className="text-blue-100 text-lg">
                    Send us your questions or concerns about the CareTaker app or your health monitoring
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  {querySubmitted ? (
                    <Alert className="border-green-200 bg-green-50 animate-bounce-in shadow-lg">
                      <AlertTriangle className="h-5 w-5 text-green-600" />
                      <AlertDescription className="text-green-800 text-lg font-medium">
                        Thank you for your query! We'll get back to you within 24 hours.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div className="space-y-6">
                      <div className="animate-slide-up">
                        <label className="block text-lg font-semibold mb-3 text-gray-700">Your Email</label>
                        <Input
                          type="email"
                          value={queryEmail}
                          onChange={(e) => setQueryEmail(e.target.value)}
                          placeholder="your.email@example.com"
                          className="text-lg p-4 h-14 border-2 border-blue-200 focus:border-blue-500 transition-all duration-300"
                        />
                      </div>
                      <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
                        <label className="block text-lg font-semibold mb-3 text-gray-700">
                          Your Question or Concern
                        </label>
                        <Textarea
                          value={queryMessage}
                          onChange={(e) => setQueryMessage(e.target.value)}
                          placeholder="Please describe your question, concern, or feedback about the app..."
                          rows={4}
                          className="text-lg p-4 border-2 border-blue-200 focus:border-blue-500 transition-all duration-300"
                        />
                      </div>
                      <Button
                        onClick={submitQuery}
                        className="w-full h-14 text-lg font-semibold hover-lift bg-gradient-to-r from-blue-500 to-indigo-600 animate-slide-up"
                        style={{ animationDelay: "0.2s" }}
                      >
                        <MessageCircle className="w-5 h-5 mr-2" />
                        Send Query
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* About Us Section */}
            {selectedDashboardSection === "about" && (
              <Card className="hover-lift border-0 shadow-lg animate-slide-up bg-gradient-to-br from-indigo-50 to-purple-100">
                <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg">
                  <CardTitle className="text-2xl flex items-center gap-3 font-bold">
                    <User className="w-6 h-6" />
                    About CareTaker Health Monitor
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="prose prose-lg max-w-none">
                    <p className="text-gray-700 leading-relaxed text-lg font-medium animate-slide-up">
                      CareTaker Health Monitor is a comprehensive digital health platform designed to bridge the gap
                      between patients, caregivers, and healthcare professionals. Our mission is to provide intelligent
                      health monitoring that goes beyond basic vital signs to include mental health and emotional
                      wellbeing.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                      <div
                        className="hover-lift p-6 bg-white rounded-xl shadow-md animate-slide-up"
                        style={{ animationDelay: "0.1s" }}
                      >
                        <h4 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                          🎯 <span className="gradient-text">Our Mission</span>
                        </h4>
                        <p className="text-base text-gray-600 font-medium">
                          To empower individuals and their support networks with intelligent health monitoring tools
                          that detect early warning signs and provide personalized care recommendations.
                        </p>
                      </div>

                      <div
                        className="hover-lift p-6 bg-white rounded-xl shadow-md animate-slide-up"
                        style={{ animationDelay: "0.2s" }}
                      >
                        <h4 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                          🔬 <span className="gradient-text">Our Technology</span>
                        </h4>
                        <p className="text-base text-gray-600 font-medium">
                          We use advanced keyword analysis and pattern recognition to assess mental health risks and
                          provide timely interventions through our emergency contact system.
                        </p>
                      </div>

                      <div
                        className="hover-lift p-6 bg-white rounded-xl shadow-md animate-slide-up"
                        style={{ animationDelay: "0.3s" }}
                      >
                        <h4 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                          👥 <span className="gradient-text">Our Team</span>
                        </h4>
                        <p className="text-base text-gray-600 font-medium">
                          Our multidisciplinary team includes healthcare professionals, mental health experts, and
                          technology specialists dedicated to improving health outcomes through innovation.
                        </p>
                      </div>

                      <div
                        className="hover-lift p-6 bg-white rounded-xl shadow-md animate-slide-up"
                        style={{ animationDelay: "0.4s" }}
                      >
                        <h4 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                          🛡️ <span className="gradient-text">Privacy & Security</span>
                        </h4>
                        <p className="text-base text-gray-600 font-medium">
                          We prioritize your privacy with end-to-end encryption, HIPAA compliance, and strict data
                          protection protocols to ensure your health information remains secure.
                        </p>
                      </div>
                    </div>

                    <div className="mt-8 text-center animate-slide-up" style={{ animationDelay: "0.5s" }}>
                      <p className="text-sm text-gray-500 font-medium">
                        CareTaker Health Monitor v2.0 | © 2024 |<span className="mx-2">•</span>
                        <a href="#" className="text-blue-600 hover:underline">
                          Privacy Policy
                        </a>
                        <span className="mx-2">•</span>
                        <a href="#" className="text-blue-600 hover:underline">
                          Terms of Service
                        </a>
                        <span className="mx-2">•</span>
                        <a href="#" className="text-blue-600 hover:underline">
                          Contact Support
                        </a>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Emergency Section */}
            {selectedDashboardSection === "emergency" && (
              <Card className="hover-lift border-0 shadow-lg animate-slide-up bg-gradient-to-br from-red-50 to-orange-100">
                <CardHeader className="bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-t-lg">
                  <CardTitle className="text-2xl flex items-center gap-3 font-bold">
                    <AlertTriangle className="w-6 h-6 animate-pulse" />
                    Emergency Resources & Contacts
                  </CardTitle>
                  <CardDescription className="text-red-100 text-lg">
                    Immediate help and crisis support resources
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  {/* Crisis Hotlines */}
                  <div className="p-6 bg-red-50 rounded-xl border border-red-200 hover-lift animate-slide-up">
                    <h4 className="text-xl font-bold text-red-900 mb-4 flex items-center gap-2">
                      📞 <span>Crisis Hotlines</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-base text-red-800 font-medium">
                      <div className="p-4 bg-white rounded-lg shadow-sm hover-lift">
                        <strong>Crisis Text Line:</strong>
                        <br />
                        <span className="text-2xl font-bold text-red-600">Text HOME to 741741</span>
                      </div>
                      <div className="p-4 bg-white rounded-lg shadow-sm hover-lift">
                        <strong>Suicide Prevention Lifeline:</strong>
                        <br />
                        <span className="text-2xl font-bold text-red-600">988</span>
                      </div>
                      <div className="p-4 bg-white rounded-lg shadow-sm hover-lift">
                        <strong>Emergency Services:</strong>
                        <br />
                        <span className="text-2xl font-bold text-red-600">911</span>
                      </div>
                      <div className="p-4 bg-white rounded-lg shadow-sm hover-lift">
                        <strong>SAMHSA Helpline:</strong>
                        <br />
                        <span className="text-2xl font-bold text-red-600">1-800-662-4357</span>
                      </div>
                    </div>
                  </div>

                  {/* Personal Emergency Contacts */}
                  <div
                    className="p-6 bg-green-50 rounded-xl border border-green-200 hover-lift animate-slide-up"
                    style={{ animationDelay: "0.1s" }}
                  >
                    <h4 className="text-xl font-bold text-green-900 mb-4 flex items-center gap-2">
                      👥 <span>Your Emergency Contacts</span>
                    </h4>
                    <div className="space-y-4">
                      {emergencyContacts.map((contact, index) => (
                        <div
                          key={contact.id}
                          className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm hover-lift animate-slide-up"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <div className="flex items-center gap-4">
                            <User className="w-10 h-10 text-gray-400" />
                            <div>
                              <div className="text-xl font-bold text-gray-800">{contact.name}</div>
                              <div className="text-base text-gray-600 font-medium">{contact.phone}</div>
                              <div className="text-sm text-gray-500">{contact.relationship}</div>
                            </div>
                          </div>
                          <Button className="bg-green-500 hover:bg-green-600 text-white hover-lift">
                            <Phone className="w-4 h-4 mr-2" />
                            Call Now
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Warning Signs */}
                  <div
                    className="p-6 bg-yellow-50 rounded-xl border border-yellow-200 hover-lift animate-slide-up"
                    style={{ animationDelay: "0.2s" }}
                  >
                    <h4 className="text-xl font-bold text-yellow-900 mb-4 flex items-center gap-2">
                      ⚠️ <span>Warning Signs to Watch For</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h5 className="font-semibold text-yellow-800">Mental Health Crisis:</h5>
                        <ul className="text-sm text-yellow-700 space-y-1">
                          <li>• Thoughts of self-harm or suicide</li>
                          <li>• Extreme mood changes</li>
                          <li>• Withdrawal from activities</li>
                          <li>• Substance abuse</li>
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h5 className="font-semibold text-yellow-800">Physical Emergency:</h5>
                        <ul className="text-sm text-yellow-700 space-y-1">
                          <li>• Chest pain or difficulty breathing</li>
                          <li>• Severe headache or confusion</li>
                          <li>• High fever ({">"}103°F)</li>
                          <li>• Loss of consciousness</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Enhanced Emotions Tab */}
          <TabsContent value="emotions" className="space-y-6 animate-slide-up">
            <Card className="hover-lift border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3 font-bold">
                  <MessageCircle className="w-6 h-6 text-purple-600" />
                  Log Emotions & Keywords
                </CardTitle>
                <CardDescription className="text-lg">
                  Track your mood and emotional state with keywords for better monitoring
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-lg font-semibold mb-3 text-gray-700">Current Mood</label>
                  <Input
                    value={currentMood}
                    onChange={(e) => setCurrentMood(e.target.value)}
                    placeholder="e.g., Happy, Sad, Anxious, Calm..."
                    className="text-lg p-4 h-14"
                  />
                </div>
                <div>
                  <label className="block text-lg font-semibold mb-3 text-gray-700">
                    Emotion Keywords (comma-separated)
                  </label>
                  <Input
                    value={currentKeywords}
                    onChange={(e) => setCurrentKeywords(e.target.value)}
                    placeholder="e.g., tired, worried, hopeful, energetic..."
                    className="text-lg p-4 h-14"
                  />
                </div>
                <div>
                  <label className="block text-lg font-semibold mb-3 text-gray-700">Additional Notes</label>
                  <Textarea
                    value={currentNotes}
                    onChange={(e) => setCurrentNotes(e.target.value)}
                    placeholder="Any additional thoughts or context..."
                    rows={4}
                    className="text-lg p-4"
                  />
                </div>
                <Button onClick={addEmotionEntry} className="w-full h-14 text-lg font-semibold hover-lift">
                  <Plus className="w-5 h-5 mr-2" />
                  Log Emotion Entry
                </Button>
              </CardContent>
            </Card>

            {/* Enhanced Emotion History */}
            <Card className="hover-lift border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Emotion History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {emotionEntries.map((entry, index) => (
                    <div
                      key={entry.id}
                      className={`border rounded-xl p-6 space-y-4 hover-lift animate-slide-up`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-2xl font-bold text-gray-800">{entry.mood}</div>
                          <div className="text-base text-gray-500 font-medium">{entry.timestamp.toLocaleString()}</div>
                        </div>
                        <Badge className={`${getRiskColor(entry.riskLevel)} text-sm font-bold`}>
                          {entry.riskLevel.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {entry.keywords.map((keyword, index) => (
                          <Badge key={index} variant="outline" className="text-sm">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                      {entry.notes && (
                        <div className="text-base text-gray-700 bg-gray-50 p-4 rounded-lg font-medium">
                          {entry.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhanced Emergency Contacts Tab */}
          <TabsContent value="contacts" className="space-y-6 animate-slide-up">
            <Card className="hover-lift border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3 font-bold">
                  <Plus className="w-6 h-6 text-green-600" />
                  Add Emergency Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-lg font-semibold mb-3 text-gray-700">Name</label>
                  <Input
                    value={newContact.name}
                    onChange={(e) => setNewContact((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Contact name"
                    className="text-lg p-4 h-14"
                  />
                </div>
                <div>
                  <label className="block text-lg font-semibold mb-3 text-gray-700">Phone Number</label>
                  <Input
                    value={newContact.phone}
                    onChange={(e) => setNewContact((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="+1-555-0123"
                    className="text-lg p-4 h-14"
                  />
                </div>
                <div>
                  <label className="block text-lg font-semibold mb-3 text-gray-700">Relationship</label>
                  <Input
                    value={newContact.relationship}
                    onChange={(e) => setNewContact((prev) => ({ ...prev, relationship: e.target.value }))}
                    placeholder="e.g., Doctor, Family Member, Friend"
                    className="text-lg p-4 h-14"
                  />
                </div>
                <Button onClick={addEmergencyContact} className="w-full h-14 text-lg font-semibold hover-lift">
                  Add Contact
                </Button>
              </CardContent>
            </Card>

            <Card className="hover-lift border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3 font-bold">
                  <Phone className="w-6 h-6 text-blue-600" />
                  Emergency Contacts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {emergencyContacts.map((contact, index) => (
                    <div
                      key={contact.id}
                      className={`flex justify-between items-center p-4 border rounded-xl hover-lift animate-slide-up`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-center gap-4">
                        <User className="w-10 h-10 text-gray-400" />
                        <div>
                          <div className="text-xl font-bold text-gray-800">{contact.name}</div>
                          <div className="text-base text-gray-600 font-medium">{contact.phone}</div>
                          <div className="text-sm text-gray-500">{contact.relationship}</div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeEmergencyContact(contact.id)}
                        className="hover-lift"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhanced Health Metrics Tab */}
          <TabsContent value="health" className="space-y-6 animate-slide-up">
            <Card className="hover-lift border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3 font-bold">
                  <Heart className="w-6 h-6 text-red-600" />
                  Health Metrics
                </CardTitle>
                <CardDescription className="text-lg">
                  Monitor vital signs and physical health indicators
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 border rounded-xl hover-lift bg-gradient-to-br from-red-50 to-red-100">
                    <div className="text-4xl font-bold text-red-600">{healthMetrics.heartRate}</div>
                    <div className="text-lg text-red-500 font-semibold">Heart Rate (bpm)</div>
                  </div>
                  <div className="text-center p-6 border rounded-xl hover-lift bg-gradient-to-br from-blue-50 to-blue-100">
                    <div className="text-4xl font-bold text-blue-600">{healthMetrics.bloodPressure}</div>
                    <div className="text-lg text-blue-500 font-semibold">Blood Pressure</div>
                  </div>
                  <div className="text-center p-6 border rounded-xl hover-lift bg-gradient-to-br from-green-50 to-green-100">
                    <div className="text-4xl font-bold text-green-600">{healthMetrics.temperature}°F</div>
                    <div className="text-lg text-green-500 font-semibold">Temperature</div>
                  </div>
                </div>
                <div className="text-base text-gray-500 text-center font-medium">
                  Last updated: {healthMetrics.lastUpdated.toLocaleString()}
                </div>
              </CardContent>
            </Card>

            <Card className="hover-lift border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Health Alerts & Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert className="hover-lift">
                    <AlertTriangle className="h-5 w-5" />
                    <AlertDescription className="text-lg font-medium">
                      Remember to take your medication at 8:00 PM
                    </AlertDescription>
                  </Alert>
                  <Alert className="hover-lift">
                    <Heart className="h-5 w-5" />
                    <AlertDescription className="text-lg font-medium">
                      Your heart rate is within normal range. Keep up the good work!
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* New Charts Tab */}

          {/* Enhanced Charts Tab with Improved Aesthetics */}
          <TabsContent value="charts" className="space-y-8 animate-slide-up">
            {/* Enhanced Analytics Header */}
            <Card className="hover-lift border-0 shadow-xl bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 text-white">
              <CardContent className="p-8">
                <div className="text-center space-y-4">
                  <h2 className="text-4xl font-bold flex items-center justify-center gap-3">
                    <BarChart3 className="w-10 h-10 animate-pulse" />
                    Health Analytics Dashboard
                  </h2>
                  <p className="text-xl text-blue-100 font-medium">
                    Comprehensive insights into your health and wellbeing patterns
                  </p>
                  <div className="flex justify-center gap-6 text-sm">
                    <span className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      Real-time Monitoring
                    </span>
                    <span className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                      <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                      AI-Powered Analysis
                    </span>
                    <span className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                      <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                      Predictive Insights
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Charts Grid - Enhanced Layout */}
            <div className="space-y-8">
              {/* Top Row - Heart Rate and Mood Charts */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Enhanced Heart Rate Trend */}
                <Card className="hover-lift border-0 shadow-xl bg-gradient-to-br from-red-50 via-white to-red-50 transform transition-all duration-500 hover:scale-[1.02]">
                  <CardHeader className="pb-4 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-t-lg">
                    <CardTitle className="text-2xl flex items-center gap-3 font-bold">
                      <TrendingUp className="w-6 h-6 animate-pulse" />
                      Heart Rate Trend
                    </CardTitle>
                    <CardDescription className="text-red-100 text-base">
                      Daily heart rate patterns with intelligent monitoring
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="w-full h-80 mb-4">
                      <ChartContainer
                        config={{
                          rate: {
                            label: "Heart Rate",
                            color: "hsl(0, 84%, 60%)",
                          },
                        }}
                        className="h-full w-full"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={heartRateData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                            <defs>
                              <linearGradient id="heartRateGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.1} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis
                              dataKey="time"
                              tick={{ fontSize: 14, fontWeight: 600 }}
                              tickLine={{ stroke: "#ccc" }}
                            />
                            <YAxis
                              tick={{ fontSize: 14, fontWeight: 600 }}
                              tickLine={{ stroke: "#ccc" }}
                              domain={["dataMin - 5", "dataMax + 5"]}
                            />
                            <ChartTooltip
                              content={<ChartTooltipContent />}
                              contentStyle={{
                                backgroundColor: "white",
                                border: "2px solid hsl(0, 84%, 60%)",
                                borderRadius: "12px",
                                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                                fontSize: "14px",
                                fontWeight: "600",
                              }}
                            />
                            <Area
                              type="monotone"
                              dataKey="rate"
                              stroke="hsl(0, 84%, 60%)"
                              fillOpacity={1}
                              fill="url(#heartRateGradient)"
                            />
                            <Line
                              type="monotone"
                              dataKey="rate"
                              stroke="hsl(0, 84%, 60%)"
                              strokeWidth={4}
                              dot={{ fill: "hsl(0, 84%, 60%)", strokeWidth: 3, r: 6 }}
                              activeDot={{ r: 8, stroke: "hsl(0, 84%, 60%)", strokeWidth: 3, fill: "white" }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </div>
                    <div className="flex justify-center gap-4 text-sm font-semibold">
                      <span className="flex items-center gap-2 bg-red-100 px-3 py-1 rounded-full">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        Average: 72 BPM
                      </span>
                      <span className="flex items-center gap-2 bg-green-100 px-3 py-1 rounded-full">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        Normal Range
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Enhanced Mood & Stress Levels */}
                <Card className="hover-lift border-0 shadow-xl bg-gradient-to-br from-purple-50 via-white to-purple-50 transform transition-all duration-500 hover:scale-[1.02]">
                  <CardHeader className="pb-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-t-lg">
                    <CardTitle className="text-2xl flex items-center gap-3 font-bold">
                      <Brain className="w-6 h-6 animate-pulse" />
                      Mood & Stress Analysis
                    </CardTitle>
                    <CardDescription className="text-purple-100 text-base">
                      Weekly emotional wellbeing with AI insights
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="w-full h-80 mb-4">
                      <ChartContainer
                        config={{
                          mood: {
                            label: "Mood",
                            color: "hsl(280, 100%, 70%)",
                          },
                          stress: {
                            label: "Stress",
                            color: "hsl(25, 95%, 53%)",
                          },
                        }}
                        className="h-full w-full"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={moodTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                            <defs>
                              <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(280, 100%, 70%)" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="hsl(280, 100%, 70%)" stopOpacity={0.2} />
                              </linearGradient>
                              <linearGradient id="stressGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(25, 95%, 53%)" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="hsl(25, 95%, 53%)" stopOpacity={0.2} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis
                              dataKey="date"
                              tick={{ fontSize: 14, fontWeight: 600 }}
                              tickLine={{ stroke: "#ccc" }}
                            />
                            <YAxis
                              tick={{ fontSize: 14, fontWeight: 600 }}
                              tickLine={{ stroke: "#ccc" }}
                              domain={[0, 10]}
                            />
                            <ChartTooltip
                              content={<ChartTooltipContent />}
                              contentStyle={{
                                backgroundColor: "white",
                                border: "2px solid hsl(280, 100%, 70%)",
                                borderRadius: "12px",
                                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                                fontSize: "14px",
                                fontWeight: "600",
                              }}
                            />
                            <Area
                              type="monotone"
                              dataKey="mood"
                              stackId="1"
                              stroke="hsl(280, 100%, 70%)"
                              fill="url(#moodGradient)"
                              strokeWidth={3}
                            />
                            <Area
                              type="monotone"
                              dataKey="stress"
                              stackId="2"
                              stroke="hsl(25, 95%, 53%)"
                              fill="url(#stressGradient)"
                              strokeWidth={3}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </div>
                    <div className="flex justify-center gap-4 text-sm font-semibold">
                      <span className="flex items-center gap-2 bg-purple-100 px-3 py-1 rounded-full">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        Mood Score: 7.2/10
                      </span>
                      <span className="flex items-center gap-2 bg-orange-100 px-3 py-1 rounded-full">
                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                        Stress Level: 3.1/10
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Bottom Row - Risk Distribution and Weekly Overview */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Enhanced Risk Level Distribution */}
                <Card className="hover-lift border-0 shadow-xl bg-gradient-to-br from-orange-50 via-white to-orange-50 transform transition-all duration-500 hover:scale-[1.02]">
                  <CardHeader className="pb-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-t-lg">
                    <CardTitle className="text-2xl flex items-center gap-3 font-bold">
                      <PieChartIcon className="w-6 h-6 animate-pulse" />
                      Mental Health Risk Assessment
                    </CardTitle>
                    <CardDescription className="text-orange-100 text-base">
                      AI-powered risk analysis and prevention
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="w-full h-80 mb-4 flex items-center justify-center">
                      <ChartContainer
                        config={{
                          value: {
                            label: "Percentage",
                            color: "hsl(var(--chart-4))",
                          },
                        }}
                        className="h-full w-full"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                            <defs>
                              <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                                <feDropShadow dx="2" dy="2" stdDeviation="3" floodOpacity="0.3" />
                              </filter>
                            </defs>
                            <Pie
                              data={riskDistributionData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              outerRadius={110}
                              innerRadius={50}
                              fill="#8884d8"
                              dataKey="value"
                              stroke="#fff"
                              strokeWidth={3}
                              filter="url(#shadow)"
                            >
                              {riskDistributionData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <ChartTooltip
                              content={<ChartTooltipContent />}
                              contentStyle={{
                                backgroundColor: "white",
                                border: "2px solid hsl(25, 95%, 53%)",
                                borderRadius: "12px",
                                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                                fontSize: "14px",
                                fontWeight: "600",
                              }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </div>
                    <div className="flex justify-center gap-4 text-sm font-semibold">
                      {riskDistributionData.map((entry, index) => (
                        <span key={index} className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                          {entry.name}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Enhanced Weekly Health Overview */}
                <Card className="hover-lift border-0 shadow-xl bg-gradient-to-br from-blue-50 via-white to-blue-50 transform transition-all duration-500 hover:scale-[1.02]">
                  <CardHeader className="pb-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-t-lg">
                    <CardTitle className="text-2xl flex items-center gap-3 font-bold">
                      <BarChart3 className="w-6 h-6 animate-pulse" />
                      Weekly Vital Signs Comparison
                    </CardTitle>
                    <CardDescription className="text-blue-100 text-base">
                      Comprehensive health metrics tracking
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="w-full h-80 mb-4">
                      <ChartContainer
                        config={{
                          heartRate: {
                            label: "Heart Rate",
                            color: "hsl(0, 84%, 60%)",
                          },
                          bloodPressure: {
                            label: "Blood Pressure (Systolic)",
                            color: "hsl(217, 91%, 60%)",
                          },
                        }}
                        className="h-full w-full"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={weeklyHealthData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                            <defs>
                              <linearGradient id="heartRateBarGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.9} />
                                <stop offset="95%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.6} />
                              </linearGradient>
                              <linearGradient id="bloodPressureBarGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.9} />
                                <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.6} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis
                              dataKey="day"
                              tick={{ fontSize: 14, fontWeight: 600 }}
                              tickLine={{ stroke: "#ccc" }}
                            />
                            <YAxis tick={{ fontSize: 14, fontWeight: 600 }} tickLine={{ stroke: "#ccc" }} />
                            <ChartTooltip
                              content={<ChartTooltipContent />}
                              contentStyle={{
                                backgroundColor: "white",
                                border: "2px solid hsl(217, 91%, 60%)",
                                borderRadius: "12px",
                                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                                fontSize: "14px",
                                fontWeight: "600",
                              }}
                            />
                            <Bar
                              dataKey="heartRate"
                              fill="url(#heartRateBarGradient)"
                              radius={[6, 6, 0, 0]}
                              maxBarSize={50}
                            />
                            <Bar
                              dataKey="bloodPressure"
                              fill="url(#bloodPressureBarGradient)"
                              radius={[6, 6, 0, 0]}
                              maxBarSize={50}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </div>
                    <div className="flex justify-center gap-6 text-sm font-semibold">
                      <span className="flex items-center gap-2 bg-red-100 px-3 py-1 rounded-full">
                        <div className="w-3 h-3 rounded bg-red-500"></div>
                        Heart Rate (bpm)
                      </span>
                      <span className="flex items-center gap-2 bg-blue-100 px-3 py-1 rounded-full">
                        <div className="w-3 h-3 rounded bg-blue-500"></div>
                        Blood Pressure (mmHg)
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Enhanced Analytics Summary Section */}
              <Card className="hover-lift border-0 shadow-xl bg-gradient-to-br from-indigo-50 via-white to-purple-50 transform transition-all duration-500 hover:scale-[1.01]">
                <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg">
                  <CardTitle className="text-3xl flex items-center gap-3 font-bold">
                    <Activity className="w-8 h-8 animate-pulse" />
                    Health Analytics Intelligence Summary
                  </CardTitle>
                  <CardDescription className="text-indigo-100 text-lg">
                    AI-powered insights and recommendations from your health data
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center p-8 bg-gradient-to-br from-green-100 to-emerald-200 rounded-2xl shadow-lg hover-lift transform transition-all duration-300 hover:scale-105">
                      <div className="text-5xl font-bold text-green-600 mb-3 animate-pulse">7 Days</div>
                      <div className="text-lg text-green-700 font-bold mb-2">Consistent Tracking</div>
                      <div className="text-sm text-green-600 font-medium">Perfect monitoring streak</div>
                      <div className="mt-4 w-full bg-green-200 rounded-full h-3">
                        <div className="bg-green-500 h-3 rounded-full w-full animate-pulse"></div>
                      </div>
                    </div>
                    <div className="text-center p-8 bg-gradient-to-br from-blue-100 to-cyan-200 rounded-2xl shadow-lg hover-lift transform transition-all duration-300 hover:scale-105">
                      <div className="text-5xl font-bold text-blue-600 mb-3 animate-pulse">72 BPM</div>
                      <div className="text-lg text-blue-700 font-bold mb-2">Average Heart Rate</div>
                      <div className="text-sm text-blue-600 font-medium">Optimal cardiovascular health</div>
                      <div className="mt-4 w-full bg-blue-200 rounded-full h-3">
                        <div className="bg-blue-500 h-3 rounded-full w-4/5 animate-pulse"></div>
                      </div>
                    </div>
                    <div className="text-center p-8 bg-gradient-to-br from-purple-100 to-violet-200 rounded-2xl shadow-lg hover-lift transform transition-all duration-300 hover:scale-105">
                      <div className="text-5xl font-bold text-purple-600 mb-3 animate-pulse">65%</div>
                      <div className="text-lg text-purple-700 font-bold mb-2">Low Risk Days</div>
                      <div className="text-sm text-purple-600 font-medium">Excellent mental wellbeing</div>
                      <div className="mt-4 w-full bg-purple-200 rounded-full h-3">
                        <div className="bg-purple-500 h-3 rounded-full w-2/3 animate-pulse"></div>
                      </div>
                    </div>
                  </div>

                  {/* AI Insights */}
                  <div className="mt-8 p-6 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl border-2 border-indigo-200">
                    <h4 className="text-xl font-bold text-indigo-900 mb-4 flex items-center gap-2">
                      🤖 <span>AI Health Insights</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="p-4 bg-white rounded-lg shadow-sm">
                        <strong className="text-green-700">✅ Positive Trend:</strong>
                        <p className="text-gray-700 mt-1">
                          Your heart rate variability shows excellent recovery patterns, indicating good cardiovascular
                          fitness.
                        </p>
                      </div>
                      <div className="p-4 bg-white rounded-lg shadow-sm">
                        <strong className="text-blue-700">📈 Recommendation:</strong>
                        <p className="text-gray-700 mt-1">
                          Continue your current exercise routine. Consider adding 10 minutes of meditation for stress
                          management.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Enhanced Health Relief Suggestions */}
        <Card className="mt-8 hover-lift border-0 shadow-lg animate-slide-up">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-3 font-bold">
              <Heart className="w-6 h-6 text-pink-500" />
              Personalized Relief Suggestions
            </CardTitle>
            <CardDescription className="text-lg">
              Based on your current health status and mood, here are some recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {getHealthSuggestions().map((suggestion, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-xl border hover-lift animate-slide-up ${getSuggestionColor(suggestion.type)}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xl font-bold">{suggestion.title}</h4>
                      <p className="text-base text-gray-600 mt-2 font-medium">{suggestion.description}</p>
                    </div>
                    <div className="space-y-3">
                      <div className="text-base font-bold text-gray-700">Recommended Actions:</div>
                      <ul className="space-y-2">
                        {suggestion.actions.map((action, actionIndex) => (
                          <li key={actionIndex} className="text-base text-gray-600 flex items-start gap-3 font-medium">
                            <span className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Widget */}
        <div className="fixed bottom-6 right-6 z-50">
          {!isChatOpen && (
            <Button
              onClick={() => setIsChatOpen(true)}
              className="w-16 h-16 rounded-full shadow-lg hover-lift animate-bounce-in bg-gradient-to-r from-blue-500 to-purple-600"
            >
              <MessageCircle className="w-8 h-8" />
            </Button>
          )}

          {isChatOpen && (
            <Card className="w-80 h-96 shadow-2xl animate-slide-up border-0">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg font-bold">💬 CareTaker Assistant</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsChatOpen(false)}
                    className="text-white hover:bg-white/20"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0 flex flex-col h-80">
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`chat-bubble ${
                        message.isBot ? "bg-gray-100 text-gray-800 mr-8" : "bg-blue-500 text-white ml-8"
                      } p-3 rounded-lg text-sm font-medium`}
                    >
                      {message.message}
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      value={currentChatMessage}
                      onChange={(e) => setCurrentChatMessage(e.target.value)}
                      placeholder="Type your message..."
                      onKeyPress={(e) => e.key === "Enter" && sendChatMessage()}
                      className="text-sm"
                    />
                    <Button onClick={sendChatMessage} size="sm" className="hover-lift">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
