import { useState } from 'react'
import gatoImg from './assets/images.jpeg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={gatoImg} className="base2" width="170" height="179" alt="" />
        </div>
        <div>
          <h1>LA calabaza</h1>
          <p>
            Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <section style={{ marginBottom: '150px' }}>
        <div>
          <label>Texto: </label><br />
          <textarea 
            rows="3" 
            placeholder="Escribe un mensaje..." 
            style={{ width: '100%', marginTop: '15px', padding: '16px' }}
          />
        </div>
      </section>
    </>
  )
}

export default App
