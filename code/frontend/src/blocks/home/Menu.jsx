import ProjectSelector from '@components/home/ProjectSelector'
import ProjectTasks from '@components/home/ProjectTasks'
import ProjectKanban from '@components/home/ProjectKanban'

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
    </div>
  )
}

export default Menu
