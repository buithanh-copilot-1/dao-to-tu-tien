import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getLessonById } from '@/data/lessons'
import { useProgress } from '@/hooks/useProgress'

export function LessonDetailPage() {
  const { id } = useParams<{ id: string }>()
  const lesson = getLessonById(id ?? '')
  const { progress, completeLesson } = useProgress()
  const [sectionIdx, setSectionIdx] = useState(0)

  if (!lesson) {
    return (
      <div className="page">
        <p>Lesson not found.</p>
        <Link to="/lessons">← Back to lessons</Link>
      </div>
    )
  }

  const done = progress.completedLessons.includes(lesson.id)
  const section = lesson.content[sectionIdx]
  const isLast = sectionIdx === lesson.content.length - 1

  return (
    <div className="page lesson-detail">
      <Link to="/lessons" className="back-link">← Back to lessons</Link>

      <div className="lesson-detail__header">
        <span className={`badge badge--${lesson.level}`}>{lesson.level}</span>
        <span className="badge badge--category">{lesson.category}</span>
        {done && <span className="badge badge--done">Completed</span>}
      </div>

      <h1>{lesson.title}</h1>
      <p className="lesson-detail__desc">{lesson.description}</p>

      <div className="section-progress">
        {lesson.content.map((_, i) => (
          <button
            key={i}
            className={`section-dot${i === sectionIdx ? ' section-dot--active' : ''}${i < sectionIdx ? ' section-dot--done' : ''}`}
            onClick={() => setSectionIdx(i)}
            aria-label={`Section ${i + 1}`}
          />
        ))}
      </div>

      <article className="lesson-content">
        <h2>{section.heading}</h2>
        <p className="lesson-content__body">{section.body}</p>
        {section.examples && (
          <ul className="lesson-content__examples">
            {section.examples.map((ex, i) => (
              <li key={i}>{ex}</li>
            ))}
          </ul>
        )}
      </article>

      <div className="lesson-detail__nav">
        <button
          className="btn btn--outline"
          disabled={sectionIdx === 0}
          onClick={() => setSectionIdx((i) => i - 1)}
        >
          Previous
        </button>

        {isLast ? (
          <button
            className="btn btn--primary"
            disabled={done}
            onClick={() => completeLesson(lesson.id, lesson.durationMin)}
          >
            {done ? 'Already Completed' : 'Mark as Complete'}
          </button>
        ) : (
          <button
            className="btn btn--primary"
            onClick={() => setSectionIdx((i) => i + 1)}
          >
            Next Section
          </button>
        )}
      </div>
    </div>
  )
}
