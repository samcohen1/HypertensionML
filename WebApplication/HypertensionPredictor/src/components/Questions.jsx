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

  useEffect(() => {
    if (triggerSubmit) {
      onSubmit()
      setTriggerSubmit(false)
    }
  }, [answers, triggerSubmit, onSubmit])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        if (index === 20) {
          handleSubmission() // Last question, submit the form
        } else {
          handleNavigation(1) // Move to the next question
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [index, selectedAnswer])

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
    }
  }

  function handleSliderChange (event) {
    setSelectedAnswer(event.target.value)
  }

  function getSliderPosition (value, min, max) {
    return ((value - min) / (max - min)) * 100
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
            answer.answerType === 'slider'
              ? (
                <div key={i} className='slider-container'>
                  <div
                    className='slider-value'
                    style={{
                      left: `calc(${getSliderPosition(selectedAnswer || answer.min, answer.min, answer.max)}% - 15px)`
                    }}
                  >
                    {selectedAnswer || answer.min}
                  </div>

                  <input
                    type='range'
                    min={answer.min}
                    max={answer.max}
                    value={selectedAnswer || answer.min}
                    onChange={handleSliderChange}
                    className='slider-input'
                    style={{
                      background: `linear-gradient(90deg, #007bff ${getSliderPosition(selectedAnswer || answer.min, answer.min, answer.max)}%, #ddd ${getSliderPosition(selectedAnswer || answer.min, answer.min, answer.max)}%)`
                    }}
                  />
                </div>
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
