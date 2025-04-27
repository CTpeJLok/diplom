import { useState } from 'react'

const useToken = () => {
  const [access, setAccess] = useState(() => localStorage.getItem('access'))
  const [refresh, setRefresh] = useState(() => localStorage.getItem('refresh'))
  const [userInfo, setUserInfo] = useState(() =>
    JSON.parse(localStorage.getItem('userInfo') ?? '{}')
  )

  const changeAccess = (token) => {
    setAccess(() => token)
    localStorage.setItem('access', token)
  }

  const changeRefresh = (token) => {
    setRefresh(() => token)
    localStorage.setItem('refresh', token)
  }

  const setTokens = (tokens) => {
    setAccess(() => tokens.access)
    setRefresh(() => tokens.refresh)
    localStorage.setItem('access', tokens.access)
    localStorage.setItem('refresh', tokens.refresh)
  }

  const removeAccess = () => {
    setAccess(() => null)
    localStorage.removeItem('access')
  }

  const removeRefresh = () => {
    setRefresh(() => null)
    localStorage.removeItem('refresh')
  }

  const removeTokens = () => {
    setAccess(() => null)
    setRefresh(() => null)
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
  }

  const changeUserInfo = (userInfo) => {
    setUserInfo(() => userInfo)
    localStorage.setItem('userInfo', JSON.stringify(userInfo))
  }

  const removeUserInfo = () => {
    setUserInfo(() => null)
    localStorage.removeItem('userInfo')
  }

  return {
    access,
    refresh,
    setAccess: changeAccess,
    setRefresh: changeRefresh,
    setTokens,
    removeAccess,
    removeRefresh,
    removeTokens,
    userInfo,
    setUserInfo: changeUserInfo,
    removeUserInfo,
  }
}

export default useToken
