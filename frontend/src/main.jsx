import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {} from "react-dom"
import Login from './pages/Login.jsx'
import { createBrowserRouter, RouterProvider} from 'react-router-dom'

const routes = [{
  path: "/",
  element: <App />
}, {
  path: "/login",
  element: <Login />
}]

const router = createBrowserRouter(routes)

// const PageContainer = <main className='w-screen h-screen overflow-hidden'></main>

createRoot(document.getElementById('root')).render(
  
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
