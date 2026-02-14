import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Section1 from './hey'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Section1 />
    </>
  )
}

export default App
