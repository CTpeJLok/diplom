import useApi from '@hooks/useApi'
import useToken from '@hooks/useToken'
import { createContext, useEffect, useState } from 'react'

const AuthContext = createContext()
export default AuthContext

export const AuthProvider = ({ children }) => {
  const token = useToken()
  const { refresh } = useApi()

  const [isLoading, setIsLoading] = useState(true)

  const refreshToken = () => {
    console.log('refresh')
    refresh({ refresh: token.refresh })
      .then((response) => {
        if (response.ok) {
          token.setTokens(response.data.tokens)
          token.setUserInfo(response.data.userInfo)
        } else {
          token.removeTokens()
          token.removeUserInfo()
        }
      })
      .catch(() => {
        token.removeTokens()
        token.removeUserInfo()
      })
  }

  useEffect(() => {
    console.log('check refresh')
    if (token.refresh) refreshToken()

    setIsLoading(() => false)

    const interval = setInterval(() => {
      console.log('check refresh')
      if (token.refresh) refreshToken()
    }, 1000 * 60 * 60)

    return () => clearInterval(interval)
  }, [])

  const contextData = {}

  return (
    <AuthContext.Provider value={contextData}>
      {isLoading ? null : children}
    </AuthContext.Provider>
  )
}
