import { AuthProvider } from '@contexts/AuthContext'
import PageViewer from '@pages/PageViewer'
import { useEffect } from 'react'

function App() {
  useEffect(() => {
    document.cookie =
      'sessionid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=None; Secure'
    document.cookie =
      'csrftoken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=None; Secure'
  }, [])

  return (
    <>
      <AuthProvider>
        <PageViewer />
      </AuthProvider>
    </>
  )
}

export default App
