import React, { useState, useEffect } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { Toaster } from "@/components/ui/toaster"
import moment from 'moment'
import { useAuth } from './AuthContext.jsx'

const Root = () => {
  const navigate = useNavigate()
  const { tokenDetails } = useAuth()
  const { token, expired } = tokenDetails
  // Check if the user is authenticated
  if (!token || moment().valueOf() >= expired) {
    // If not authenticated, redirect to the login page
    navigate('/login')
  }

  return (
    <div className="flex-row w-full">
      <div className="bg-blue-950 text-white px-8 py-4 font-bold">
        <Link to='/'>Nucommerce</Link>
      </div>
      <Outlet />
      <Toaster />
    </div>
  );
};
export default Root;