import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'

import { AuthContext } from '@contexts/AuthContext'

import PAGES from '@constants/PAGES'

const Login = ({
  email,
  setEmail,
  password,
  setPassword,
  error,
  setError,
  setPage,
}) => {
  const { login } = useContext(AuthContext)

  const navigate = useNavigate()

  const handleLogin = async () => {
    if (!email || !password) {
      setError(() => 'Введите email и пароль')
      return
    }

    setError(() => '')

    const result = await login(email, password)

    if (result[0]) navigate('/')
    else setError(() => result[1])
  }

  return (
    <>
      <h1>Авторизация</h1>

      <div className='input-group'>
        <label htmlFor='email'>Email</label>
        <input
          type='email'
          name='email'
          id='email'
          value={email}
          onChange={(e) => setEmail(() => e.target.value)}
        />
      </div>

      <div className='input-group'>
        <label htmlFor='password'>Пароль</label>
        <input
          type='password'
          name='password'
          id='password'
          value={password}
          onChange={(e) => setPassword(() => e.target.value)}
        />
      </div>

      {error && <p className='error'>{error}</p>}

      <button onClick={() => handleLogin()}>Войти</button>

      <div className='additional-actions'>
        <button onClick={() => setPage(() => PAGES.PASSWORD_RECOVERY)}>
          Восстановить пароль
        </button>
        <button onClick={() => setPage(() => PAGES.REGISTER)}>
          Зарегистрироваться
        </button>
      </div>
    </>
  )
}

export default Login
