import { useContext } from 'react'

import { AuthContext } from '@contexts/AuthContext'

import PAGES from '@constants/PAGES'

const ConfirmPasswordRecovery = ({
  email,
  password,
  setPassword,
  code,
  setCode,
  setError,
  setPage,
}) => {
  const { confirmRecovery } = useContext(AuthContext)

  const handleConfirmPasswordRecovery = async () => {
    if (!email || !code || !password) {
      setError(() => 'Введите email, код и пароль')
      return
    }

    setError(() => '')

    const result = await confirmRecovery(email, password, code.trim())

    if (result[0]) setPage(() => PAGES.LOGIN)
    else setError(() => result[1])
  }

  return (
    <>
      <h1>Восстановления пароля</h1>

      <div className='input-group'>
        <label htmlFor='code'>Код подтверждения</label>
        <input
          type='text'
          name='code'
          id='code'
          value={code}
          onChange={(e) => setCode(() => e.target.value)}
        />
      </div>

      <div className='input-group'>
        <label htmlFor='password'>Новый пароль</label>
        <input
          type='password'
          name='password'
          id='password'
          value={password}
          onChange={(e) => setPassword(() => e.target.value)}
        />
      </div>

      <button onClick={() => handleConfirmPasswordRecovery()}>
        Подтвердить
      </button>

      <div className='additional-actions center'>
        <button onClick={() => setPage(() => PAGES.LOGIN)}>Назад</button>
      </div>
    </>
  )
}

export default ConfirmPasswordRecovery
