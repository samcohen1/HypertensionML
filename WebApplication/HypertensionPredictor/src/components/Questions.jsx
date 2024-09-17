import { useState, useEffect } from 'react'
import './Questions.css'
import Navigation from './Navigation'

export default function Questions ({ index, onSaveAnswer, questionData, onChangeIndex, answers, onSubmit }) {
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [triggerSubmit, setTriggerSubmit] = useState(false)

  useEffect(() => {
    setSelectedAnswer(answers[index - 1])
  }, [index, answers])

  useEffect(() => {
    if (triggerSubmit) {
      onSubmit()
      setTriggerSubmit(false)
    }
  }, [answers, triggerSubmit, onSubmit])

  function handleNavigation (navigation) {
    if (navigation === 1) {
      if (!selectedAnswer) {
        setErrorMessage(<p className='error-message'>Please select an answer.</p>)
      } else {
        onSaveAnswer(index, selectedAnswer)
        onChangeIndex((prevIndex) => prevIndex + navigation)
        setSelectedAnswer('')
        setErrorMessage('')
      }
    } else {
      onChangeIndex((prevIndex) => prevIndex + navigation)
      setErrorMessage('')
    }
  }

  function handleSubmission () {
    if (!selectedAnswer) {
      setErrorMessage(<p className='error-message'>Please select an answer.</p>)
    } else {
      onSaveAnswer(index, selectedAnswer)
      setTriggerSubmit(true)
      setSelectedAnswer('')
      setErrorMessage('')
      onChangeIndex((prevIndex) => prevIndex + 1)
    }
  }

  function handleInputChange (event) {
    setSelectedAnswer(event.target.value)
  }

  function handleOptionChange (caption) {
    setSelectedAnswer(caption)
  }

  const answersClass = questionData.answers.length > 4 ? 'two-columns' : ''

  return (
    <>
      <div className='question-card'>
        <div className='question-header'>
          <span className='question-index'>{index}</span>
          <h2 className='question-heading'>{questionData.heading}</h2>
        </div>
        <p className='question-text'>{questionData.question}</p>
        {errorMessage}
        <div className={`question-answers ${answersClass}`}>
          {questionData.answers.map((answer, i) => (
            answer.answerType === 'text'
              ? (
                <input
                  key={i}
                  type='text'
                  placeholder={`Enter ${answer.caption.toLowerCase()}`}
                  value={selectedAnswer}
                  onChange={handleInputChange}
                  className='text-input'
                />
                )
              : (
                <label key={i} className='option-label'>
                  <input
                    type='radio'
                    name={`question-${index}`}
                    value={answer.caption}
                    checked={selectedAnswer === answer.caption}
                    onChange={() => handleOptionChange(answer.caption)}
                    className='option-input'
                  />
                  {answer.caption}
                </label>
                )
          ))}
        </div>
      </div>
      <Navigation index={index} onNavigation={handleNavigation} onSubmit={handleSubmission} />
    </>
  )
}
