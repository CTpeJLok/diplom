import { useContext } from 'react'
import { Navigate } from 'react-router-dom'

import { AuthContext } from '@contexts/AuthContext'

const PrivateRoute = ({ children }) => {
  const { accessToken, isLoading } = useContext(AuthContext)

  if (isLoading) {
    return null
  }

  return accessToken ? (
    children
  ) : (
    <Navigate
      to='/auth'
      replace
    />
  )
}

export default PrivateRoute
