import useToken from '@hooks/useToken'
import { Navigate } from 'react-router-dom'

const CheckAuth = ({ children }) => {
  const token = useToken()

  return token.access ? children : <Navigate to='/auth' />
}

export default CheckAuth
