import { useState } from 'react'
import './Questions.css'
import Navigation from './Navigation'

export default function Questions ({ index, onSaveAnswer, questionData, onChangeIndex }) {
  const [selectedAnswer, setSelectedAnswer] = useState('')

  function handleNavigation (navigation) {
    onSaveAnswer(index, selectedAnswer)
    onChangeIndex((prevIndex) => prevIndex + navigation)
    setSelectedAnswer('')
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
      <Navigation index={index} onNavigation={handleNavigation} />
    </>
  )
}
