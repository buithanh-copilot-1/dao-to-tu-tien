import type { Lesson } from '@/types'

export const LESSONS: Lesson[] = [
  {
    id: 'present-simple',
    title: 'Present Simple Tense',
    description: 'Learn when and how to use the present simple for habits, facts, and routines.',
    level: 'beginner',
    category: 'grammar',
    durationMin: 10,
    content: [
      {
        heading: 'What is Present Simple?',
        body: 'The present simple tense describes habits, routines, general truths, and permanent situations. We use it for things that happen regularly or are always true.',
        examples: [
          'I drink coffee every morning.',
          'The sun rises in the east.',
          'She works at a hospital.',
        ],
      },
      {
        heading: 'Form',
        body: 'For most verbs, use the base form. Add -s or -es for he/she/it. Use do/does for questions and negatives.',
        examples: [
          'I play tennis. / She plays tennis.',
          'Do you like pizza? / Does he like pizza?',
          "They don't live here. / He doesn't live here.",
        ],
      },
      {
        heading: 'Time Expressions',
        body: 'Common words that signal present simple: always, usually, often, sometimes, never, every day/week/month.',
        examples: [
          'I always brush my teeth before bed.',
          'We sometimes go to the cinema on Fridays.',
        ],
      },
    ],
  },
  {
    id: 'past-simple',
    title: 'Past Simple Tense',
    description: 'Talk about completed actions and events in the past.',
    level: 'beginner',
    category: 'grammar',
    durationMin: 12,
    content: [
      {
        heading: 'Regular Verbs',
        body: 'Add -ed to regular verbs. For verbs ending in -e, add only -d. Double the final consonant after a short vowel.',
        examples: [
          'walk → walked',
          'live → lived',
          'stop → stopped',
        ],
      },
      {
        heading: 'Irregular Verbs',
        body: 'Many common verbs are irregular and must be memorized. The past form does not follow the -ed pattern.',
        examples: [
          'go → went',
          'eat → ate',
          'see → saw',
          'buy → bought',
        ],
      },
      {
        heading: 'Usage',
        body: 'Use past simple for actions that started and finished at a specific time in the past.',
        examples: [
          'I visited London last summer.',
          'She finished her homework yesterday.',
        ],
      },
    ],
  },
  {
    id: 'articles',
    title: 'Articles: A, An, The',
    description: 'Master definite and indefinite articles in English.',
    level: 'beginner',
    category: 'grammar',
    durationMin: 8,
    content: [
      {
        heading: 'Indefinite Articles (a / an)',
        body: 'Use "a" before consonant sounds and "an" before vowel sounds. They refer to non-specific things.',
        examples: [
          'a book, a university (yoo- sound)',
          'an apple, an hour (silent h)',
        ],
      },
      {
        heading: 'Definite Article (the)',
        body: 'Use "the" when the listener knows which specific thing you mean, or for unique things.',
        examples: [
          'The book on the table is mine.',
          'The sun is very bright today.',
        ],
      },
    ],
  },
  {
    id: 'present-perfect',
    title: 'Present Perfect Tense',
    description: 'Connect the past to the present with have/has + past participle.',
    level: 'intermediate',
    category: 'grammar',
    durationMin: 15,
    content: [
      {
        heading: 'Form',
        body: 'Subject + have/has + past participle. Use "have" with I/you/we/they and "has" with he/she/it.',
        examples: [
          'I have lived here for five years.',
          'She has already finished the report.',
        ],
      },
      {
        heading: 'Uses',
        body: 'Present perfect describes experiences, unfinished time periods, and recent actions with present relevance.',
        examples: [
          'Have you ever been to Japan?',
          'I have lost my keys. (still lost now)',
        ],
      },
    ],
  },
  {
    id: 'conditionals',
    title: 'First & Second Conditionals',
    description: 'Express real and hypothetical situations with if-clauses.',
    level: 'intermediate',
    category: 'grammar',
    durationMin: 14,
    content: [
      {
        heading: 'First Conditional',
        body: 'If + present simple, will + base verb. Used for real, possible future situations.',
        examples: [
          'If it rains, I will stay home.',
          'If you study hard, you will pass the exam.',
        ],
      },
      {
        heading: 'Second Conditional',
        body: 'If + past simple, would + base verb. Used for hypothetical or unlikely situations.',
        examples: [
          'If I won the lottery, I would travel the world.',
          'If I were you, I would apologize.',
        ],
      },
    ],
  },
  {
    id: 'reading-cafe',
    title: 'A Day at the Café',
    description: 'Short reading passage about ordering food and making small talk.',
    level: 'beginner',
    category: 'reading',
    durationMin: 8,
    content: [
      {
        heading: 'Reading Passage',
        body: `Sarah walked into a small café on a rainy afternoon. The smell of fresh coffee filled the air. She sat by the window and opened her book.

A friendly waiter came over. "Good afternoon! What can I get for you today?" he asked with a smile.

"I'd like a cappuccino and a slice of chocolate cake, please," Sarah replied.

"Coming right up!" said the waiter. Sarah enjoyed her treat while watching people walk by with colourful umbrellas.`,
      },
      {
        heading: 'Key Vocabulary',
        body: 'café, waiter, cappuccino, slice, treat, umbrella',
      },
      {
        heading: 'Comprehension Tips',
        body: 'When reading, look for context clues around unfamiliar words. The setting (café) helps you guess words like "cappuccino" and "waiter".',
      },
    ],
  },
  {
    id: 'reading-travel',
    title: 'Planning a Trip',
    description: 'Read about booking flights and preparing for international travel.',
    level: 'intermediate',
    category: 'reading',
    durationMin: 10,
    content: [
      {
        heading: 'Reading Passage',
        body: `Mark had always dreamed of visiting Japan. After saving money for two years, he finally booked his flight to Tokyo.

He researched the best neighbourhoods to stay in, downloaded a translation app, and learned a few basic Japanese phrases. "Arigatou" means thank you, and "sumimasen" means excuse me.

On the day of departure, Mark arrived at the airport three hours early. He checked in online, went through security, and found his gate. As the plane took off, he felt excited about the adventure ahead.`,
      },
      {
        heading: 'Discussion Questions',
        body: '1. How long did Mark save money? 2. What apps or tools did he prepare? 3. Why did he arrive early at the airport?',
      },
    ],
  },
  {
    id: 'passive-voice',
    title: 'Passive Voice',
    description: 'Learn to shift focus from the doer to the action or receiver.',
    level: 'advanced',
    category: 'grammar',
    durationMin: 12,
    content: [
      {
        heading: 'Structure',
        body: 'Subject + be + past participle (+ by agent). The object of an active sentence becomes the subject.',
        examples: [
          'Active: The chef cooked the meal.',
          'Passive: The meal was cooked by the chef.',
        ],
      },
      {
        heading: 'When to Use',
        body: 'Use passive voice when the doer is unknown, unimportant, or obvious from context.',
        examples: [
          'The window was broken. (we don\'t know who)',
          'English is spoken worldwide.',
        ],
      },
    ],
  },
]

export function getLessonById(id: string): Lesson | undefined {
  return LESSONS.find((l) => l.id === id)
}

export function getLessonsByLevel(level: string): Lesson[] {
  return LESSONS.filter((l) => l.level === level)
}
