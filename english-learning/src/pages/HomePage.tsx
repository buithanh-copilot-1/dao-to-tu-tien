import { Link } from 'react-router-dom'
import { LESSONS } from '@/data/lessons'
import { VOCABULARY } from '@/data/vocabulary'
import { useProgress } from '@/hooks/useProgress'

export function HomePage() {
  const { progress } = useProgress()
  const totalLessons = LESSONS.length
  const totalWords = VOCABULARY.length

  return (
    <div className="page home">
      <section className="hero">
        <div className="hero__content">
          <span className="hero__badge">Free English Learning Platform</span>
          <h1 className="hero__title">
            Master English at<br />
            <span className="hero__accent">your own pace</span>
          </h1>
          <p className="hero__subtitle">
            Interactive lessons, vocabulary flashcards, and quizzes — all designed
            to help you build confidence in reading, writing, and grammar.
          </p>
          <div className="hero__actions">
            <Link to="/lessons" className="btn btn--primary btn--lg">
              Start Learning
            </Link>
            <Link to="/vocabulary" className="btn btn--outline btn--lg">
              Practice Words
            </Link>
          </div>
        </div>
        <div className="hero__stats">
          <div className="stat-card">
            <span className="stat-card__value">{progress.completedLessons.length}/{totalLessons}</span>
            <span className="stat-card__label">Lessons Done</span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">{progress.learnedWords.length}/{totalWords}</span>
            <span className="stat-card__label">Words Learned</span>
          </div>
          <div className="stat-card">
            <span className="stat-card__value">{progress.streak}</span>
            <span className="stat-card__label">Day Streak</span>
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="section__title">What you'll learn</h2>
        <div className="feature-grid">
          <Link to="/lessons" className="feature-card">
            <div className="feature-card__icon">📚</div>
            <h3>Grammar & Reading</h3>
            <p>Structured lessons from beginner to advanced, with clear explanations and examples.</p>
          </Link>
          <Link to="/vocabulary" className="feature-card">
            <div className="feature-card__icon">📝</div>
            <h3>Vocabulary Builder</h3>
            <p>Flashcard-style practice with phonetics, definitions, and real example sentences.</p>
          </Link>
          <Link to="/quiz" className="feature-card">
            <div className="feature-card__icon">✏️</div>
            <h3>Interactive Quizzes</h3>
            <p>Test your knowledge with instant feedback and detailed explanations.</p>
          </Link>
          <Link to="/progress" className="feature-card">
            <div className="feature-card__icon">📊</div>
            <h3>Track Progress</h3>
            <p>Monitor your streak, completed lessons, and quiz scores over time.</p>
          </Link>
        </div>
      </section>

      <section className="section">
        <h2 className="section__title">Learning levels</h2>
        <div className="level-grid">
          <div className="level-card level-card--beginner">
            <span className="level-card__tag">Beginner</span>
            <p>Present & past tenses, articles, everyday vocabulary</p>
            <Link to="/lessons?level=beginner" className="btn btn--sm">Explore →</Link>
          </div>
          <div className="level-card level-card--intermediate">
            <span className="level-card__tag">Intermediate</span>
            <p>Perfect tenses, conditionals, reading comprehension</p>
            <Link to="/lessons?level=intermediate" className="btn btn--sm">Explore →</Link>
          </div>
          <div className="level-card level-card--advanced">
            <span className="level-card__tag">Advanced</span>
            <p>Passive voice, nuanced vocabulary, complex grammar</p>
            <Link to="/lessons?level=advanced" className="btn btn--sm">Explore →</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
