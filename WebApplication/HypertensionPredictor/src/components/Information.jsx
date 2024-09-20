import { useState } from 'react'
import information from '../information.js'
import './Information.css'

export default function Information () {
  const [activeTab, setActiveTab] = useState('hypertension')

  function handleTabClick (tab) {
    setActiveTab(tab)
  }

  return (
    <div className='main-body'>
      <div className='tab-buttons'>
        <button
          className={`tab-button ${activeTab === 'hypertension' ? 'active' : ''}`}
          onClick={() => handleTabClick('hypertension')}
        >
          Hypertension
        </button>
        <button
          className={`tab-button ${activeTab === 'causes' ? 'active' : ''}`}
          onClick={() => handleTabClick('causes')}
        >
          Causes
        </button>
        <button
          className={`tab-button ${activeTab === 'predictor' ? 'active' : ''}`}
          onClick={() => handleTabClick('predictor')}
        >
          Predictor
        </button>
      </div>

      <div className='content-display'>
        <h2>{information[activeTab].title}</h2>
        <p>{information[activeTab].content}</p>
      </div>
    </div>

  )
}
