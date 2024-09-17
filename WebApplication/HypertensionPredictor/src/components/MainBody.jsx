import './MainBody.css'
import questions from '../questions.js'
import { useState } from 'react'
import Questions from './Questions'

export default function MainBody () {
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState([])

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
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  }

  const body = (index === 0
    ? (
      <p className='home-text'> The International Hypertension Federation (IHF) estimates that many people are at risk of developing hypertension,
        often undiagnosed. Find out your risk with our quick, easy, and confidential assessment.
      </p>
      )
    : (
      <Questions
        index={index} onSaveAnswer={handleSaveAnswer} questionData={questions[index - 1]}
        onChangeIndex={handleIndexChange} answers={answers} onSubmit={handleSubmission}
      />
      ))

  return (
    <>
      <section className='body-section'>
        <div className='text-content'>
          {body}
        </div>
      </section>
      {index === 0 ? <button className='start-button' onClick={() => setIndex(1)}>Start Assessment</button> : null}
    </>
  )
}
