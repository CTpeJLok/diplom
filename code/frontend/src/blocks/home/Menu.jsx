import ProjectSelector from '@components/home/ProjectSelector'
import ProjectTasks from '@components/home/ProjectTasks'
import ProjectKanban from '@components/home/ProjectKanban'
import ThemeChanger from '@components/home/ThemeChanger'

const Menu = ({ project, window, setWindow }) => {
  return (
    <div className=' menu'>
      <ProjectSelector
        project={project}
        window={window}
        setWindow={setWindow}
      />
      <ProjectTasks
        project={project}
        window={window}
        setWindow={setWindow}
      />
      <ProjectKanban
        window={window}
        setWindow={setWindow}
      />
      <ThemeChanger
        classText='Темная тема'
        className='dark'
      />
      <ThemeChanger
        classText='Розовая тема'
        className='pink'
      />
      <ThemeChanger
        classText='One Dark Pro тема'
        className='onedarkpro'
      />
    </div>
  )
}

export default Menu
