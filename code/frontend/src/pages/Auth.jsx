import useApi from '@hooks/useApi'
import useToken from '@hooks/useToken'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const STEP_LOGIN_REGISTER = 0
const STEP_CONFIRM_REGISTER = 1
const STEP_RECOVERY = 2
const STEP_CONFIRM_RECOVERY = 3

const Auth = () => {
  const navigation = useNavigate()

  const token = useToken()
  const { login, register, confirmCode, recoveryPassword } = useApi()

  const [authData, setAuthData] = useState({
    email: '',
    password: '',
  })
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  const [activeStep, setActiveStep] = useState(STEP_LOGIN_REGISTER)

  useEffect(() => {
    if (token.userInfo) {
      if (token.userInfo.action === 'register')
        setActiveStep(() => STEP_CONFIRM_REGISTER)
      else if (token.userInfo.action === 'request_recovery')
        setActiveStep(() => STEP_CONFIRM_RECOVERY)
    }
  }, [])

  useEffect(() => {
    setAuthData(() => ({}))
    setCode(() => '')
    setError(() => '')
  }, [activeStep])

  const steps = {
    [STEP_LOGIN_REGISTER]: (
      <div className='form'>
        <h3 className='text-center'>Авторизация</h3>

        {error && <p className='text-danger text-center'>{error}</p>}

        <div className='form-floating'>
          <input
            key='login_register_email'
            type='email'
            className='form-control'
            placeholder='Enter Email'
            value={authData.email ?? ''}
            onChange={(e) =>
              setAuthData((old) => ({ ...old, email: e.target.value }))
            }
          />
          <label>Email</label>
        </div>

        <div className='form-floating'>
          <input
            key='login_register_password'
            type='password'
            className='form-control'
            placeholder='Enter password'
            value={authData.password ?? ''}
            onChange={(e) =>
              setAuthData((old) => ({ ...old, password: e.target.value }))
            }
          />
          <label>Пароль</label>
        </div>

        <div className='form-buttons'>
          <button
            type='button'
            className='btn btn-primary'
            onClick={() => {
              login(authData).then((response) => {
                if (response.ok) {
                  token.setTokens(response.data.tokens)
                  token.setUserInfo(response.data.userInfo)

                  if (response.data.tokens.access) navigation('/')
                } else setError(() => response.detail)
              })
            }}>
            Войти
          </button>

          <button
            type='button'
            className='btn btn-primary'
            onClick={() => {
              register(authData).then((response) => {
                if (response.ok) {
                  token.setUserInfo(response.data.userInfo)
                  if (response.data.userInfo)
                    setActiveStep(() => STEP_CONFIRM_REGISTER)
                } else setError(() => response.detail)
              })
            }}>
            Регистрация
          </button>
        </div>

        <button
          type='button'
          className='btn btn-link'
          onClick={() => {
            setActiveStep(() => STEP_RECOVERY)
          }}>
          Восстановление пароля
        </button>
      </div>
    ),
    [STEP_CONFIRM_REGISTER]: (
      <div className='form'>
        <h3 className='text-center'>Подтверждение регистрации</h3>

        {error && <p className='text-danger text-center'>{error}</p>}

        <div className='form-floating'>
          <input
            key='confirm_register_code'
            type='text'
            className='form-control'
            placeholder='Enter code'
            value={code ?? ''}
            onChange={(e) => setCode(() => e.target.value.trim())}
          />
          <label>Код из письма</label>
        </div>

        <div className='form-buttons'>
          <button
            type='button'
            className='btn btn-primary'
            onClick={() => {
              confirmCode({
                email: token.userInfo.email,
                type: 'email_activate',
                code,
              }).then((response) => {
                if (response.ok) {
                  token.setTokens(response.data.tokens)
                  token.setUserInfo(response.data.userInfo)

                  if (response.data.tokens.access) navigation('/')
                } else setError(() => response.detail)
              })
            }}>
            Подтвердить
          </button>
        </div>

        <button
          type='button'
          className='btn btn-link'
          onClick={() => {
            setActiveStep(() => STEP_LOGIN_REGISTER)
          }}>
          Назад
        </button>
      </div>
    ),
    [STEP_RECOVERY]: (
      <div className='form'>
        <h3 className='text-center'>Запрос сброса пароля</h3>

        {error && <p className='text-danger text-center'>{error}</p>}

        <div className='form-floating'>
          <input
            key='recovery_email'
            type='email'
            className='form-control'
            placeholder='Enter Email'
            value={authData.email ?? ''}
            onChange={(e) =>
              setAuthData((old) => ({ ...old, email: e.target.value }))
            }
          />
          <label>Email</label>
        </div>

        <div className='form-buttons'>
          <button
            type='button'
            className='btn btn-primary'
            onClick={() => {
              recoveryPassword(authData).then((response) => {
                if (response.ok) {
                  token.setUserInfo(response.data.userInfo)

                  if (response.data.userInfo)
                    setActiveStep(() => STEP_CONFIRM_RECOVERY)
                } else setError(() => response.detail)
              })
            }}>
            Продолжить
          </button>
        </div>

        <button
          type='button'
          className='btn btn-link'
          onClick={() => {
            setActiveStep(() => STEP_LOGIN_REGISTER)
          }}>
          Назад
        </button>
      </div>
    ),
    [STEP_CONFIRM_RECOVERY]: (
      <div className='form'>
        <h3 className='text-center'>Подтверждение сброса пароля</h3>

        {error && <p className='text-danger text-center'>{error}</p>}

        <div className='form-floating'>
          <input
            key='confirm_recovery_code'
            type='text'
            className='form-control'
            placeholder='Enter code'
            value={code ?? ''}
            onChange={(e) => setCode(() => e.target.value.trim())}
          />
          <label>Код из письма</label>
        </div>

        <div className='form-floating'>
          <input
            key='confirm_recovery_password'
            type='password'
            className='form-control'
            placeholder='Enter password'
            value={authData.password ?? ''}
            onChange={(e) => setAuthData(() => ({ password: e.target.value }))}
          />
          <label>Пароль</label>
        </div>

        <div className='form-buttons'>
          <button
            type='button'
            className='btn btn-primary'
            onClick={() => {
              confirmCode({
                email: token.userInfo.email,
                type: 'password_recovery',
                code,
                password: authData.password,
              }).then((response) => {
                if (response.ok) {
                  token.removeUserInfo()
                  setActiveStep(() => STEP_LOGIN_REGISTER)
                } else setError(() => response.detail)
              })
            }}>
            Подтвердить
          </button>
        </div>

        <button
          type='button'
          className='btn btn-link'
          onClick={() => {
            setActiveStep(() => STEP_LOGIN_REGISTER)
          }}>
          Назад
        </button>
      </div>
    ),
  }

  return <div className='page auth'>{steps[activeStep]}</div>
}

export default Auth
