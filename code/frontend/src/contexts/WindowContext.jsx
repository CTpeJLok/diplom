import axios from 'axios'

import { createContext, useState, useEffect } from 'react'

export const WindowContext = createContext()

export const WindowProvider = ({ children }) => {
  const [window, setWindow] = useState({})

  const contextData = {
    window,
    setWindow,
  }

  return (
    <WindowContext.Provider value={contextData}>
      {children}
    </WindowContext.Provider>
  )
}
