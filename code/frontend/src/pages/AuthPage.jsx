import { useState, useEffect } from 'react'

import Login from '@blocks/auth/Login'
import Register from '@blocks/auth/Register'
import ConfirmRegister from '@blocks/auth/ConfirmRegister'
import PasswordRecovery from '@blocks/auth/PasswordRecovery'
import ConfirmPasswordRecovery from '@blocks/auth/ConfirmPasswordRecovery'

import PAGES from '@constants/PAGES'

import '@styles/auth.css'

const AuthPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')

  const [page, setPage] = useState(PAGES.LOGIN)

  const [error, setError] = useState('')

  useEffect(() => {
    const theme = localStorage.getItem('theme')
    document.getElementById('root').classList.add(theme)
  }, [])

  return (
    <div className='auth-page'>
      <div className='auth-form block'>
        {page === PAGES.LOGIN && (
          <Login
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            error={error}
            setError={setError}
            setPage={setPage}
          />
        )}

        {page === PAGES.REGISTER && (
          <Register
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            error={error}
            setError={setError}
            setPage={setPage}
          />
        )}

        {page === PAGES.CONFIRM_REGISTER && (
          <ConfirmRegister
            email={email}
            code={code}
            setCode={setCode}
            error={error}
            setError={setError}
            setPage={setPage}
          />
        )}

        {page === PAGES.PASSWORD_RECOVERY && (
          <PasswordRecovery
            email={email}
            setEmail={setEmail}
            error={error}
            setError={setError}
            setPage={setPage}
          />
        )}

        {page === PAGES.CONFIRM_PASSWORD_RECOVERY && (
          <ConfirmPasswordRecovery
            email={email}
            password={password}
            setPassword={setPassword}
            code={code}
            setCode={setCode}
            setError={setError}
            setPage={setPage}
          />
        )}
      </div>
    </div>
  )
}

export default AuthPage
