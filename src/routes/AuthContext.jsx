import axios from 'axios'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import moment from 'moment'

const AuthContext = createContext()

const AuthProvider = ({ children }) => {
  // State to hold the authentication token
  const [tokenDetails, setTokenDetails_] = useState({
    token: localStorage.getItem('token'),
    expired: localStorage.getItem('tokenExpired'),
  })

  const setTokenDetails = (tokenDetails) => {
    setTokenDetails_(tokenDetails)
  }

  useEffect(() => {
    const { token, expired } = tokenDetails
    if (token) {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token
      localStorage.setItem('token', token)
      localStorage.setItem('tokenExpired', expired)
    } else {
      delete axios.defaults.headers.common['Authorization']
      localStorage.removeItem('token')
      localStorage.removeItem('tokenExpired')
    }
  }, [tokenDetails])

  const contextValue = useMemo(
    () => ({
      tokenDetails,
      setTokenDetails,
    }),
    [tokenDetails]
  );

  // Provide the authentication context to the children components
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}

export default AuthProvider