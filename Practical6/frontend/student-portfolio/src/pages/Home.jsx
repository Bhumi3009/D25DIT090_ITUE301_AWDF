import { useState } from 'react'
import Header from '../components/Header'
import About from '../components/About'
import Skills from '../components/Skills'

const skillList = [
  { category: 'Frontend', color: '#ff6a3d', skills: ['React', 'JavaScript', 'HTML', 'CSS'] },
  { category: 'Backend', color: '#1d3557', skills: ['Node.js', 'Express'] },
  { category: 'Database', color: '#2a9d8f', skills: ['MongoDB', 'MySQL'] },
  { category: 'Tools & Practices', color: '#e76f51', skills: ['Git', 'VS Code', 'Vite'] },
]

function Home() {
  const [showFact, setShowFact] = useState(false)

  return (
    <div className="page">
      <Header name="Bhumi" tagline=" I turn ideas into websites." />

      <button className="btn btn-secondary fact-toggle" onClick={() => setShowFact(!showFact)}>
        {showFact ? 'Hide quick fact' : 'Show a quick fact about me'}
      </button>
      {showFact && (
        <p className="quick-fact">
          I'm currently in Semester 5 at CHARUSAT, focused on full-stack web development.
        </p>
      )}

      <div className="bento-grid">
        <About />
        <Skills skillList={skillList} />
      </div>
    </div>
  )
}

export default Home