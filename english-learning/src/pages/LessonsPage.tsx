import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { LESSONS } from '@/data/lessons'
import { useProgress } from '@/hooks/useProgress'
import type { Level } from '@/types'

const LEVELS: { value: Level | 'all'; label: string }[] = [
  { value: 'all', label: 'All Levels' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
]

const CATEGORY_ICONS: Record<string, string> = {
  grammar: '📖',
  reading: '📰',
  listening: '🎧',
  speaking: '🗣️',
}

export function LessonsPage() {
  const [params, setParams] = useSearchParams()
  const level = (params.get('level') ?? 'all') as Level | 'all'
  const { progress } = useProgress()

  const filtered = useMemo(
    () => (level === 'all' ? LESSONS : LESSONS.filter((l) => l.level === level)),
    [level],
  )

  return (
    <div className="page">
      <div className="page-header">
        <h1>Lessons</h1>
        <p>Grammar and reading lessons organized by difficulty level.</p>
      </div>

      <div className="filter-bar">
        {LEVELS.map((l) => (
          <button
            key={l.value}
            className={`filter-btn${level === l.value ? ' filter-btn--active' : ''}`}
            onClick={() => {
              if (l.value === 'all') setParams({})
              else setParams({ level: l.value })
            }}
          >
            {l.label}
          </button>
        ))}
      </div>

      <div className="lesson-grid">
        {filtered.map((lesson) => {
          const done = progress.completedLessons.includes(lesson.id)
          return (
            <Link key={lesson.id} to={`/lessons/${lesson.id}`} className="lesson-card">
              <div className="lesson-card__top">
                <span className="lesson-card__icon">{CATEGORY_ICONS[lesson.category]}</span>
                <span className={`badge badge--${lesson.level}`}>{lesson.level}</span>
                {done && <span className="lesson-card__done">✓</span>}
              </div>
              <h3 className="lesson-card__title">{lesson.title}</h3>
              <p className="lesson-card__desc">{lesson.description}</p>
              <div className="lesson-card__meta">
                <span>{lesson.durationMin} min</span>
                <span className="lesson-card__category">{lesson.category}</span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
