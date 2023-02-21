import React from 'react';
import { useState , useEffect } from 'react';
import { useNavigate, useLocation, Routes , Route , NavLink } from 'react-router-dom';
import '../../components/App.css'
import styles from './App.module.css'; 
 
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <h1>PI Food --- Nav Bar</h1>
      </div>
      <div className={styles.container}>
        <div className={styles.item}>
          <h1>Presentación</h1>
          <div className="card">
            <button onClick={() => setCount((count) => count + 1)}>
              count is {count}
            </button>
          </div>
        </div>
      </div>
  </>
  )
}

export default App
