import { useCallback, useEffect, useState } from 'react'
import type { UserProgress } from '@/types'

const STORAGE_KEY = 'lingua-progress'

const defaultProgress: UserProgress = {
  completedLessons: [],
  learnedWords: [],
  quizScores: {},
  streak: 0,
  lastStudyDate: null,
  totalStudyMinutes: 0,
}

function loadProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...defaultProgress, ...JSON.parse(raw) }
  } catch {
    /* ignore */
  }
  return { ...defaultProgress }
}

function saveProgress(progress: UserProgress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

function updateStreak(progress: UserProgress): UserProgress {
  const today = todayStr()
  if (progress.lastStudyDate === today) return progress

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().slice(0, 10)

  const newStreak =
    progress.lastStudyDate === yesterdayStr ? progress.streak + 1 : 1

  return { ...progress, streak: newStreak, lastStudyDate: today }
}

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(loadProgress)

  useEffect(() => {
    saveProgress(progress)
  }, [progress])

  const completeLesson = useCallback((lessonId: string, minutes: number) => {
    setProgress((prev) => {
      if (prev.completedLessons.includes(lessonId)) return prev
      const updated = updateStreak(prev)
      return {
        ...updated,
        completedLessons: [...updated.completedLessons, lessonId],
        totalStudyMinutes: updated.totalStudyMinutes + minutes,
      }
    })
  }, [])

  const learnWord = useCallback((wordId: string) => {
    setProgress((prev) => {
      if (prev.learnedWords.includes(wordId)) return prev
      const updated = updateStreak(prev)
      return {
        ...updated,
        learnedWords: [...updated.learnedWords, wordId],
      }
    })
  }, [])

  const saveQuizScore = useCallback((quizId: string, score: number) => {
    setProgress((prev) => {
      const updated = updateStreak(prev)
      const best = Math.max(updated.quizScores[quizId] ?? 0, score)
      return {
        ...updated,
        quizScores: { ...updated.quizScores, [quizId]: best },
      }
    })
  }, [])

  const resetProgress = useCallback(() => {
    setProgress({ ...defaultProgress })
  }, [])

  return { progress, completeLesson, learnWord, saveQuizScore, resetProgress }
}
