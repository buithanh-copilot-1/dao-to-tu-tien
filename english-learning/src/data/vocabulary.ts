import type { VocabWord } from '@/types'

export const VOCABULARY: VocabWord[] = [
  { id: 'v1', word: 'achieve', phonetic: '/əˈtʃiːv/', partOfSpeech: 'verb', definition: 'to successfully reach a goal', example: 'She achieved her dream of becoming a doctor.', level: 'intermediate' },
  { id: 'v2', word: 'beautiful', phonetic: '/ˈbjuːtɪfəl/', partOfSpeech: 'adjective', definition: 'pleasing to look at', example: 'The sunset was beautiful.', level: 'beginner' },
  { id: 'v3', word: 'confident', phonetic: '/ˈkɒnfɪdənt/', partOfSpeech: 'adjective', definition: 'feeling sure about your abilities', example: 'He felt confident before the interview.', level: 'intermediate' },
  { id: 'v4', word: 'delicious', phonetic: '/dɪˈlɪʃəs/', partOfSpeech: 'adjective', definition: 'having a very pleasant taste', example: 'This soup is delicious!', level: 'beginner' },
  { id: 'v5', word: 'efficient', phonetic: '/ɪˈfɪʃənt/', partOfSpeech: 'adjective', definition: 'working well without wasting time or energy', example: 'The new system is more efficient.', level: 'advanced' },
  { id: 'v6', word: 'generous', phonetic: '/ˈdʒenərəs/', partOfSpeech: 'adjective', definition: 'willing to give more than expected', example: 'She is very generous with her time.', level: 'intermediate' },
  { id: 'v7', word: 'hurry', phonetic: '/ˈhʌri/', partOfSpeech: 'verb', definition: 'to move or do something quickly', example: 'We need to hurry or we\'ll be late.', level: 'beginner' },
  { id: 'v8', word: 'improve', phonetic: '/ɪmˈpruːv/', partOfSpeech: 'verb', definition: 'to make or become better', example: 'I want to improve my English.', level: 'beginner' },
  { id: 'v9', word: 'journey', phonetic: '/ˈdʒɜːni/', partOfSpeech: 'noun', definition: 'an act of travelling from one place to another', example: 'The journey took three hours.', level: 'beginner' },
  { id: 'v10', word: 'knowledge', phonetic: '/ˈnɒlɪdʒ/', partOfSpeech: 'noun', definition: 'information and skills gained through experience', example: 'Reading expands your knowledge.', level: 'intermediate' },
  { id: 'v11', word: 'lively', phonetic: '/ˈlaɪvli/', partOfSpeech: 'adjective', definition: 'full of energy and enthusiasm', example: 'The market was lively and colourful.', level: 'intermediate' },
  { id: 'v12', word: 'magnificent', phonetic: '/mæɡˈnɪfɪsənt/', partOfSpeech: 'adjective', definition: 'extremely beautiful or impressive', example: 'The view from the mountain was magnificent.', level: 'advanced' },
  { id: 'v13', word: 'nervous', phonetic: '/ˈnɜːvəs/', partOfSpeech: 'adjective', definition: 'worried or anxious about something', example: 'I always feel nervous before exams.', level: 'beginner' },
  { id: 'v14', word: 'opportunity', phonetic: '/ˌɒpəˈtjuːnəti/', partOfSpeech: 'noun', definition: 'a chance to do something', example: 'This is a great opportunity to learn.', level: 'intermediate' },
  { id: 'v15', word: 'patient', phonetic: '/ˈpeɪʃənt/', partOfSpeech: 'adjective', definition: 'able to wait calmly without getting angry', example: 'Good teachers are patient with students.', level: 'beginner' },
  { id: 'v16', word: 'reliable', phonetic: '/rɪˈlaɪəbəl/', partOfSpeech: 'adjective', definition: 'able to be trusted to do what is expected', example: 'She is a reliable colleague.', level: 'advanced' },
  { id: 'v17', word: 'suggest', phonetic: '/səˈdʒest/', partOfSpeech: 'verb', definition: 'to propose an idea or plan', example: 'Can you suggest a good restaurant?', level: 'intermediate' },
  { id: 'v18', word: 'thorough', phonetic: '/ˈθʌrə/', partOfSpeech: 'adjective', definition: 'complete and careful about every detail', example: 'The police conducted a thorough investigation.', level: 'advanced' },
  { id: 'v19', word: 'unique', phonetic: '/juːˈniːk/', partOfSpeech: 'adjective', definition: 'being the only one of its kind', example: 'Every person has a unique story.', level: 'intermediate' },
  { id: 'v20', word: 'wonder', phonetic: '/ˈwʌndə/', partOfSpeech: 'verb', definition: 'to think about something with curiosity', example: 'I wonder what the answer is.', level: 'beginner' },
]

export function getVocabByLevel(level: string): VocabWord[] {
  return VOCABULARY.filter((v) => v.level === level)
}
