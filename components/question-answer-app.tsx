"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import QuestionComponent from './QuestionComponent'
import NotesList from './NotesList'
import CodeEditor from './CodeEditor'

interface Question {
  id: number
  type: 'multiple-choice' | 'open-ended' | 'coding'
  question: string
  choices?: string[]
  correctAnswer: string
  explanation: string
  flag: 'dont-ask-again' | 'ask-less-often' | 'pass' | null
}

interface Note {
  questionId: number
  question: string
  userAnswer: string
  explanation: string
  isCorrect: boolean
  notes: string
  versions: string[]
}

export function QuestionAnswerAppComponent() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [score, setScore] = useState(0)
  const [notes, setNotes] = useState<Note[]>([])
  const [activeTab, setActiveTab] = useState('question')

  useEffect(() => {
    // Fetch questions from an API or load from a local file
    // For now, we'll use a placeholder
    setQuestions([
      {
        id: 1,
        type: 'multiple-choice',
        question: 'What is the capital of France?',
        choices: ['London', 'Berlin', 'Paris', 'Madrid'],
        correctAnswer: 'Paris',
        explanation: 'Paris is the capital and most populous city of France.',
        flag: null,
      },
      {
        id: 2,
        type: 'open-ended',
        question: 'Explain the concept of recursion in programming.',
        correctAnswer: 'Recursion is a programming concept where a function calls itself to solve a problem by breaking it down into smaller, similar sub-problems.',
        explanation: 'Recursion is a powerful technique used in many algorithms and data structures.',
        flag: null,
      },
      {
        id: 3,
        type: 'coding',
        question: 'Write a function that returns the factorial of a given number.',
        correctAnswer: 'function factorial(n) {\n  if (n === 0 || n === 1) return 1;\n  return n * factorial(n - 1);\n}',
        explanation: 'This function uses recursion to calculate the factorial of a number.',
        flag: null,
      },
    ])
  }, [])

  useEffect(() => {
    if (questions.length > 0 && !currentQuestion) {
      setRandomQuestion()
    }
  }, [questions, currentQuestion])

  const setRandomQuestion = () => {
    const availableQuestions = questions.filter(q => q.flag !== 'dont-ask-again')
    if (availableQuestions.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableQuestions.length)
      setCurrentQuestion(availableQuestions[randomIndex])
    } else {
      setCurrentQuestion(null)
    }
  }

  const handleAnswer = (answer: string) => {
    if (!currentQuestion) return

    const isCorrect = answer === currentQuestion.correctAnswer
    setScore(prevScore => prevScore + (isCorrect ? 1 : 0))

    const newNote: Note = {
      questionId: currentQuestion.id,
      question: currentQuestion.question,
      userAnswer: answer,
      explanation: currentQuestion.explanation,
      isCorrect,
      notes: '',
      versions: [],
    }

    setNotes(prevNotes => [...prevNotes, newNote])
    setRandomQuestion()
  }

  const handleFlag = (flag: 'dont-ask-again' | 'ask-less-often' | 'pass') => {
    if (!currentQuestion) return

    setQuestions(prevQuestions =>
      prevQuestions.map(q =>
        q.id === currentQuestion.id ? { ...q, flag } : q
      )
    )

    if (flag === 'pass') {
      setRandomQuestion()
    }
  }

  return (
    <div className="min-h-screen bg-blue-100 p-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-blue-800">Q&A App</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="question">Question</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>
            <TabsContent value="question">
              {currentQuestion ? (
                <>
                  <QuestionComponent
                    question={currentQuestion}
                    onAnswer={handleAnswer}
                    onFlag={handleFlag}
                  />
                  {currentQuestion.type === 'coding' && <CodeEditor />}
                </>
              ) : (
                <div className="text-center text-gray-500">No more questions available.</div>
              )}
            </TabsContent>
            <TabsContent value="notes">
              <NotesList notes={notes} setNotes={setNotes} />
            </TabsContent>
          </Tabs>
          <div className="mt-4 text-xl font-semibold text-blue-800">Score: {score}</div>
        </CardContent>
      </Card>
    </div>
  )
}