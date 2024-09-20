// Questions.jsx
import { useState, useEffect } from 'react';
import './Questions.css';
import Navigation from './Navigation';

// Helper function to determine how many questions should be skipped
function shouldSkipQuestion(currentIndex, answers) {
  const everSmokedAnswer = answers[8];
  const smokingFrequencyAnswer = answers[9];
  const alcFreqAnswer = answers[13];

  console.log(`Checking skip logic for index: ${currentIndex}, Answer: ${everSmokedAnswer}`);

  // Determine if the "Smoking Frequency" question needs to be auto-filled based on previous answers
  if (currentIndex === 10 && everSmokedAnswer === 'No') {
    console.log('Skipping "Smoking Frequency" question, auto-filling with "Never".');
    return { skipCount: 4, autoFillValues: ['Never', 0, 0, 0] };
  }

  // Check if the "Quit Smoking Age" question should be skipped
  if (currentIndex === 13 && (smokingFrequencyAnswer === 'Every Day' || smokingFrequencyAnswer === 'Sometimes')) {
    const ageAnswer = answers[0]; // Use the person's age as the auto-fill value
    console.log(`Skipping "Quit Smoking Age" question, auto-filling with age: ${ageAnswer}`);
    return { skipCount: 1, autoFillValues: [ageAnswer] };
  }

  if (currentIndex === 15 && (alcFreqAnswer === 'Never')) {
    const alcAnswer = answers[0]; // Use the person's age as the auto-fill value
    console.log(`Skipping "Quit Smoking Age" question, auto-filling with 0: ${alcAnswer}`);
    return { skipCount: 1, autoFillValues: [alcAnswer] };
  }

  return { skipCount: 0, autoFillValues: [] };
}

export default function Questions({
  index,
  onSaveAnswer,
  questionData,
  onChangeIndex,
  answers,
  onSubmit,
}) {
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setSelectedAnswer(answers[index - 1]);
  }, [index, answers]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        if (index === 21) {
          handleSubmission();
        } else {
          handleNavigation(1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [index, selectedAnswer]);

  function handleNavigation(navigation) {
    if (navigation === 1) {
      if (!selectedAnswer) {
        setErrorMessage(<p className="error-message">Please select an answer.</p>);
      } else {
        onSaveAnswer(index, selectedAnswer);

        // Check if the next question(s) should be skipped
        const { skipCount, autoFillValues } = shouldSkipQuestion(index + 1, [...answers, selectedAnswer]);

        if (skipCount > 0) {
          // Auto-fill answers for the questions to be skipped
          autoFillValues.forEach((value, i) => onSaveAnswer(index + 1 + i, value));

          // Skip the determined number of questions
          onChangeIndex((prevIndex) => {
            console.log(`Skipping ${skipCount} question(s), moving from index ${prevIndex} to ${prevIndex + skipCount + 1}`);
            return prevIndex + skipCount + 1;
          });
        } else {
          onChangeIndex((prevIndex) => prevIndex + navigation);
        }

        setSelectedAnswer('');
        setErrorMessage('');
      }
    } else {
      onChangeIndex((prevIndex) => prevIndex + navigation);
      setErrorMessage('');
    }
  }

  function handleSubmission() {
    if (!selectedAnswer) {
      setErrorMessage(<p className="error-message">Please select an answer.</p>);
    } else {
      onSaveAnswer(index, selectedAnswer);

      // Check for skips before final submission
      const { skipCount, autoFillValues } = shouldSkipQuestion(index + 1, [...answers, selectedAnswer]);

      // Auto-fill if needed before submission
      if (skipCount > 0) {
        autoFillValues.forEach((value, i) => onSaveAnswer(index + 1 + i, value));
      }

      onSubmit();
      setSelectedAnswer('');
      setErrorMessage('');
    }
  }

  function handleSliderChange(event) {
    setSelectedAnswer(event.target.value);
  }

  function getSliderPosition(value, min, max) {
    return ((value - min) / (max - min)) * 100;
  }

  function handleOptionChange(caption) {
    setSelectedAnswer(caption);
  }

  const answersClass = questionData.answers.length > 4 ? 'two-columns' : '';

  return (
    <>
      <div className="question-card">
        <div className="question-header">
          <span className="question-index">{index}</span>
          <h2 className="question-heading">{questionData.heading}</h2>
        </div>
        <p className="question-text">{questionData.question}</p>
        {errorMessage}
        <div className={`question-answers ${answersClass}`}>
          {questionData.answers.map((answer, i) =>
            answer.answerType === 'slider' ? (
              <div key={i} className="slider-container">
                <div
                  className="slider-value"
                  style={{
                    left: `calc(${getSliderPosition(
                      selectedAnswer || answer.min,
                      answer.min,
                      answer.max
                    )}% - 15px)`,
                  }}
                >
                  {selectedAnswer || answer.min}
                </div>

                <input
                  type="range"
                  min={answer.min}
                  max={answer.max}
                  value={selectedAnswer || answer.min}
                  onChange={handleSliderChange}
                  className="slider-input"
                  style={{
                    background: `linear-gradient(90deg, #007bff ${getSliderPosition(
                      selectedAnswer || answer.min,
                      answer.min,
                      answer.max
                    )}%, #ddd ${getSliderPosition(
                      selectedAnswer || answer.min,
                      answer.min,
                      answer.max
                    )}%)`,
                  }}
                />
              </div>
            ) : (
              <label key={i} className="option-label">
                <input
                  type="radio"
                  name={`question-${index}`}
                  value={answer.caption}
                  checked={selectedAnswer === answer.caption}
                  onChange={() => handleOptionChange(answer.caption)}
                  className="option-input"
                />
                {answer.caption}
              </label>
            )
          )}
        </div>
      </div>
      <Navigation index={index} onNavigation={handleNavigation} onSubmit={handleSubmission} />
    </>
  );
}
