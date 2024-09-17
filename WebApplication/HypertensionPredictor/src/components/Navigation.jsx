import './Navigation.css'

export default function Navigation ({ index, onNavigation }) {
  return (
    <div className='nav-container'>
      {index > 0 && <button className='nav-button' onClick={() => onNavigation(-1)}>Previous</button>}
      {index > 0 && <p className='nav-number'>Question {index}</p>}
      {(index > 0 && index < 20)
        ? <button className='nav-button' onClick={() => onNavigation(1)}>Next</button>
        : <button className='nav-button'>Submit</button>}
    </div>
  )
}
