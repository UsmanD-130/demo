import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Inputfields from './pages/Inputfields'
import Dropdowns from './pages/Dropdowns'

const App = () => {
  return (
    <div className='w-screen flex flex-col justify-center items-center'>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/inputfields' element={<Inputfields />}/>
        <Route path='/dropdowns' element={<Dropdowns />}/>
      </Routes>
    </div>
  )
}

export default App