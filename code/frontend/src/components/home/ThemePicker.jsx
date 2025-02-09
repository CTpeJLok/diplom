import { useState } from 'react'
import ThemeChanger from '@components/home/ThemeChanger'

const ThemePicker = () => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme'))

  const changeTheme = (themeName) => {
    const rootElement = document.getElementById('root')

    if (themeName === theme) {
      localStorage.removeItem('theme')
      rootElement.classList.remove(theme)
      setTheme(() => null)
      return
    }

    localStorage.setItem('theme', themeName)

    rootElement.classList.remove(theme)
    rootElement.classList.add(themeName)

    setTheme(() => themeName)
  }

  return (
    <div className='theme-picker'>
      <ThemeChanger
        classText='Темная тема'
        className='dark'
        theme={theme}
        changeTheme={changeTheme}
      />
      <ThemeChanger
        classText='Розовая тема'
        className='pink'
        theme={theme}
        changeTheme={changeTheme}
      />
      <ThemeChanger
        classText='One Dark Pro тема'
        className='onedarkpro'
        theme={theme}
        changeTheme={changeTheme}
      />
    </div>
  )
}

export default ThemePicker
