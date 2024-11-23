import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './components/Header'
import LeaveRequest from './pages/RequestTimeOff/LeaveRequest'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* <Header/> */}
      <LeaveRequest/>
    </>
  )
}

export default App
