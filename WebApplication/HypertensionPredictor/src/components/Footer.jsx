import './Footer.css'

export default function Footer () {
  return (
    <div className='footer-container'>
      <div className='footer-top'>
        <div className='footer-disclaimer'>
          <h4>Disclaimer</h4>
          <p>
            The hypertension risk assessment is not a diagnostic tool. It has been developed as part of a university investigation project
            and the results are not medical advice. If you are at risk or concerned about hypertension, we advise visiting a healthcare professional for further information.
          </p>
        </div>
        <div className='footer-acknowledgement'>
          <h4>Acknowledgement</h4>
          <p>
            The model used in the Hypertension Predictor is trained on data captured from the CDC's NHANES program.
          </p>
        </div>
      </div>
      <hr className='footer-divider' />
      <div className='footer-bottom'>
        <div className='footer-links'>
          <h4>Useful Links</h4>
          <ul>
            <li><a href='#link1'>World Hypertension Day</a></li>
            <li><a href='#link2'>International Hypertension Federation</a></li>
            <li><a href='#link3'>Hypertension Atlas</a></li>
          </ul>
        </div>
      </div>
    </div>
  )
}
