// MainBody.jsx
import { useState } from 'react'
import './MainBody.css'
import questions from '../questions.js'
import Questions from './Questions'
import Results from './Results'
import Information from './Information.jsx'
import RiskFactors from './RiskFactors.jsx'

// Helper function to determine if a question should be skipped
function shouldSkipQuestion (currentIndex, answers) {
  // Example logic: Adjust indexes as necessary based on your question order
  const smokingFrequencyAnswer = answers[8] // Index 8 corresponds to the "Smoking" question

  // Check if the next question is the "Quit Smoking Age" question (index 11)
  if (currentIndex === 11 && (smokingFrequencyAnswer === 'Every Day' || smokingFrequencyAnswer === 'Sometimes')) {
    const ageAnswer = answers[0] // Index 0 corresponds to the "Age" question
    return { skip: true, autoFillValue: ageAnswer }
  }

  return { skip: false }
}

export default function MainBody () {
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState([])
  const [prediction, setPrediction] = useState(null)
  const [riskFactors, setRiskFactors] = useState({})

  function handleSaveAnswer (index, answer) {
    setAnswers((prevAnswers) => {
      const newAnswers = [...prevAnswers]
      newAnswers[index - 1] = answer
      console.log(newAnswers)
      return newAnswers
    })
  }

  function handleIndexChange (newIndex) {
    setIndex(newIndex)
  }

  function handleSubmission () {
    fetch('http://localhost:5000/api/submit_answers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ answers })
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data)
        if (data.status === 'success') {
          setPrediction(data.prediction)
          setRiskFactors(data.shap_values)
        }
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  }

  return (
    <>
      <section className='body-section'>
        <div className='text-content'>
          {index === 0
            ? (
              <>
                <Information />
                <button className='start-button' onClick={() => setIndex(1)}>Start Assessment</button>
              </>
              )
            : prediction === null
              ? (
                <Questions
                  index={index}
                  onSaveAnswer={handleSaveAnswer}
                  questionData={questions[index - 1]}
                  onChangeIndex={handleIndexChange}
                  answers={answers}
                  onSubmit={handleSubmission}
                />
                )
              : <>
                <Results prediction={prediction} />
                <RiskFactors shapValues={riskFactors} />
                </>}

        </div>
      </section>
    </>
  )
}
