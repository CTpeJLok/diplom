import Auth from '@pages/Auth'
import Error404 from '@pages/Error404'
import Home from '@pages/Home'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'

import ChechAuth from '@pages/CheckAuth'

const PageViewer = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route
            path='auth'
            element={<Auth />}
          />

          <Route
            path=''
            element={
              <ChechAuth>
                <Home />
              </ChechAuth>
            }
          />

          <Route
            path='*'
            element={<Error404 />}
          />
        </Routes>
      </Router>
    </>
  )
}

export default PageViewer
