import { useMemo, useState } from 'react'
import { VOCABULARY } from '@/data/vocabulary'
import { useProgress } from '@/hooks/useProgress'
import type { Level, VocabWord } from '@/types'

const LEVELS: { value: Level | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
]

export function VocabularyPage() {
  const [level, setLevel] = useState<Level | 'all'>('all')
  const [cardIdx, setCardIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const { progress, learnWord } = useProgress()

  const words = useMemo(
    () => (level === 'all' ? VOCABULARY : VOCABULARY.filter((w) => w.level === level)),
    [level],
  )

  const current: VocabWord | undefined = words[cardIdx]
  const learned = current ? progress.learnedWords.includes(current.id) : false

  function next() {
    setFlipped(false)
    setCardIdx((i) => (i + 1) % words.length)
  }

  function prev() {
    setFlipped(false)
    setCardIdx((i) => (i - 1 + words.length) % words.length)
  }

  function handleKnow() {
    if (current) learnWord(current.id)
    next()
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Vocabulary</h1>
        <p>Flip the card to see the definition. Mark words you know to track progress.</p>
      </div>

      <div className="filter-bar">
        {LEVELS.map((l) => (
          <button
            key={l.value}
            className={`filter-btn${level === l.value ? ' filter-btn--active' : ''}`}
            onClick={() => { setLevel(l.value); setCardIdx(0); setFlipped(false) }}
          >
            {l.label}
          </button>
        ))}
      </div>

      {words.length === 0 ? (
        <p>No words for this level.</p>
      ) : current && (
        <div className="flashcard-area">
          <div className="flashcard-counter">
            {cardIdx + 1} / {words.length}
            {learned && <span className="flashcard-learned">✓ Learned</span>}
          </div>

          <button
            className={`flashcard${flipped ? ' flashcard--flipped' : ''}`}
            onClick={() => setFlipped((f) => !f)}
            aria-label="Flip card"
          >
            <div className="flashcard__inner">
              <div className="flashcard__front">
                <span className={`badge badge--${current.level}`}>{current.level}</span>
                <h2 className="flashcard__word">{current.word}</h2>
                <p className="flashcard__phonetic">{current.phonetic}</p>
                <p className="flashcard__pos">{current.partOfSpeech}</p>
                <span className="flashcard__hint">Tap to flip</span>
              </div>
              <div className="flashcard__back">
                <p className="flashcard__definition">{current.definition}</p>
                <blockquote className="flashcard__example">"{current.example}"</blockquote>
              </div>
            </div>
          </button>

          <div className="flashcard-actions">
            <button className="btn btn--outline" onClick={prev}>← Prev</button>
            <button className="btn btn--secondary" onClick={handleKnow}>
              I know this ✓
            </button>
            <button className="btn btn--outline" onClick={next}>Next →</button>
          </div>
        </div>
      )}
    </div>
  )
}
