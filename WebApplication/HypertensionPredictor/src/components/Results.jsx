import './Results.css'

export default function Results ({ prediction }) {
  return (
    <div className='results-container'>
      <div className='results-header'>
        <span className='results-score'>{prediction.score}</span>
        <span className='results-risk-level'>{prediction.riskLevel}</span>
      </div>
      <h3 className='results-title'>ESTIMATED {prediction * 100}% CHANCE OF DEVELOPING HYPERTENSION</h3>
      <p className='results-description'>{prediction.description}</p>
      <div className='results-actions'>
        <button className='btn'>LEARN MORE</button>
        <button className='btn'>SHARE THE TEST</button>
        <button className='btn'>START AGAIN</button>
        <button className='btn'>PRINT RESULT</button>
      </div>
    </div>
  )
}
