export type Level = 'beginner' | 'intermediate' | 'advanced'

export type LessonCategory = 'grammar' | 'reading' | 'listening' | 'speaking'

export interface Lesson {
  id: string
  title: string
  description: string
  level: Level
  category: LessonCategory
  durationMin: number
  content: LessonSection[]
}

export interface LessonSection {
  heading: string
  body: string
  examples?: string[]
}

export interface VocabWord {
  id: string
  word: string
  phonetic: string
  partOfSpeech: string
  definition: string
  example: string
  level: Level
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
  level: Level
  category: 'grammar' | 'vocabulary'
}

export interface UserProgress {
  completedLessons: string[]
  learnedWords: string[]
  quizScores: Record<string, number>
  streak: number
  lastStudyDate: string | null
  totalStudyMinutes: number
}
