import './App.css'
import Home from './components/Home'
import { Routes, Route } from 'react-router-dom';
import Create from './components/Create'
import Messages from './components/Messages'

function App() {

  return (
    <>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/create" element={<Create/>} />
      <Route path="/messages" element={<Messages/>} />
    </Routes>
    </>
  )
}

export default App
