import type { CSSProperties } from 'react'
import { LESSONS } from '@/data/lessons'
import { VOCABULARY } from '@/data/vocabulary'
import { useProgress } from '@/hooks/useProgress'

export function ProgressPage() {
  const { progress, resetProgress } = useProgress()

  const lessonPct = Math.round((progress.completedLessons.length / LESSONS.length) * 100)
  const vocabPct = Math.round((progress.learnedWords.length / VOCABULARY.length) * 100)
  const quizEntries = Object.entries(progress.quizScores)
  const bestQuiz = quizEntries.length > 0 ? Math.max(...quizEntries.map(([, s]) => s)) : 0

  return (
    <div className="page">
      <div className="page-header">
        <h1>Your Progress</h1>
        <p>Track your learning journey and celebrate milestones.</p>
      </div>

      <div className="progress-overview">
        <div className="progress-stat">
          <div className="progress-ring" style={{ '--pct': progress.streak } as CSSProperties}>
            <span className="progress-ring__value">🔥 {progress.streak}</span>
          </div>
          <span>Day Streak</span>
        </div>
        <div className="progress-stat">
          <div className="progress-ring progress-ring--lessons" style={{ '--pct': lessonPct } as CSSProperties}>
            <span className="progress-ring__value">{lessonPct}%</span>
          </div>
          <span>Lessons</span>
        </div>
        <div className="progress-stat">
          <div className="progress-ring progress-ring--vocab" style={{ '--pct': vocabPct } as CSSProperties}>
            <span className="progress-ring__value">{vocabPct}%</span>
          </div>
          <span>Vocabulary</span>
        </div>
        <div className="progress-stat">
          <div className="progress-ring progress-ring--quiz" style={{ '--pct': bestQuiz } as CSSProperties}>
            <span className="progress-ring__value">{bestQuiz}%</span>
          </div>
          <span>Best Quiz</span>
        </div>
      </div>

      <div className="progress-details">
        <div className="progress-card">
          <h3>Study Time</h3>
          <p className="progress-card__big">{progress.totalStudyMinutes} min</p>
          <p className="progress-card__sub">Total time spent on lessons</p>
        </div>

        <div className="progress-card">
          <h3>Completed Lessons</h3>
          {progress.completedLessons.length === 0 ? (
            <p className="progress-card__empty">No lessons completed yet. <a href="/lessons">Start learning →</a></p>
          ) : (
            <ul className="progress-list">
              {progress.completedLessons.map((id) => {
                const lesson = LESSONS.find((l) => l.id === id)
                return lesson ? <li key={id}>✓ {lesson.title}</li> : null
              })}
            </ul>
          )}
        </div>

        <div className="progress-card">
          <h3>Words Learned</h3>
          <p className="progress-card__big">{progress.learnedWords.length} / {VOCABULARY.length}</p>
          <div className="progress-bar">
            <div className="progress-bar__fill" style={{ width: `${vocabPct}%` }} />
          </div>
        </div>

        <div className="progress-card">
          <h3>Quiz Scores</h3>
          {quizEntries.length === 0 ? (
            <p className="progress-card__empty">No quizzes taken yet. <a href="/quiz">Take a quiz →</a></p>
          ) : (
            <ul className="progress-list">
              {quizEntries.map(([id, score]) => (
                <li key={id}>{id.replace('quiz-', '')}: {score}%</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="progress-actions">
        <button className="btn btn--outline btn--danger" onClick={() => {
          if (confirm('Reset all progress? This cannot be undone.')) resetProgress()
        }}>
          Reset Progress
        </button>
      </div>
    </div>
  )
}
