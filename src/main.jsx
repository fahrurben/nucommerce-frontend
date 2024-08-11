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
import CategoryList from './routes/category/list.jsx'
import CreateProduct from './routes/product/create.jsx'
import ProductList from './routes/product/list.jsx'
import EditProduct from './routes/product/edit.jsx'

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login/>
  },
  {
    path: '/',
    element: <Root/>,
    children: [
      {
        path: 'categories/',
        element: <CategoryList />,
      },
      {
        path: 'products/',
        element: <ProductList />,
      },
      {
        path: 'products/create/',
        element: <CreateProduct />,
      },
      {
        path: 'products/:id/edit',
        element: <EditProduct />,
      },
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
