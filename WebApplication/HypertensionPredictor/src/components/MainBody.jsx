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

  const body = (index === 0
    ? (
      <p className='home-text'> The International Hypertension Federation (IHF) estimates that many people are at risk of developing hypertension,
        often undiagnosed. Find out your risk with our quick, easy, and confidential assessment.
      </p>
      )
    : (
      <Questions
        index={index} onSaveAnswer={handleSaveAnswer} questionData={questions[index - 1]}
        onChangeIndex={handleIndexChange} answers={answers}
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
