import { useContext } from 'react'

import { AuthContext } from '@contexts/AuthContext'

import PAGES from '@constants/PAGES'

const Register = ({
  email,
  setEmail,
  password,
  setPassword,
  error,
  setError,
  setPage,
}) => {
  const { register } = useContext(AuthContext)

  const handleRegister = async () => {
    if (!email || !password) {
      setError(() => 'Введите email и пароль')
      return
    }

    setError(() => '')

    const result = await register(email, password)

    if (result[0]) setPage(() => PAGES.CONFIRM_REGISTER)
    else setError(() => result[1])
  }

  return (
    <>
      <h1>Регистрация</h1>

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

      <button onClick={() => handleRegister()}>Зарегистрироваться</button>

      <div className='additional-actions center'>
        <button onClick={() => setPage(() => PAGES.LOGIN)}>Войти</button>
      </div>
    </>
  )
}

export default Register
