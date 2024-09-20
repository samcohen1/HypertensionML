export const questions = [
  {
    heading: 'Age',
    question: 'Please enter your age:',
    answers: [
      { caption: 'Age', answerType: 'slider', min: 18, max: 100 }
    ]
  },
  {
    heading: 'Height',
    question: 'Please enter your height in cm:',
    answers: [
      { caption: 'Height', answerType: 'slider', min: 100, max: 250 } // Slider for height between 100 and 250 cm
    ]
  },
  {
    heading: 'Mass',
    question: 'Please enter your mass in kg:',
    answers: [
      { caption: 'Mass', answerType: 'slider', min: 30, max: 200 }
    ]
  },
  {
    heading: 'Waist Circumference',
    question: 'Please enter your waist circumference in cm:',
    answers: [
      { caption: 'Waist Circumference', answerType: 'slider', min: 50, max: 200 } // Slider for waist circumference
    ]
  },
  {
    heading: 'Gender',
    question: 'Please select your gender:',
    answers: [
      { caption: 'Male', answerType: 'option' },
      { caption: 'Female', answerType: 'option' },
      { caption: 'Other', answerType: 'option' }
    ]
  },
  {
    heading: 'General Health',
    question: 'How would you rate your general health?',
    answers: [
      { caption: 'Poor', answerType: 'option' },
      { caption: 'Fair', answerType: 'option' },
      { caption: 'Good', answerType: 'option' },
      { caption: 'Very Good', answerType: 'option' },
      { caption: 'Excellent', answerType: 'option' }
    ]
  },
  {
    heading: 'Diet Health',
    question: 'How would you rate your diet health?',
    answers: [
      { caption: 'Poor', answerType: 'option' },
      { caption: 'Fair', answerType: 'option' },
      { caption: 'Good', answerType: 'option' },
      { caption: 'Very Good', answerType: 'option' },
      { caption: 'Excellent', answerType: 'option' }
    ]
  },
  {
    heading: 'Education Level',
    question: 'What is your highest level of education?',
    answers: [
      { caption: 'Less than 9th Grade', answerType: 'option' },
      { caption: 'Grades 9-11', answerType: 'option' },
      { caption: 'High School Graduate', answerType: 'option' },
      { caption: 'Undergraduate Degree or Diploma', answerType: 'option' },
      { caption: 'Post Graduate Degree', answerType: 'option' }
    ]
  },
  {
    heading: 'Smoking',
    question: 'Do you smoke cigarettes?',
    answers: [
      { caption: 'Every Day', answerType: 'option' },
      { caption: 'Sometimes', answerType: 'option' },
      { caption: 'No Longer', answerType: 'option' },
      { caption: 'Never', answerType: 'option' }
    ]
  },
  {
    heading: 'Start Smoking',
    question: 'At what age did you start smoking?',
    answers: [
      { caption: 'Start Smoking Age', answerType: 'slider', min: 10, max: 100 } // Slider for start smoking age
    ]
  },
  {
    heading: 'Cigarettes Per Day',
    question: 'How many cigarettes do you smoke per day?',
    answers: [
      { caption: 'Cigarettes Per Day', answerType: 'slider', min: 0, max: 100 }
    ]
  },
  {
    heading: 'Quit Smoking',
    question: 'At what age did you quit smoking?',
    answers: [
      { caption: 'Quit Smoking Age', answerType: 'slider', min: 10, max: 100 } // Slider for quit smoking age
    ]
  },
  {
    heading: 'Annual Drinking',
    question: 'How often do you drink alcohol annually?',
    answers: [
      { caption: 'Every Day', answerType: 'option' },
      { caption: 'Most Days', answerType: 'option' },
      { caption: '3-4 times per week', answerType: 'option' },
      { caption: '2 times per week', answerType: 'option' },
      { caption: 'Once a week', answerType: 'option' },
      { caption: '2-3 times a month', answerType: 'option' },
      { caption: 'Once a month', answerType: 'option' },
      { caption: '5-10 times', answerType: 'option' },
      { caption: 'Less than 5 times', answerType: 'option' },
      { caption: 'Never', answerType: 'option' }
    ]
  },
  {
    heading: 'Drinking',
    question: 'How much do you drink when you consume alcohol?',
    answers: [
      { caption: 'Drinking Amount', answerType: 'slider', min: 0, max: 15 }
    ]
  },
  {
    heading: 'Diabetes',
    question: 'Have you ever been diagnosed with diabetes?',
    answers: [
      { caption: 'Yes', answerType: 'option' },
      { caption: 'Borderline', answerType: 'option' },
      { caption: 'No', answerType: 'option' }
    ]
  },
  {
    heading: 'Cholesterol',
    question: 'Have you ever been diagnosed with high cholesterol?',
    answers: [
      { caption: 'Yes', answerType: 'option' },
      { caption: 'No', answerType: 'option' }
    ]
  },
  {
    heading: 'Stroke',
    question: 'Have you ever had a stroke?',
    answers: [
      { caption: 'Yes', answerType: 'option' },
      { caption: 'No', answerType: 'option' }
    ]
  },
  {
    heading: 'Moderate Activity',
    question: 'Do you engage in moderate physical activity?',
    answers: [
      { caption: 'Yes', answerType: 'option' },
      { caption: 'No', answerType: 'option' }
    ]
  },
  {
    heading: 'Vigorous Activity',
    question: 'Do you engage in vigorous physical activity?',
    answers: [
      { caption: 'Yes', answerType: 'option' },
      { caption: 'No', answerType: 'option' }
    ]
  },
  {
    heading: 'Quit Smoking',
    question: 'At what age did you quit smoking?',
    answers: [
      { caption: 'Quit Smoking Age', answerType: 'slider', min: 10, max: 100 } // Slider for quit smoking age
    ]
  }
]

export default questions
