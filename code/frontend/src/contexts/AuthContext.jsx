import { createContext, useState, useEffect } from 'react'

import API_URL from '@constants/API'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true)

  const [accessToken, setAccessToken] = useState(null)
  const [refreshToken, setRefreshToken] = useState(null)
  const [userInfo, setUserInfo] = useState(null)

  const login = async (username, password) => {
    try {
      const response = await fetch(`${API_URL}/user/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      })

      const data = await response.json()

      if (response.status === 200) {
        const { tokens, userInfo } = data

        setAccessToken(() => tokens.access)
        setRefreshToken(() => tokens.refresh)
        setUserInfo(() => userInfo)

        localStorage.setItem('access', tokens.access)
        localStorage.setItem('refresh', tokens.refresh)
        localStorage.setItem('userInfo', JSON.stringify(userInfo))
      }

      return [response.status === 200, data.detail]
    } catch (e) {
      return [false, e]
    }
  }

  const register = async (username, password) => {
    try {
      const response = await fetch(`${API_URL}/user/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      })

      const data = await response.json()

      if (response.status === 200) {
        const { userInfo } = data

        setUserInfo(() => userInfo)
        localStorage.setItem('userInfo', JSON.stringify(userInfo))
      }

      return [response.status === 200, data.detail]
    } catch (e) {
      return [false, e]
    }
  }

  const confirmRegister = async (username, code) => {
    try {
      const response = await fetch(`${API_URL}/user/confirm/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'email_activate',
          username,
          code,
        }),
      })

      const data = await response.json()

      if (response.status === 200) {
        const { tokens, userInfo } = data

        setAccessToken(() => tokens.access)
        setRefreshToken(() => tokens.refresh)
        setUserInfo(() => userInfo)

        localStorage.setItem('access', tokens.access)
        localStorage.setItem('refresh', tokens.refresh)
        localStorage.setItem('userInfo', JSON.stringify(userInfo))
      }

      return [response.status === 200, data.detail]
    } catch (e) {
      return [false, e]
    }
  }

  const logout = async () => {
    const response = await fetch(`${API_URL}/user/logout/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh: refreshToken,
      }),
    })

    const data = await response.json()

    if (response.status === 200) {
      setAccessToken(() => null)
      setRefreshToken(() => null)
      setUserInfo(() => null)

      localStorage.removeItem('access')
      localStorage.removeItem('refresh')
      localStorage.removeItem('userInfo')
    }

    return [response.status === 200, data.detail]
  }

  const makeRefresh = async (refresh) => {
    try {
      const response = await fetch(`${API_URL}/user/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refresh,
        }),
      })

      const data = await response.json()

      if (response.status === 200) {
        const { tokens, userInfo } = data

        setAccessToken(() => tokens.access)
        setRefreshToken(() => tokens.refresh)
        setUserInfo(() => userInfo)

        localStorage.setItem('access', tokens.access)
        localStorage.setItem('refresh', tokens.refresh)
        localStorage.setItem('userInfo', JSON.stringify(userInfo))
      }

      return [response.status === 200, data.detail]
    } catch (e) {
      setAccessToken(() => null)
      setRefreshToken(() => null)
      setUserInfo(() => null)

      localStorage.removeItem('access')
      localStorage.removeItem('refresh')
      localStorage.removeItem('userInfo')

      return [false, e]
    }
  }

  const requestRecovery = async (username) => {
    try {
      const response = await fetch(`${API_URL}/user/recovery/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
        }),
      })

      const data = await response.json()

      return [response.status === 200, data.detail]
    } catch (e) {
      return [false, e]
    }
  }

  const confirmRecovery = async (username, password, code) => {
    try {
      const response = await fetch(`${API_URL}/user/confirm/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'password_recovery',
          username,
          password,
          code,
        }),
      })

      const data = await response.json()

      return [response.status === 200, data.detail]
    } catch (e) {
      return [false, e]
    }
  }

  useEffect(() => {
    const loadTokens = async () => {
      const refresh = localStorage.getItem('refresh')

      if (refresh) await makeRefresh(refresh)

      setIsLoading(() => false)
    }

    loadTokens()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      if (refreshToken) makeRefresh(refreshToken)
    }, 1000 * 60 * 5 - 5)
    return () => clearInterval(interval)
  }, [refreshToken])

  const contextData = {
    isLoading,

    accessToken,
    setAccessToken,

    refreshToken,
    setRefreshToken,

    userInfo,
    setUserInfo,

    login,
    register,
    logout,
    makeRefresh,
    confirmRegister,
    requestRecovery,
    confirmRecovery,
  }

  return (
    <AuthContext.Provider value={contextData}>
      {isLoading ? null : children}
    </AuthContext.Provider>
  )
}
