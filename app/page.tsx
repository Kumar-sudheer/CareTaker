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
  ShieldAlert,
  ShieldX,
} from "lucide-react"

interface EmotionEntry {
  id: string
  keywords: string[]
  mood: string
  notes: string
  timestamp: Date
  riskLevel: "low" | "medium" | "high"
  detectedEmotions: string[]
  alertTriggered: boolean
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

interface OTPValidation {
  contactId: string
  phone: string
  email?: string
  otp: string
  generatedAt: Date
  expiresAt: Date
  attempts: number
  maxAttempts: number
  isValidated: boolean
  validationMethod: "sms" | "email"
}

interface PendingContact extends EmergencyContact {
  isValidated: boolean
  validationInProgress: boolean
}

export default function CaretakerApp() {
  const [emotionEntries, setEmotionEntries] = useState<EmotionEntry[]>([])
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([])
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
  const [hasRequiredContact, setHasRequiredContact] = useState(false)
  const [showContactRequirement, setShowContactRequirement] = useState(true)

  const [pendingContacts, setPendingContacts] = useState<PendingContact[]>([])
  const [otpValidations, setOtpValidations] = useState<OTPValidation[]>([])
  const [currentOtpInput, setCurrentOtpInput] = useState("")
  const [selectedValidationMethod, setSelectedValidationMethod] = useState<"sms" | "email">("sms")
  const [contactEmail, setContactEmail] = useState("")
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [currentValidatingContact, setCurrentValidatingContact] = useState<string | null>(null)
  const [otpSendingInProgress, setOtpSendingInProgress] = useState(false)
  const [validationFeedback, setValidationFeedback] = useState<{
    type: "success" | "error" | "info" | "warning"
    message: string
  } | null>(null)

  // Chat system states
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      message:
        "Hi there! 👋 I'm your CareTaker assistant. Please add an emergency contact first to access all features.",
      isBot: true,
      timestamp: new Date(),
    },
  ])
  const [currentChatMessage, setCurrentChatMessage] = useState("")

  // Animation states
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
    checkEmergencyContactRequirement()
  }, [])

  useEffect(() => {
    checkEmergencyContactRequirement()
  }, [emergencyContacts])

  const checkEmergencyContactRequirement = () => {
    const hasContact = emergencyContacts.length > 0 // Only count validated contacts
    setHasRequiredContact(hasContact)
    setShowContactRequirement(!hasContact)
  }

  useEffect(() => {
    if (validationFeedback) {
      const timer = setTimeout(() => {
        setValidationFeedback(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [validationFeedback])

  // Comprehensive keyword categorization
  const keywordCategories = {
    danger: {
      keywords: [
        // Suicidal ideation
        "suicide",
        "kill myself",
        "end it all",
        "want to die",
        "better off dead",
        "no point living",
        "take my life",
        "end my life",
        "can't go on",
        "worthless",
        "hopeless",
        "nothing matters",

        // Self-harm
        "cut myself",
        "hurt myself",
        "self-harm",
        "razor",
        "blade",
        "pills",
        "overdose",
        "jump",
        "hanging",
        "rope",
        "gun",
        "poison",

        // Severe depression
        "completely broken",
        "destroyed",
        "shattered",
        "can't breathe",
        "suffocating",
        "drowning",
        "trapped",
        "prison",
        "hell",
        "torture",
        "agony",
        "unbearable pain",

        // Crisis indicators
        "emergency",
        "crisis",
        "breakdown",
        "losing control",
        "going crazy",
        "insane",
        "psychotic",
        "hallucinating",
        "voices",
        "paranoid",
        "terrified",
        "panic attack",

        // Disease-related despair
        "terminal",
        "dying",
        "incurable",
        "cancer",
        "tumor",
        "chemotherapy",
        "radiation",
        "hospice",
        "palliative",
        "final stage",
        "months to live",
        "weeks to live",

        // Heartbreak extreme
        "heart destroyed",
        "soul crushed",
        "life ruined",
        "can't live without",
        "nothing left",
        "empty inside",
        "dead inside",
        "zombie",
        "ghost",
        "shadow of myself",
      ],
      color: "red",
      icon: "🚨",
      label: "DANGER",
      description: "Immediate intervention required",
    },
    warning: {
      keywords: [
        // Moderate depression
        "sad",
        "depressed",
        "down",
        "blue",
        "melancholy",
        "gloomy",
        "miserable",
        "unhappy",
        "dejected",
        "despondent",
        "discouraged",
        "disheartened",

        // Anxiety
        "anxious",
        "worried",
        "nervous",
        "scared",
        "afraid",
        "fearful",
        "panicked",
        "stressed",
        "overwhelmed",
        "tense",
        "restless",
        "uneasy",
        "apprehensive",

        // Anger
        "angry",
        "mad",
        "furious",
        "rage",
        "irritated",
        "annoyed",
        "frustrated",
        "hostile",
        "aggressive",
        "bitter",
        "resentful",
        "livid",
        "enraged",

        // Physical symptoms
        "tired",
        "exhausted",
        "drained",
        "weak",
        "sick",
        "nauseous",
        "dizzy",
        "headache",
        "pain",
        "aching",
        "sore",
        "uncomfortable",
        "unwell",

        // Emotional distress
        "crying",
        "tears",
        "sobbing",
        "weeping",
        "heartbroken",
        "devastated",
        "crushed",
        "hurt",
        "wounded",
        "betrayed",
        "abandoned",
        "rejected",

        // Isolation
        "alone",
        "lonely",
        "isolated",
        "disconnected",
        "withdrawn",
        "distant",
        "antisocial",
        "hermit",
        "recluse",
        "shut out",
        "excluded",
        "ignored",

        // Relationship issues
        "breakup",
        "divorce",
        "separation",
        "cheated",
        "unfaithful",
        "betrayal",
        "argument",
        "fight",
        "conflict",
        "tension",
        "problems",
        "issues",

        // Work/life stress
        "pressure",
        "deadline",
        "overworked",
        "burnout",
        "struggling",
        "difficult",
        "challenging",
        "demanding",
        "overwhelming",
        "burden",
        "responsibility",
      ],
      color: "yellow",
      icon: "⚠️",
      label: "WARNING",
      description: "Monitor closely and provide support",
    },
    safe: {
      keywords: [
        // Positive emotions
        "happy",
        "joyful",
        "cheerful",
        "delighted",
        "pleased",
        "content",
        "satisfied",
        "glad",
        "elated",
        "ecstatic",
        "thrilled",
        "excited",
        "enthusiastic",

        // Peace and calm
        "calm",
        "peaceful",
        "serene",
        "tranquil",
        "relaxed",
        "comfortable",
        "at ease",
        "centered",
        "balanced",
        "stable",
        "grounded",
        "secure",
        "safe",

        // Love and connection
        "loved",
        "cherished",
        "appreciated",
        "valued",
        "supported",
        "cared for",
        "connected",
        "close",
        "bonded",
        "intimate",
        "affectionate",
        "warm",

        // Confidence and strength
        "confident",
        "strong",
        "powerful",
        "capable",
        "competent",
        "skilled",
        "accomplished",
        "successful",
        "proud",
        "determined",
        "motivated",

        // Gratitude and appreciation
        "grateful",
        "thankful",
        "blessed",
        "fortunate",
        "lucky",
        "appreciative",
        "mindful",
        "present",
        "aware",
        "conscious",
        "enlightened",

        // Energy and vitality
        "energetic",
        "vibrant",
        "alive",
        "refreshed",
        "renewed",
        "revitalized",
        "healthy",
        "fit",
        "strong",
        "active",
        "dynamic",
        "vigorous",

        // Hope and optimism
        "hopeful",
        "optimistic",
        "positive",
        "bright",
        "promising",
        "encouraging",
        "uplifting",
        "inspiring",
        "motivating",
        "empowering",
        "healing",

        // Achievement and growth
        "accomplished",
        "achieved",
        "progressed",
        "improved",
        "developed",
        "learned",
        "grown",
        "evolved",
        "transformed",
        "breakthrough",
        "success",
        "victory",
      ],
      color: "green",
      icon: "✅",
      label: "SAFE",
      description: "Healthy emotional state",
    },
  }

  // Advanced emotion detection patterns
  const emotionPatterns = {
    heartbreak: {
      patterns: [
        /heart\s*(broken|shattered|crushed|destroyed)/i,
        /love\s*(lost|gone|over|ended)/i,
        /relationship\s*(ended|over|failed|broken)/i,
        /can't\s*live\s*without/i,
        /miss\s*(him|her|them)\s*so\s*much/i,
        /soul\s*mate\s*(left|gone)/i,
        /never\s*love\s*again/i,
        /heart\s*ache/i,
        /emotional\s*pain/i,
        /love\s*of\s*my\s*life/i,
      ],
      severity: "high",
      category: "Heartbreak Crisis",
    },
    disease: {
      patterns: [
        /diagnosed\s*with\s*(cancer|tumor|disease)/i,
        /terminal\s*(illness|disease|condition)/i,
        /incurable\s*(disease|condition|illness)/i,
        /chemotherapy|radiation|treatment/i,
        /months\s*to\s*live/i,
        /weeks\s*to\s*live/i,
        /stage\s*4|final\s*stage/i,
        /hospice|palliative\s*care/i,
        /medical\s*emergency/i,
        /life\s*threatening/i,
        /chronic\s*pain/i,
        /degenerative\s*disease/i,
      ],
      severity: "high",
      category: "Medical Crisis",
    },
    suicidal: {
      patterns: [
        /want\s*to\s*die/i,
        /kill\s*myself/i,
        /end\s*my\s*life/i,
        /suicide|suicidal/i,
        /better\s*off\s*dead/i,
        /no\s*point\s*(in\s*)?living/i,
        /can't\s*go\s*on/i,
        /end\s*it\s*all/i,
        /take\s*my\s*own\s*life/i,
        /nothing\s*to\s*live\s*for/i,
        /world\s*better\s*without\s*me/i,
        /planning\s*to\s*(die|kill)/i,
      ],
      severity: "critical",
      category: "Suicidal Ideation",
    },
    selfHarm: {
      patterns: [
        /cut\s*myself/i,
        /hurt\s*myself/i,
        /self\s*harm/i,
        /razor|blade/i,
        /overdose|pills/i,
        /burn\s*myself/i,
        /punish\s*myself/i,
        /deserve\s*pain/i,
        /physical\s*pain\s*helps/i,
        /cutting|scratching/i,
      ],
      severity: "high",
      category: "Self-Harm Risk",
    },
  }

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

  const analyzeKeywordRisk = (keywords: string[]): "low" | "medium" | "high" => {
    const keywordString = keywords.join(" ").toLowerCase()

    // Check for danger keywords
    if (keywordCategories.danger.keywords.some((word) => keywordString.includes(word.toLowerCase()))) {
      return "high"
    }

    // Check for warning keywords
    if (keywordCategories.warning.keywords.some((word) => keywordString.includes(word.toLowerCase()))) {
      return "medium"
    }

    return "low"
  }

  const detectEmotionsInText = (
    text: string,
  ): { emotions: string[]; severity: "low" | "medium" | "high" | "critical" } => {
    const detectedEmotions: string[] = []
    let maxSeverity: "low" | "medium" | "high" | "critical" = "low"

    Object.entries(emotionPatterns).forEach(([emotionType, config]) => {
      config.patterns.forEach((pattern) => {
        if (pattern.test(text)) {
          detectedEmotions.push(config.category)

          // Update severity level
          if (
            config.severity === "critical" ||
            (config.severity === "high" && maxSeverity !== "critical") ||
            (config.severity === "medium" && maxSeverity === "low")
          ) {
            maxSeverity = config.severity as "low" | "medium" | "high" | "critical"
          }
        }
      })
    })

    return { emotions: [...new Set(detectedEmotions)], severity: maxSeverity }
  }

  const triggerEmergencyAlert = (entry: EmotionEntry, detectedEmotions: string[]) => {
    if (emergencyContacts.length === 0) {
      setAlerts((prev) => [
        "CRITICAL: No emergency contacts available for alert! Please add emergency contacts immediately.",
        ...prev,
      ])
      return
    }

    const alertMessage = `🚨 EMERGENCY ALERT 🚨
User: High-risk emotional state detected
Time: ${entry.timestamp.toLocaleString()}
Mood: ${entry.mood}
Detected Issues: ${detectedEmotions.join(", ")}
Keywords: ${entry.keywords.join(", ")}
${entry.notes ? `Notes: ${entry.notes}` : ""}

IMMEDIATE ACTION REQUIRED - Contact user immediately.`

    setAlerts((prev) => [alertMessage, ...prev])

    // Simulate emergency contact notification
    emergencyContacts.forEach((contact) => {
      console.log(`🚨 EMERGENCY ALERT sent to ${contact.name} (${contact.phone}):`, alertMessage)

      // In a real application, this would send SMS/call
      setTimeout(() => {
        setAlerts((prev) => [`Emergency alert sent to ${contact.name} at ${contact.phone}`, ...prev])
      }, 1000)
    })
  }

  const addEmotionEntry = () => {
    if (!hasRequiredContact) {
      setAlerts((prev) => ["❌ Please add at least one emergency contact before logging emotions.", ...prev])
      return
    }

    if (!currentMood.trim()) return

    const keywords = currentKeywords
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k)

    const keywordRisk = analyzeKeywordRisk(keywords)
    const textAnalysis = detectEmotionsInText(`${currentMood} ${currentKeywords} ${currentNotes}`)

    // Determine final risk level (highest of keyword risk and text analysis)
    let finalRisk: "low" | "medium" | "high" = keywordRisk
    if (textAnalysis.severity === "critical" || textAnalysis.severity === "high") {
      finalRisk = "high"
    } else if (textAnalysis.severity === "medium" && finalRisk === "low") {
      finalRisk = "medium"
    }

    const newEntry: EmotionEntry = {
      id: Date.now().toString(),
      keywords,
      mood: currentMood,
      notes: currentNotes,
      timestamp: new Date(),
      riskLevel: finalRisk,
      detectedEmotions: textAnalysis.emotions,
      alertTriggered: finalRisk === "high" || textAnalysis.severity === "critical",
    }

    setEmotionEntries((prev) => [newEntry, ...prev])

    // Trigger emergency alert for high risk or critical situations
    if (finalRisk === "high" || textAnalysis.severity === "critical") {
      triggerEmergencyAlert(newEntry, textAnalysis.emotions)
    }

    // Clear form
    setCurrentMood("")
    setCurrentKeywords("")
    setCurrentNotes("")
  }

  const addEmergencyContact = async () => {
    if (!newContact.name.trim() || !newContact.phone.trim()) {
      setValidationFeedback({
        type: "error",
        message: "Please fill in all required fields (Name and Phone Number)",
      })
      return
    }

    // Validate phone number format
    const phoneRegex = /^\+?[\d\s\-$$$$]{10,}$/
    if (!phoneRegex.test(newContact.phone.trim())) {
      setValidationFeedback({
        type: "error",
        message: "Please enter a valid phone number (minimum 10 digits)",
      })
      return
    }

    // Validate email if provided
    if (contactEmail.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(contactEmail.trim())) {
        setValidationFeedback({
          type: "error",
          message: "Please enter a valid email address",
        })
        return
      }
    }

    // Check for duplicate contacts
    const isDuplicate = [...emergencyContacts, ...pendingContacts].some(
      (contact) => contact.phone === newContact.phone.trim(),
    )

    if (isDuplicate) {
      setValidationFeedback({
        type: "error",
        message: "This phone number is already registered as an emergency contact",
      })
      return
    }

    const pendingContact: PendingContact = {
      id: Date.now().toString(),
      ...newContact,
      phone: newContact.phone.trim(),
      isValidated: false,
      validationInProgress: true,
    }

    setPendingContacts((prev) => [...prev, pendingContact])

    // Clear form
    setNewContact({ name: "", phone: "", relationship: "" })
    setContactEmail("")

    // Start OTP validation process
    await initiateOtpValidation(pendingContact)
  }

  const generateOTP = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  const initiateOtpValidation = async (contact: PendingContact) => {
    setOtpSendingInProgress(true)
    setValidationFeedback({
      type: "info",
      message: "Sending verification code...",
    })

    try {
      const otp = generateOTP()
      const now = new Date()
      const expiresAt = new Date(now.getTime() + 10 * 60 * 1000) // 10 minutes

      const otpValidation: OTPValidation = {
        contactId: contact.id,
        phone: contact.phone,
        email: contactEmail.trim() || undefined,
        otp,
        generatedAt: now,
        expiresAt,
        attempts: 0,
        maxAttempts: 3,
        isValidated: false,
        validationMethod: selectedValidationMethod,
      }

      setOtpValidations((prev) => [...prev, otpValidation])

      // Simulate sending OTP (in real implementation, this would call SMS/Email API)
      await simulateOtpSending(otpValidation)

      setCurrentValidatingContact(contact.id)
      setShowOtpModal(true)
      setOtpSendingInProgress(false)

      setValidationFeedback({
        type: "success",
        message: `Verification code sent to ${selectedValidationMethod === "sms" ? contact.phone : contactEmail}`,
      })
    } catch (error) {
      setOtpSendingInProgress(false)
      setValidationFeedback({
        type: "error",
        message: "Failed to send verification code. Please try again.",
      })
    }
  }

  const simulateOtpSending = async (validation: OTPValidation): Promise<void> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // In a real implementation, this would integrate with:
    // - Twilio for SMS: await twilioClient.messages.create({...})
    // - SendGrid for Email: await sgMail.send({...})

    console.log(`📱 OTP Sent via ${validation.validationMethod.toUpperCase()}:`)
    console.log(`To: ${validation.validationMethod === "sms" ? validation.phone : validation.email}`)
    console.log(`Code: ${validation.otp}`)
    console.log(`Expires: ${validation.expiresAt.toLocaleString()}`)

    // For demo purposes, show the OTP in an alert (remove in production)
    if (process.env.NODE_ENV === "development") {
      setTimeout(() => {
        alert(`Demo Mode - OTP Code: ${validation.otp}`)
      }, 1000)
    }
  }

  const validateOTP = async () => {
    if (!currentValidatingContact || !currentOtpInput.trim()) {
      setValidationFeedback({
        type: "error",
        message: "Please enter the verification code",
      })
      return
    }

    const validation = otpValidations.find((v) => v.contactId === currentValidatingContact)
    if (!validation) {
      setValidationFeedback({
        type: "error",
        message: "Validation session not found. Please try again.",
      })
      return
    }

    // Check if OTP has expired
    if (new Date() > validation.expiresAt) {
      setValidationFeedback({
        type: "error",
        message: "Verification code has expired. Please request a new one.",
      })
      return
    }

    // Check if max attempts exceeded
    if (validation.attempts >= validation.maxAttempts) {
      setValidationFeedback({
        type: "error",
        message: "Maximum verification attempts exceeded. Please request a new code.",
      })
      return
    }

    // Update attempts
    setOtpValidations((prev) =>
      prev.map((v) => (v.contactId === currentValidatingContact ? { ...v, attempts: v.attempts + 1 } : v)),
    )

    // Validate OTP
    if (currentOtpInput.trim() === validation.otp) {
      // OTP is correct - move contact from pending to validated
      const pendingContact = pendingContacts.find((c) => c.id === currentValidatingContact)
      if (pendingContact) {
        const validatedContact: EmergencyContact = {
          id: pendingContact.id,
          name: pendingContact.name,
          phone: pendingContact.phone,
          relationship: pendingContact.relationship,
        }

        setEmergencyContacts((prev) => [...prev, validatedContact])
        setPendingContacts((prev) => prev.filter((c) => c.id !== currentValidatingContact))

        // Mark validation as complete
        setOtpValidations((prev) =>
          prev.map((v) => (v.contactId === currentValidatingContact ? { ...v, isValidated: true } : v)),
        )

        setShowOtpModal(false)
        setCurrentOtpInput("")
        setCurrentValidatingContact(null)

        setValidationFeedback({
          type: "success",
          message: `Emergency contact "${pendingContact.name}" has been successfully verified and added!`,
        })

        // Update chat message when first contact is added
        if (emergencyContacts.length === 0) {
          setChatMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              message:
                "Great! You've successfully verified your first emergency contact. Now you can access all CareTaker features safely. 🛡️✅",
              isBot: true,
              timestamp: new Date(),
            },
          ])
        }
      }
    } else {
      // OTP is incorrect
      const remainingAttempts = validation.maxAttempts - validation.attempts
      if (remainingAttempts > 0) {
        setValidationFeedback({
          type: "error",
          message: `Incorrect verification code. ${remainingAttempts} attempt(s) remaining.`,
        })
      } else {
        setValidationFeedback({
          type: "error",
          message: "Maximum attempts exceeded. Please request a new verification code.",
        })
      }
      setCurrentOtpInput("")
    }
  }

  const resendOTP = async () => {
    if (!currentValidatingContact) return

    const pendingContact = pendingContacts.find((c) => c.id === currentValidatingContact)
    if (!pendingContact) return

    // Remove old validation
    setOtpValidations((prev) => prev.filter((v) => v.contactId !== currentValidatingContact))

    // Generate new OTP
    await initiateOtpValidation(pendingContact)
  }

  const cancelValidation = () => {
    if (currentValidatingContact) {
      // Remove pending contact and validation
      setPendingContacts((prev) => prev.filter((c) => c.id !== currentValidatingContact))
      setOtpValidations((prev) => prev.filter((v) => v.contactId !== currentValidatingContact))
    }

    setShowOtpModal(false)
    setCurrentOtpInput("")
    setCurrentValidatingContact(null)
    setValidationFeedback({
      type: "info",
      message: "Contact verification cancelled. You can try adding the contact again.",
    })
  }

  const formatTimeRemaining = (expiresAt: Date): string => {
    const now = new Date()
    const remaining = Math.max(0, Math.floor((expiresAt.getTime() - now.getTime()) / 1000))
    const minutes = Math.floor(remaining / 60)
    const seconds = remaining % 60
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const removeEmergencyContact = (id: string) => {
    setEmergencyContacts((prev) => prev.filter((contact) => contact.id !== id))
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
    if (!hasRequiredContact) {
      setAlerts((prev) => ["❌ Please add at least one emergency contact before using this feature.", ...prev])
      return
    }

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
    if (!hasRequiredContact) {
      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          message: "Please add an emergency contact first to access the chat feature. Your safety is our priority! 🛡️",
          isBot: true,
          timestamp: new Date(),
        },
      ])
      return
    }

    if (!currentChatMessage.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: currentChatMessage,
      isBot: false,
      timestamp: new Date(),
    }

    setChatMessages((prev) => [...prev, userMessage])

    // Analyze user message for risk
    const textAnalysis = detectEmotionsInText(currentChatMessage)

    setTimeout(() => {
      let botResponse = "I understand how you're feeling. Would you like to talk about what's bothering you? 💙"

      if (textAnalysis.severity === "critical" || textAnalysis.severity === "high") {
        botResponse =
          "I'm very concerned about what you've shared. Please reach out to your emergency contacts or call 988 (Crisis Lifeline) immediately. You're not alone, and help is available. 🚨❤️"

        // Trigger alert for high-risk chat messages
        const alertMessage = `🚨 HIGH-RISK CHAT MESSAGE DETECTED 🚨
Time: ${new Date().toLocaleString()}
Message: "${currentChatMessage}"
Detected Issues: ${textAnalysis.emotions.join(", ")}

User may need immediate support.`

        setAlerts((prev) => [alertMessage, ...prev])
      } else if (textAnalysis.severity === "medium") {
        botResponse =
          "I can hear that you're going through a difficult time. Remember, it's okay to take things one step at a time. Would you like some coping strategies? 🌟💙"
      }

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: botResponse,
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

  const getCategoryColor = (category: keyof typeof keywordCategories) => {
    const config = keywordCategories[category]
    switch (config.color) {
      case "red":
        return "bg-red-50 border-red-200 text-red-800"
      case "yellow":
        return "bg-yellow-50 border-yellow-200 text-yellow-800"
      case "green":
        return "bg-green-50 border-green-200 text-green-800"
      default:
        return "bg-gray-50 border-gray-200 text-gray-800"
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
              <div
                className={`w-2 h-2 ${hasRequiredContact ? "bg-green-500" : "bg-red-500"} rounded-full animate-pulse`}
              ></div>
              {hasRequiredContact ? "System Active" : "Emergency Contact Required"}
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              AI Assistant Ready
            </span>
          </div>
        </div>

        {/* Emergency Contact Requirement Alert */}
        {showContactRequirement && (
          <Alert className="border-red-200 bg-red-50 animate-bounce-in hover-lift">
            <ShieldX className="h-5 w-5 text-red-600" />
            <AlertDescription className="text-red-800 font-medium">
              <div className="space-y-2">
                <div className="text-lg font-bold">🚨 Emergency Contact Required</div>
                <div className="text-base">
                  For your safety, you must add at least one emergency contact before accessing CareTaker services. This
                  ensures immediate help can be provided if concerning emotional patterns are detected.
                </div>
                <Button
                  onClick={() => setSelectedDashboardSection("contacts")}
                  className="mt-2 bg-red-600 hover:bg-red-700 text-white"
                >
                  Add Emergency Contact Now
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Enhanced Alerts */}
        {alerts.length > 0 && (
          <Alert className="border-red-200 bg-red-50 animate-bounce-in hover-lift">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <AlertDescription className="text-red-800 font-medium">
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {alerts.slice(0, 5).map((alert, index) => (
                  <div
                    key={index}
                    className="text-sm whitespace-pre-line border-b border-red-200 last:border-b-0 pb-2 last:pb-0"
                  >
                    {alert}
                  </div>
                ))}
              </div>
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="contacts" className="w-full">
          <TabsList className="grid w-full grid-cols-5 h-14 text-base font-semibold">
            <TabsTrigger value="dashboard" className="text-base" disabled={!hasRequiredContact}>
              📊 Dashboard
            </TabsTrigger>
            <TabsTrigger value="emotions" className="text-base" disabled={!hasRequiredContact}>
              🧠 Emotions
            </TabsTrigger>
            <TabsTrigger value="contacts" className="text-base">
              📞 Contacts
            </TabsTrigger>
            <TabsTrigger value="health" className="text-base" disabled={!hasRequiredContact}>
              ❤️ Health
            </TabsTrigger>
            <TabsTrigger value="charts" className="text-base" disabled={!hasRequiredContact}>
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
                          {emotionEntries[0].detectedEmotions.length > 0 && (
                            <div className="text-xs text-purple-600 bg-purple-50 p-2 rounded">
                              Detected: {emotionEntries[0].detectedEmotions.join(", ")}
                            </div>
                          )}
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
                        {emergencyContacts.length > 0 ? (
                          emergencyContacts.slice(0, 2).map((contact, index) => (
                            <div
                              key={contact.id}
                              className="p-3 bg-white/50 rounded-lg animate-slide-up"
                              style={{ animationDelay: `${index * 0.1}s` }}
                            >
                              <div className="font-bold text-green-700 text-lg">{contact.name}</div>
                              <div className="text-green-600 font-medium">{contact.relationship}</div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                            <ShieldX className="w-8 h-8 text-red-500 mx-auto mb-2" />
                            <p className="text-red-700 font-medium">No emergency contacts</p>
                            <p className="text-red-600 text-sm">Add contacts to access features</p>
                          </div>
                        )}
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
                            <div className="flex gap-2">
                              <Badge className={`${getRiskColor(entry.riskLevel)} text-sm font-bold animate-pulse`}>
                                {entry.riskLevel}
                              </Badge>
                              {entry.alertTriggered && (
                                <Badge className="bg-red-100 text-red-800 border-red-200 text-xs">🚨 ALERT</Badge>
                              )}
                            </div>
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
                          {entry.detectedEmotions.length > 0 && (
                            <div className="bg-orange-50 border border-orange-200 p-2 rounded text-sm">
                              <strong className="text-orange-800">Detected Issues:</strong>
                              <div className="text-orange-700">{entry.detectedEmotions.join(", ")}</div>
                            </div>
                          )}
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
                      {emergencyContacts.length > 0 ? (
                        emergencyContacts.map((contact, index) => (
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
                        ))
                      ) : (
                        <div className="text-center p-6 bg-red-50 rounded-lg border border-red-200">
                          <ShieldX className="w-12 h-12 text-red-500 mx-auto mb-3" />
                          <h5 className="text-lg font-bold text-red-800 mb-2">No Emergency Contacts</h5>
                          <p className="text-red-600 mb-4">Add emergency contacts to enable safety features</p>
                          <Button
                            onClick={() => setSelectedDashboardSection("contacts")}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            Add Emergency Contact
                          </Button>
                        </div>
                      )}
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
            {/* Keyword Categories Reference */}
            <Card className="hover-lift border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-t-lg">
                <CardTitle className="text-2xl font-bold flex items-center gap-3">
                  <Brain className="w-6 h-6" />
                  Emotion Keyword Categories
                </CardTitle>
                <CardDescription className="text-purple-100 text-lg">
                  Understanding our AI-powered emotion detection system
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {Object.entries(keywordCategories).map(([category, config]) => (
                    <div
                      key={category}
                      className={`p-4 rounded-xl border-2 hover-lift animate-slide-up ${getCategoryColor(category as keyof typeof keywordCategories)}`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">{config.icon}</span>
                        <div>
                          <h4 className="font-bold text-lg">{config.label}</h4>
                          <p className="text-sm opacity-80">{config.description}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h5 className="font-semibold text-sm">Sample Keywords:</h5>
                        <div className="flex flex-wrap gap-1">
                          {config.keywords.slice(0, 8).map((keyword, index) => (
                            <Badge key={index} variant="outline" className="text-xs px-2 py-1">
                              {keyword}
                            </Badge>
                          ))}
                          <Badge variant="outline" className="text-xs px-2 py-1">
                            +{config.keywords.length - 8} more
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="hover-lift border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3 font-bold">
                  <MessageCircle className="w-6 h-6 text-purple-600" />
                  Log Emotions & Keywords
                </CardTitle>
                <CardDescription className="text-lg">
                  Track your mood and emotional state with AI-powered analysis for better monitoring
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
                  <p className="text-sm text-gray-500 mt-2">
                    Keywords are automatically analyzed for risk assessment using our comprehensive database
                  </p>
                </div>
                <div>
                  <label className="block text-lg font-semibold mb-3 text-gray-700">
                    Additional Notes
                    <span className="text-sm font-normal text-gray-500 ml-2">
                      (AI analyzes for heartbreak, medical issues, and crisis indicators)
                    </span>
                  </label>
                  <Textarea
                    value={currentNotes}
                    onChange={(e) => setCurrentNotes(e.target.value)}
                    placeholder="Describe your feelings, any medical concerns, relationship issues, or other thoughts..."
                    rows={4}
                    className="text-lg p-4"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Our AI detects patterns related to heartbreak, medical crises, suicidal ideation, and self-harm
                    risks
                  </p>
                </div>
                <Button
                  onClick={addEmotionEntry}
                  className="w-full h-14 text-lg font-semibold hover-lift"
                  disabled={!hasRequiredContact}
                >
                  <Plus className="w-5 h-5 mr-2" />
                  {hasRequiredContact ? "Log Emotion Entry" : "Add Emergency Contact First"}
                </Button>
              </CardContent>
            </Card>

            {/* Enhanced Emotion History with Risk Categorization */}
            <Card className="hover-lift border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-t-lg">
                <CardTitle className="text-2xl font-bold flex items-center gap-3">
                  <Brain className="w-6 h-6" />
                  Emotion Risk Analysis & History
                </CardTitle>
                <CardDescription className="text-purple-100 text-lg">
                  Categorized emotional data with intelligent risk assessment and AI emotion detection
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {/* Risk Level Legend */}
                <div className="mb-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                  <h4 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                    🎯 <span>Risk Level Categories</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-red-50 border-2 border-red-200 rounded-lg">
                      <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                      <div>
                        <div className="font-bold text-red-800">High Risk (Danger)</div>
                        <div className="text-sm text-red-600">Immediate attention needed</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
                      <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                      <div>
                        <div className="font-bold text-yellow-800">Medium Risk (Warning)</div>
                        <div className="text-sm text-yellow-600">Monitor closely</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-50 border-2 border-green-200 rounded-lg">
                      <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                      <div>
                        <div className="font-bold text-green-800">Low Risk (Safe)</div>
                        <div className="text-sm text-green-600">Healthy emotional state</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Risk Statistics */}
                {emotionEntries.length > 0 && (
                  <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(() => {
                      const riskCounts = emotionEntries.reduce(
                        (acc, entry) => {
                          acc[entry.riskLevel] = (acc[entry.riskLevel] || 0) + 1
                          return acc
                        },
                        {} as Record<string, number>,
                      )

                      const total = emotionEntries.length

                      return [
                        { level: "high", label: "High Risk", count: riskCounts.high || 0, color: "red" },
                        { level: "medium", label: "Medium Risk", count: riskCounts.medium || 0, color: "yellow" },
                        { level: "low", label: "Low Risk", count: riskCounts.low || 0, color: "green" },
                      ].map((stat, index) => (
                        <div
                          key={stat.level}
                          className={`text-center p-4 rounded-xl border-2 hover-lift animate-slide-up bg-${stat.color}-50 border-${stat.color}-200`}
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <div className={`text-3xl font-bold text-${stat.color}-600 mb-1`}>{stat.count}</div>
                          <div className={`text-sm font-semibold text-${stat.color}-700 mb-1`}>
                            {stat.label} Entries
                          </div>
                          <div className={`text-xs text-${stat.color}-600`}>
                            {total > 0 ? Math.round((stat.count / total) * 100) : 0}% of total
                          </div>
                          <div className={`mt-2 w-full bg-${stat.color}-200 rounded-full h-2`}>
                            <div
                              className={`bg-${stat.color}-500 h-2 rounded-full transition-all duration-500`}
                              style={{ width: `${total > 0 ? (stat.count / total) * 100 : 0}%` }}
                            ></div>
                          </div>
                        </div>
                      ))
                    })()}
                  </div>
                )}

                {/* Responsive Emotion Data Table */}
                {emotionEntries.length > 0 ? (
                  <div className="overflow-x-auto">
                    <div className="min-w-full">
                      {/* Table Header */}
                      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg p-4">
                        <div className="grid grid-cols-12 gap-4 font-bold text-sm">
                          <div className="col-span-2">Risk Level</div>
                          <div className="col-span-2">Mood</div>
                          <div className="col-span-2">Keywords</div>
                          <div className="col-span-2">AI Detection</div>
                          <div className="col-span-2">Notes</div>
                          <div className="col-span-2">Timestamp</div>
                        </div>
                      </div>

                      {/* Table Body - Categorized by Risk Level */}
                      <div className="bg-white rounded-b-lg border-2 border-gray-200">
                        {["high", "medium", "low"].map((riskLevel) => {
                          const entriesForLevel = emotionEntries.filter((entry) => entry.riskLevel === riskLevel)
                          if (entriesForLevel.length === 0) return null

                          const levelConfig = {
                            high: {
                              bg: "bg-red-50",
                              border: "border-red-200",
                              text: "text-red-800",
                              badge: "bg-red-100 text-red-800 border-red-200",
                              icon: "🚨",
                              label: "HIGH RISK",
                            },
                            medium: {
                              bg: "bg-yellow-50",
                              border: "border-yellow-200",
                              text: "text-yellow-800",
                              badge: "bg-yellow-100 text-yellow-800 border-yellow-200",
                              icon: "⚠️",
                              label: "MEDIUM RISK",
                            },
                            low: {
                              bg: "bg-green-50",
                              border: "border-green-200",
                              text: "text-green-800",
                              badge: "bg-green-100 text-green-800 border-green-200",
                              icon: "✅",
                              label: "LOW RISK",
                            },
                          }

                          const config = levelConfig[riskLevel as keyof typeof levelConfig]

                          return (
                            <div
                              key={riskLevel}
                              className={`${config.bg} ${config.border} border-t-2 first:border-t-0`}
                            >
                              {/* Category Header */}
                              <div className={`p-3 ${config.bg} border-b ${config.border}`}>
                                <h4 className={`font-bold ${config.text} flex items-center gap-2`}>
                                  <span className="text-lg">{config.icon}</span>
                                  {config.label} ({entriesForLevel.length} entries)
                                </h4>
                              </div>

                              {/* Entries for this risk level */}
                              {entriesForLevel.map((entry, index) => (
                                <div
                                  key={entry.id}
                                  className={`grid grid-cols-12 gap-4 p-4 border-b ${config.border} last:border-b-0 hover:bg-white/50 transition-all duration-200 animate-slide-up`}
                                  style={{ animationDelay: `${index * 0.05}s` }}
                                >
                                  {/* Risk Level Badge */}
                                  <div className="col-span-2 flex items-center">
                                    <div className="space-y-1">
                                      <Badge className={`${config.badge} text-xs font-bold px-2 py-1`}>
                                        {entry.riskLevel.toUpperCase()}
                                      </Badge>
                                      {entry.alertTriggered && (
                                        <Badge className="bg-red-100 text-red-800 border-red-200 text-xs">
                                          🚨 ALERT
                                        </Badge>
                                      )}
                                    </div>
                                  </div>

                                  {/* Mood */}
                                  <div className="col-span-2 flex items-center">
                                    <span className={`font-bold ${config.text} text-sm`}>{entry.mood}</span>
                                  </div>

                                  {/* Keywords */}
                                  <div className="col-span-2 flex items-center">
                                    <div className="flex flex-wrap gap-1">
                                      {entry.keywords.slice(0, 2).map((keyword, keywordIndex) => (
                                        <Badge key={keywordIndex} variant="outline" className="text-xs px-1 py-0.5">
                                          {keyword}
                                        </Badge>
                                      ))}
                                      {entry.keywords.length > 2 && (
                                        <Badge variant="outline" className="text-xs px-1 py-0.5">
                                          +{entry.keywords.length - 2}
                                        </Badge>
                                      )}
                                    </div>
                                  </div>

                                  {/* AI Detection */}
                                  <div className="col-span-2 flex items-center">
                                    {entry.detectedEmotions.length > 0 ? (
                                      <div className="space-y-1">
                                        {entry.detectedEmotions.slice(0, 2).map((emotion, emotionIndex) => (
                                          <Badge
                                            key={emotionIndex}
                                            className="bg-orange-100 text-orange-800 text-xs px-1 py-0.5 block"
                                          >
                                            {emotion}
                                          </Badge>
                                        ))}
                                        {entry.detectedEmotions.length > 2 && (
                                          <Badge className="bg-orange-100 text-orange-800 text-xs px-1 py-0.5">
                                            +{entry.detectedEmotions.length - 2}
                                          </Badge>
                                        )}
                                      </div>
                                    ) : (
                                      <span className="text-xs text-gray-500">None detected</span>
                                    )}
                                  </div>

                                  {/* Notes */}
                                  <div className="col-span-2 flex items-center">
                                    <span className="text-sm text-gray-600 truncate">{entry.notes || "No notes"}</span>
                                  </div>

                                  {/* Timestamp */}
                                  <div className="col-span-2 flex items-center">
                                    <span className="text-xs text-gray-500">
                                      {entry.timestamp.toLocaleDateString()}
                                      <br />
                                      {entry.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Mobile-Friendly Card View */}
                    <div className="md:hidden mt-6 space-y-4">
                      <h4 className="text-lg font-bold text-gray-800 mb-3">Mobile View</h4>
                      {emotionEntries.map((entry, index) => (
                        <div
                          key={entry.id}
                          className={`p-4 rounded-xl border-2 hover-lift animate-slide-up ${getRiskColor(entry.riskLevel)}`}
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className="text-lg font-bold text-gray-800">{entry.mood}</div>
                            <div className="space-y-1">
                              <Badge className={`${getRiskColor(entry.riskLevel)} text-xs font-bold`}>
                                {entry.riskLevel.toUpperCase()}
                              </Badge>
                              {entry.alertTriggered && (
                                <Badge className="bg-red-100 text-red-800 border-red-200 text-xs block">🚨 ALERT</Badge>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div>
                              <span className="text-sm font-semibold text-gray-700">Keywords:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {entry.keywords.map((keyword, keywordIndex) => (
                                  <Badge key={keywordIndex} variant="outline" className="text-xs">
                                    {keyword}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            {entry.detectedEmotions.length > 0 && (
                              <div>
                                <span className="text-sm font-semibold text-gray-700">AI Detected:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {entry.detectedEmotions.map((emotion, emotionIndex) => (
                                    <Badge key={emotionIndex} className="bg-orange-100 text-orange-800 text-xs">
                                      {emotion}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {entry.notes && (
                              <div>
                                <span className="text-sm font-semibold text-gray-700">Notes:</span>
                                <p className="text-sm text-gray-600 mt-1">{entry.notes}</p>
                              </div>
                            )}

                            <div className="text-xs text-gray-500 pt-2 border-t border-gray-200">
                              {entry.timestamp.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-500 mb-2">No Emotion Entries Yet</h3>
                    <p className="text-gray-400">Start logging your emotions to see risk analysis and trends</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhanced Emergency Contacts Tab */}
          <TabsContent value="contacts" className="space-y-6 animate-slide-up">
            {/* Validation Feedback */}
            {validationFeedback && (
              <Alert
                className={`animate-bounce-in hover-lift ${
                  validationFeedback.type === "success"
                    ? "border-green-200 bg-green-50"
                    : validationFeedback.type === "error"
                      ? "border-red-200 bg-red-50"
                      : validationFeedback.type === "warning"
                        ? "border-yellow-200 bg-yellow-50"
                        : "border-blue-200 bg-blue-50"
                }`}
              >
                <AlertTriangle
                  className={`h-5 w-5 ${
                    validationFeedback.type === "success"
                      ? "text-green-600"
                      : validationFeedback.type === "error"
                        ? "text-red-600"
                        : validationFeedback.type === "warning"
                          ? "text-yellow-600"
                          : "text-blue-600"
                  }`}
                />
                <AlertDescription
                  className={`font-medium ${
                    validationFeedback.type === "success"
                      ? "text-green-800"
                      : validationFeedback.type === "error"
                        ? "text-red-800"
                        : validationFeedback.type === "warning"
                          ? "text-yellow-800"
                          : "text-blue-800"
                  }`}
                >
                  {validationFeedback.message}
                </AlertDescription>
              </Alert>
            )}

            {/* Emergency Contact Requirement Notice */}
            <Card className="hover-lift border-0 shadow-lg bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3 font-bold text-red-800">
                  <ShieldAlert className="w-6 h-6 text-red-600" />
                  Emergency Contact Verification Required
                </CardTitle>
                <CardDescription className="text-red-700 text-lg">
                  All emergency contacts must be verified with OTP to ensure authenticity and accessibility
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-red-100 border border-red-200 rounded-lg p-4">
                  <h4 className="font-bold text-red-800 mb-2">Why We Verify Emergency Contacts:</h4>
                  <ul className="text-red-700 space-y-1 text-sm">
                    <li>• Ensures the contact number/email is active and reachable</li>
                    <li>• Confirms the contact person is aware they're listed as emergency contact</li>
                    <li>• Prevents false or incorrect contact information</li>
                    <li>• Guarantees immediate notification capability during crises</li>
                    <li>• Maintains system integrity and user safety</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Add Emergency Contact Form */}
            <Card className="hover-lift border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3 font-bold">
                  <Plus className="w-6 h-6 text-green-600" />
                  Add & Verify Emergency Contact
                </CardTitle>
                <CardDescription className="text-lg">
                  {emergencyContacts.length === 0
                    ? "Add your first emergency contact with OTP verification to unlock all CareTaker features"
                    : "Add additional verified emergency contacts for better safety coverage"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-lg font-semibold mb-3 text-gray-700">Contact Name *</label>
                  <Input
                    value={newContact.name}
                    onChange={(e) => setNewContact((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Full name of emergency contact"
                    className="text-lg p-4 h-14"
                  />
                </div>

                <div>
                  <label className="block text-lg font-semibold mb-3 text-gray-700">Phone Number *</label>
                  <Input
                    value={newContact.phone}
                    onChange={(e) => setNewContact((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="+1-555-0123 (include country code)"
                    className="text-lg p-4 h-14"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Primary verification method. Must be active and accessible by the contact person.
                  </p>
                </div>

                <div>
                  <label className="block text-lg font-semibold mb-3 text-gray-700">Email Address (Optional)</label>
                  <Input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="contact@example.com"
                    className="text-lg p-4 h-14"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Alternative verification method. Useful if SMS is not available.
                  </p>
                </div>

                <div>
                  <label className="block text-lg font-semibold mb-3 text-gray-700">Relationship</label>
                  <Input
                    value={newContact.relationship}
                    onChange={(e) => setNewContact((prev) => ({ ...prev, relationship: e.target.value }))}
                    placeholder="e.g., Doctor, Family Member, Friend, Therapist"
                    className="text-lg p-4 h-14"
                  />
                </div>

                {/* Verification Method Selection */}
                <div>
                  <label className="block text-lg font-semibold mb-3 text-gray-700">Verification Method</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="verificationMethod"
                        value="sms"
                        checked={selectedValidationMethod === "sms"}
                        onChange={(e) => setSelectedValidationMethod(e.target.value as "sms" | "email")}
                        className="w-4 h-4"
                      />
                      <span className="text-base font-medium">SMS (Recommended)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="verificationMethod"
                        value="email"
                        checked={selectedValidationMethod === "email"}
                        onChange={(e) => setSelectedValidationMethod(e.target.value as "sms" | "email")}
                        className="w-4 h-4"
                        disabled={!contactEmail.trim()}
                      />
                      <span className={`text-base font-medium ${!contactEmail.trim() ? "text-gray-400" : ""}`}>
                        Email {!contactEmail.trim() && "(Enter email first)"}
                      </span>
                    </label>
                  </div>
                </div>

                <Button
                  onClick={addEmergencyContact}
                  className="w-full h-14 text-lg font-semibold hover-lift"
                  disabled={otpSendingInProgress}
                >
                  {otpSendingInProgress ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Sending Verification Code...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5 mr-2" />
                      Add & Verify Contact
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Pending Contacts (Awaiting Verification) */}
            {pendingContacts.length > 0 && (
              <Card className="hover-lift border-0 shadow-lg bg-yellow-50 border-yellow-200">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-3 font-bold text-yellow-800">
                    <Clock className="w-6 h-6 text-yellow-600" />
                    Pending Verification ({pendingContacts.length})
                  </CardTitle>
                  <CardDescription className="text-yellow-700 text-lg">
                    These contacts are awaiting OTP verification
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingContacts.map((contact, index) => (
                      <div
                        key={contact.id}
                        className="flex justify-between items-center p-4 bg-white border border-yellow-200 rounded-xl hover-lift animate-slide-up"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-yellow-100 rounded-full">
                            <Clock className="w-8 h-8 text-yellow-600 animate-pulse" />
                          </div>
                          <div>
                            <div className="text-xl font-bold text-gray-800">{contact.name}</div>
                            <div className="text-base text-gray-600 font-medium">{contact.phone}</div>
                            <div className="text-sm text-yellow-600 font-medium">
                              {contact.relationship || "Emergency Contact"} • Verification Pending
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setCurrentValidatingContact(contact.id)
                              setShowOtpModal(true)
                            }}
                            className="hover-lift bg-yellow-100 border-yellow-300 text-yellow-700"
                          >
                            <MessageCircle className="w-4 h-4 mr-1" />
                            Verify
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setPendingContacts((prev) => prev.filter((c) => c.id !== contact.id))
                              setOtpValidations((prev) => prev.filter((v) => v.contactId !== contact.id))
                            }}
                            className="hover-lift text-red-600 border-red-300 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Verified Emergency Contacts */}
            <Card className="hover-lift border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3 font-bold">
                  <Phone className="w-6 h-6 text-blue-600" />
                  Verified Emergency Contacts ({emergencyContacts.length})
                </CardTitle>
                <CardDescription className="text-lg">
                  {emergencyContacts.length > 0
                    ? "These verified contacts will be notified immediately if concerning patterns are detected"
                    : "No verified emergency contacts yet - add and verify at least one to access CareTaker features"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {emergencyContacts.length > 0 ? (
                    emergencyContacts.map((contact, index) => (
                      <div
                        key={contact.id}
                        className="flex justify-between items-center p-4 border rounded-xl hover-lift animate-slide-up bg-green-50 border-green-200"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-green-100 rounded-full">
                            <User className="w-8 h-8 text-green-600" />
                          </div>
                          <div>
                            <div className="text-xl font-bold text-gray-800 flex items-center gap-2">
                              {contact.name}
                              <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                                ✅ VERIFIED
                              </Badge>
                            </div>
                            <div className="text-base text-gray-600 font-medium">{contact.phone}</div>
                            <div className="text-sm text-gray-500">{contact.relationship || "Emergency Contact"}</div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="hover-lift bg-green-100 border-green-300 text-green-700"
                          >
                            <Phone className="w-4 h-4 mr-1" />
                            Call
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeEmergencyContact(contact.id)}
                            className="hover-lift text-red-600 border-red-300 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                      <ShieldX className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-gray-500 mb-2">No Verified Emergency Contacts</h3>
                      <p className="text-gray-400 mb-4">
                        Add and verify at least one emergency contact to access CareTaker features
                      </p>
                      <div className="text-sm text-gray-500">
                        Verified contacts are notified when:
                        <ul className="mt-2 space-y-1">
                          <li>• High-risk emotional states are detected</li>
                          <li>• Crisis keywords are identified</li>
                          <li>• AI detects concerning patterns</li>
                        </ul>
                      </div>
                    </div>
                  )}
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
                      placeholder={hasRequiredContact ? "Type your message..." : "Add emergency contact first..."}
                      onKeyPress={(e) => e.key === "Enter" && sendChatMessage()}
                      className="text-sm"
                      disabled={!hasRequiredContact}
                    />
                    <Button onClick={sendChatMessage} size="sm" className="hover-lift" disabled={!hasRequiredContact}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* OTP Verification Modal */}
        {showOtpModal && currentValidatingContact && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md shadow-2xl animate-bounce-in">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="text-xl flex items-center gap-3 font-bold">
                  <MessageCircle className="w-6 h-6" />
                  Verify Emergency Contact
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Enter the verification code sent to your contact
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {(() => {
                  const validation = otpValidations.find((v) => v.contactId === currentValidatingContact)
                  const contact = pendingContacts.find((c) => c.id === currentValidatingContact)

                  if (!validation || !contact) return null

                  return (
                    <>
                      {/* Contact Information */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-bold text-blue-800 mb-2">Contact Details:</h4>
                        <div className="text-blue-700 space-y-1">
                          <div>
                            <strong>Name:</strong> {contact.name}
                          </div>
                          <div>
                            <strong>Phone:</strong> {contact.phone}
                          </div>
                          {validation.email && (
                            <div>
                              <strong>Email:</strong> {validation.email}
                            </div>
                          )}
                          <div>
                            <strong>Method:</strong> {validation.validationMethod.toUpperCase()}
                          </div>
                        </div>
                      </div>

                      {/* Timer and Status */}
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-800 mb-2">
                          Time Remaining: {formatTimeRemaining(validation.expiresAt)}
                        </div>
                        <div className="text-sm text-gray-600">
                          Attempts: {validation.attempts}/{validation.maxAttempts}
                        </div>
                      </div>

                      {/* OTP Input */}
                      <div>
                        <label className="block text-lg font-semibold mb-3 text-gray-700">
                          Enter 6-Digit Verification Code
                        </label>
                        <Input
                          type="text"
                          value={currentOtpInput}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "").slice(0, 6)
                            setCurrentOtpInput(value)
                          }}
                          placeholder="000000"
                          className="text-center text-2xl font-mono tracking-widest h-16"
                          maxLength={6}
                        />
                        <p className="text-sm text-gray-500 mt-2 text-center">
                          Code sent to {validation.validationMethod === "sms" ? contact.phone : validation.email}
                        </p>
                      </div>

                      {/* Instructions */}
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <h4 className="font-bold text-yellow-800 mb-2">📱 Instructions:</h4>
                        <ul className="text-yellow-700 text-sm space-y-1">
                          <li>
                            • Check your {validation.validationMethod === "sms" ? "text messages" : "email inbox"}
                          </li>
                          <li>• Enter the 6-digit code exactly as received</li>
                          <li>• Code expires in 10 minutes</li>
                          <li>• Maximum 3 attempts allowed</li>
                          {validation.validationMethod === "email" && <li>• Check spam/junk folder if not in inbox</li>}
                        </ul>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <Button
                          onClick={validateOTP}
                          className="flex-1 h-12 text-lg font-semibold hover-lift bg-gradient-to-r from-green-500 to-green-600"
                          disabled={currentOtpInput.length !== 6}
                        >
                          <ShieldAlert className="w-5 h-5 mr-2" />
                          Verify Code
                        </Button>
                        <Button
                          onClick={resendOTP}
                          variant="outline"
                          className="h-12 px-6 hover-lift"
                          disabled={otpSendingInProgress}
                        >
                          {otpSendingInProgress ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                          ) : (
                            <>
                              <Send className="w-4 h-4 mr-2" />
                              Resend
                            </>
                          )}
                        </Button>
                      </div>

                      {/* Cancel Button */}
                      <Button
                        onClick={cancelValidation}
                        variant="ghost"
                        className="w-full text-red-600 hover:bg-red-50"
                      >
                        Cancel Verification
                      </Button>

                      {/* Development Mode Helper */}
                      {process.env.NODE_ENV === "development" && (
                        <div className="bg-gray-100 border border-gray-300 rounded-lg p-3">
                          <div className="text-xs text-gray-600 text-center">
                            <strong>Development Mode:</strong> OTP Code is {validation.otp}
                          </div>
                        </div>
                      )}
                    </>
                  )
                })()}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
