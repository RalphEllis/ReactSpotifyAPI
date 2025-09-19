import React from 'react';
import { useState } from 'react';
import './App.css'
import MainDisplayComp from './components/MainDisplayComp'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>      
      <div className="BodyContainer">
        <MainDisplayComp />
      </div>
    </>
  )
}

export default App
