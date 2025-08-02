import React from 'react'
import { useNavigate } from 'react-router-dom'

const Home = () => {
    const router = useNavigate()
    const handleLogin = () => {
        router("/login")
    }
  return (
    <div>
        <h1 className='text-blue-500'>Welcome to React</h1>

        <button onClick={handleLogin} className='px-3 py-4 rounded-2xl bg-blue-400 hover:bg-blue-600 transition-all duration-500 ease-in-out'>Login</button>
    </div>

    
    
  )
}

export default Home