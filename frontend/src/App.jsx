import React, { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import ReuseableInput from './ReusableComponents/ReuseableInput'

const App = () => {
  const [formData, setFormData] = useState({
    name : '',
    password : ''
  })

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name] : e.target.value})
  }

  console.log(formData,"formData")
  return (
<>
    <div className='w-screen flex justify-center items-center flex-col gap-10'>
      <h1>App</h1>
      <div>
        <h2>Form</h2>
        <form>
          <div className='flex flex-col gap-2'>
            <label htmlFor="name">Enter your name :</label>
            <input type="text" name='name' id='name' className='boder-2 border-blue-400 outline-2 outline-red-400' />
            <ReuseableInput label="Name" name="name" type="text" value={formData.name} onChange={handleChange}/>
            <ReuseableInput label="Password" name="password" type="password" value={formData.password} onChange={handleChange}/>
          </div>
        </form>
      </div>
    </div>
</>

  )
}

export default App