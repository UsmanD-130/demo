import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Inputfields from './pages/Inputfields'
import Dropdowns from './pages/Dropdowns'
import NewComboDropdown from './ReusableComponents/NewComboDropdown'

const App = () => {
  return (
    <div className='w-screen flex flex-col justify-center items-center'>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/inputfields' element={<Inputfields />}/>
        <Route path='/dropdowns' element={<Dropdowns />}/>
        <Route path='/new-combo-dropdown' element={<NewComboDropdown />} />
      </Routes>
    </div>
  )
}

export default App