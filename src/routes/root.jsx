import React, { useState, useEffect, useRef } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { Toaster } from "@/components/ui/toaster"
import { ChevronDown } from 'lucide-react'
import moment from 'moment'
import { useAuth } from './AuthContext.jsx'
import MenuItem from '../components/common/MenuItem.jsx'

const Root = () => {
  const navigate = useNavigate()
  const { tokenDetails } = useAuth()
  const { token, expired } = tokenDetails
  const menuItemsData = [
    {
      'title': 'Products',
      subMenu: [
        {
          'title': 'Category',
          'url': '/categories',
        },
        {
          'title': 'Product',
          'url': '/products/',
        }
      ]
    }
  ]

  // Check if the user is authenticated
  if (!token || moment().valueOf() >= expired) {
    // If not authenticated, redirect to the login page
    navigate('/login')
  }

  return (
    <div className="flex-row w-full">
      <div className="bg-blue-950 text-white px-8 py-4 font-bold flex">
        <Link to="/">Nucommerce</Link>
        <ul className="ml-6">
          {
            menuItemsData.map((menuItem) => {
              return (
                <MenuItem key={menuItem.url} title={menuItem.title} url={menuItem.url} items={menuItem.subMenu} />
              )
            })
          }
        </ul>
      </div>
      <Outlet/>
      <Toaster/>
    </div>
  );
};
export default Root;