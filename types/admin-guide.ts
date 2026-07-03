export interface GuideStep {
  id: string
  title: string
  description: string
  duration: string
  estimatedTime: number
  difficulty: "beginner" | "intermediate" | "advanced"
  category: string
  completed: boolean
  route?: string
  prerequisites?: string[]
  actions: GuideAction[]
}

export interface GuideAction {
  type: "navigate" | "test" | "verify" | "configure"
  label: string
  url?: string
  description: string
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  type: "text" | "image" | "file" | "guide"
  isUser?: boolean
  relatedGuides?: string[]
  metadata?: {
    confidence?: number
    category?: string
    relatedGuides?: string[]
    guideId?: string
    route?: string
  }
}

export interface QuickQuestion {
  id: string
  question: string
  category: string
  answer: string
  relatedGuides: string[]
}

export interface KnowledgeItem {
  id: string
  title: string
  content: string
  answer?: string
  question?: string
  category: string
  tags: string[]
  keywords?: string[]
  relatedTopics?: string[]
  difficulty: "basic" | "intermediate" | "advanced"
  relatedItems: string[]
  lastUpdated: Date
}

export interface GuideProgress {
  completed: number
  total: number
  percentage: number
}
