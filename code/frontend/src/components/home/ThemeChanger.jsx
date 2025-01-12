import { useEffect, useState } from 'react'

import Checkbox from '@components/home/Checkbox'

const ThemeChanger = ({ classText, className }) => {
  const [isChange, setIsChange] = useState(
    () => localStorage.getItem('theme') === className
  )

  console.log(isChange)

  useEffect(() => {
    const rootElement = document.getElementById('root')

    if (isChange) {
      localStorage.setItem('theme', className)
      rootElement.classList.add(className)
    } else {
      localStorage.removeItem('theme')
      rootElement.classList.remove(className)
    }
  }, [isChange])

  return (
    <div className='block dark-changer'>
      <p>{classText}</p>
      <Checkbox
        checked={isChange}
        onChange={() => setIsChange((i) => !i)}
      />
    </div>
  )
}

export default ThemeChanger
