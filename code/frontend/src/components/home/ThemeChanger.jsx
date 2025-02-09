import Checkbox from '@components/home/Checkbox'

const ThemeChanger = ({ classText, className, theme, changeTheme }) => {
  return (
    <div className='block theme-changer'>
      <p>{classText}</p>
      <Checkbox
        checked={theme === className}
        onChange={() => changeTheme(className)}
      />
    </div>
  )
}

export default ThemeChanger
