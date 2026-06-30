import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { HomePage } from '@/pages/HomePage'
import { LessonsPage } from '@/pages/LessonsPage'
import { LessonDetailPage } from '@/pages/LessonDetailPage'
import { VocabularyPage } from '@/pages/VocabularyPage'
import { QuizPage } from '@/pages/QuizPage'
import { ProgressPage } from '@/pages/ProgressPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/lessons" element={<LessonsPage />} />
          <Route path="/lessons/:id" element={<LessonDetailPage />} />
          <Route path="/vocabulary" element={<VocabularyPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/progress" element={<ProgressPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
