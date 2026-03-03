import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { ChevronRight } from 'lucide-react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='w-screen h-screen flex flex-col items-center justify-center gap-8 text-center bg-linear-to-r from-slate-700 to-slate-900 text-white'>
      <div className='flex items-center justify-center gap-4'>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card ">
        <button onClick={() => setCount((count) => count + 1)} className='w-fit h-fit px-8 py-3 border border-slate-500 rounded-lg my-2 cursor-pointer shadow-sm shadow-slate-200'>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <a className='absolute top-2 right-4 flex items-center justify-center px-5 py-3 rounded-md gap-4 border bg-olive-900 cursor-pointer' href='/login'>
        <span>Login</span> <ChevronRight className='w-5 h-5' />
      </a>
    </div>
  )
}

export default App
