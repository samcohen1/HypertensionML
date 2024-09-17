import witsLogo from '../assets/wits-logo.png'
import eieLogo from '../assets/EIE.png'
import './Header.css'

export default function Header () {
  return (
    <>
      <header className='header'>
        <div className='logos'>
          <img src={witsLogo} alt='Wits Logo' className='logo' />
          <img src={eieLogo} alt='eie Logo' className='logo' />
        </div>
      </header>
      <h1 className='main-heading'>Test2Prevent</h1>
      <h2 className='sub-heading'>KNOW YOUR RISK OF HYPERTENSION</h2>
    </>
  )
}
