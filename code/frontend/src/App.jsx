import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

import { AuthProvider } from '@contexts/AuthContext'

import PrivateRoute from '@components/PrivateRoute'

import HomePage from '@pages/HomePage'
import AuthPage from '@pages/AuthPage'

function App() {
  return (
    <>
      <AuthProvider>
        <Router>
          <Routes>
            <Route
              path='/'
              exact
              element={
                <PrivateRoute>
                  <HomePage />
                </PrivateRoute>
              }
            />

            <Route
              path='/auth'
              element={<AuthPage />}
            />
          </Routes>
        </Router>
      </AuthProvider>
    </>
  )
}

export default App
