import './RiskFactors.css'

export default function RiskFactors ({ shapValues }) {
  // Convert the shapValues object into an array of key-value pairs
  const shapArray = Object.entries(shapValues).map(([label, shapValue]) => ({ label, shapValue }))

  // Separate the factors into two groups: one that increases risk and one that decreases it
  const increaseRiskFactors = shapArray.filter(factor => factor.shapValue > 0)
  const decreaseRiskFactors = shapArray.filter(factor => factor.shapValue <= 0)

  return (
    <div className='risk-factors-container'>
      {/* Factors that increase risk */}
      <div className='risk-block increase-risk'>
        <h2>Factors Increasing Your Risk</h2>
        <ul>
          {increaseRiskFactors.map((factor, index) => (
            <li key={index}>{factor.label}</li>
          ))}
        </ul>
      </div>

      {/* Factors that decrease risk */}
      <div className='risk-block decrease-risk'>
        <h2>Factors Decreasing Your Risk</h2>
        <ul>
          {decreaseRiskFactors.map((factor, index) => (
            <li key={index}>{factor.label}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
