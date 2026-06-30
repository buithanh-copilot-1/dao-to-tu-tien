import { useCallback, useMemo, useState } from 'react'
import { QUIZ_QUESTIONS } from '@/data/quizzes'
import { useProgress } from '@/hooks/useProgress'
import type { Level } from '@/types'

const LEVELS: { value: Level | 'all'; label: string }[] = [
  { value: 'all', label: 'All Levels' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
]

export function QuizPage() {
  const [level, setLevel] = useState<Level | 'all'>('all')
  const [qIdx, setQIdx] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const { saveQuizScore } = useProgress()

  const questions = useMemo(
    () => (level === 'all' ? QUIZ_QUESTIONS : QUIZ_QUESTIONS.filter((q) => q.level === level)),
    [level],
  )

  const current = questions[qIdx]
  const answered = selected !== null

  const restart = useCallback(() => {
    setQIdx(0)
    setSelected(null)
    setScore(0)
    setFinished(false)
  }, [])

  function pickOption(idx: number) {
    if (answered || !current) return
    setSelected(idx)
    if (idx === current.correctIndex) setScore((s) => s + 1)
  }

  function next() {
    if (qIdx + 1 >= questions.length) {
      const pct = Math.round((score / questions.length) * 100)
      saveQuizScore(`quiz-${level}`, pct)
      setFinished(true)
    } else {
      setQIdx((i) => i + 1)
      setSelected(null)
    }
  }

  function changeLevel(l: Level | 'all') {
    setLevel(l)
    restart()
  }

  if (questions.length === 0) {
    return (
      <div className="page">
        <div className="page-header"><h1>Quiz</h1></div>
        <p>No questions for this level.</p>
      </div>
    )
  }

  if (finished) {
    const pct = Math.round((score / questions.length) * 100)
    return (
      <div className="page quiz-result">
        <div className="quiz-result__card">
          <h1>Quiz Complete!</h1>
          <div className="quiz-result__score">{pct}%</div>
          <p>
            You got <strong>{score}</strong> out of <strong>{questions.length}</strong> correct.
          </p>
          {pct >= 80 && <p className="quiz-result__msg">Excellent work! 🎉</p>}
          {pct >= 50 && pct < 80 && <p className="quiz-result__msg">Good job! Keep practicing. 💪</p>}
          {pct < 50 && <p className="quiz-result__msg">Review the lessons and try again. 📚</p>}
          <button className="btn btn--primary" onClick={restart}>Try Again</button>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Quiz</h1>
        <p>Test your grammar and vocabulary knowledge.</p>
      </div>

      <div className="filter-bar">
        {LEVELS.map((l) => (
          <button
            key={l.value}
            className={`filter-btn${level === l.value ? ' filter-btn--active' : ''}`}
            onClick={() => changeLevel(l.value)}
          >
            {l.label}
          </button>
        ))}
      </div>

      <div className="quiz-area">
        <div className="quiz-progress">
          Question {qIdx + 1} of {questions.length}
          <div className="quiz-progress__bar">
            <div
              className="quiz-progress__fill"
              style={{ width: `${((qIdx + (answered ? 1 : 0)) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {current && (
          <>
            <div className="quiz-question">
              <span className={`badge badge--${current.level}`}>{current.category}</span>
              <h2>{current.question}</h2>
            </div>

            <div className="quiz-options">
              {current.options.map((opt, i) => {
                let cls = 'quiz-option'
                if (answered) {
                  if (i === current.correctIndex) cls += ' quiz-option--correct'
                  else if (i === selected) cls += ' quiz-option--wrong'
                } else if (i === selected) cls += ' quiz-option--selected'
                return (
                  <button key={i} className={cls} onClick={() => pickOption(i)} disabled={answered}>
                    <span className="quiz-option__letter">{String.fromCharCode(65 + i)}</span>
                    {opt}
                  </button>
                )
              })}
            </div>

            {answered && (
              <div className="quiz-feedback">
                <p>{current.explanation}</p>
                <button className="btn btn--primary" onClick={next}>
                  {qIdx + 1 >= questions.length ? 'See Results' : 'Next Question'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
