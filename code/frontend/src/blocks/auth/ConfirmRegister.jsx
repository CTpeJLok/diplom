import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'

import { AuthContext } from '@contexts/AuthContext'

import PAGES from '@constants/PAGES'

const ConfirmRegister = ({
  email,
  code,
  setCode,
  error,
  setError,
  setPage,
}) => {
  const { confirmRegister } = useContext(AuthContext)

  const navigate = useNavigate()

  const handleConfirmRegister = async () => {
    if (!email || !code) {
      setError(() => 'Введите email и код')
      return
    }

    setError(() => '')

    const result = await confirmRegister(email, code.trim())

    if (result[0]) navigate('/')
    else setError(() => result[1])
  }

  return (
    <>
      <h1>Подтверждение регистрации</h1>

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

      {error && <p className='error'>{error}</p>}

      <button onClick={() => handleConfirmRegister()}>Подтвердить</button>

      <div className='additional-actions center'>
        <button onClick={() => setPage(() => PAGES.REGISTER)}>Назад</button>
      </div>
    </>
  )
}

export default ConfirmRegister
