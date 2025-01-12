import { useContext } from 'react'

import { AuthContext } from '@contexts/AuthContext'

import PAGES from '@constants/PAGES'

const PasswordRecovery = ({ email, setEmail, setError, setPage }) => {
  const { requestRecovery } = useContext(AuthContext)

  const handlePasswordRecovery = async () => {
    if (!email) {
      setError(() => 'Введите email')
      return
    }

    setError(() => '')

    const result = await requestRecovery(email)

    if (result[0]) setPage(() => PAGES.CONFIRM_PASSWORD_RECOVERY)
    else setError(() => result[1])
  }

  return (
    <>
      <h1>Восстановление пароля</h1>

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

      <button onClick={() => handlePasswordRecovery()}>
        Восстановить пароль
      </button>

      <div className='additional-actions center'>
        <button onClick={() => setPage(() => PAGES.LOGIN)}>Назад</button>
      </div>
    </>
  )
}

export default PasswordRecovery
