import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'

import Root from './routes/root.jsx'

import './index.css'
import '@radix-ui/themes/styles.css'

import Login from './routes/auth/login.jsx'
import { Theme } from '@radix-ui/themes'
import AuthProvider from './routes/AuthContext.jsx'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login/>
  },
  {
    path: '/',
    element: <Root/>,
    children: [
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Theme>
      <AuthProvider>
        <RouterProvider router={router}/>
      </AuthProvider>
    </Theme>
  </React.StrictMode>,
)
