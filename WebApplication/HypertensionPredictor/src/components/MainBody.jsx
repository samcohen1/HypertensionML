import { useState } from 'react'
import './MainBody.css'
import questions from '../questions.js'
import Questions from './Questions'
import Results from './Results.jsx'

export default function MainBody () {
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState([])
  const [prediction, setPrediction] = useState(null) // State to store prediction

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
    console.log('')
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
          setPrediction(data.prediction) // Set prediction state
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
                <p className='home-text'>The International Hypertension Federation (IHF) estimates that many people are at risk of developing hypertension,
                  often undiagnosed. Find out your risk with our quick, easy, and confidential assessment.
                </p>
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
              : <Results prediction={prediction} />}
        </div>
      </section>
      {/* {prediction && (
        <div className='prediction'>
          <p>Prediction Probability: {prediction}</p>
        </div>
      )} */}
    </>
  )
}
