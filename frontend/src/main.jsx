import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {} from "react-dom"
import Login from './pages/Login.jsx'
import { createBrowserRouter, RouterProvider} from 'react-router-dom'
import Test from './pages/Test.jsx'

const routes = [{
  path: "/",
  element: <App />
}, {
  path: "/login",
  element: <Login />
},
{path: "/test/api",
  element: <Test />
}]

const router = createBrowserRouter(routes)

// const PageContainer = <main className='w-screen h-screen overflow-hidden'></main>

createRoot(document.getElementById('root')).render(
  
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
