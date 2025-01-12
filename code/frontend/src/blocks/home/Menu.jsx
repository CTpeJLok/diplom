import ProjectSelector from '@components/home/ProjectSelector'
import ProjectTasks from '@components/home/ProjectTasks'

const Menu = ({ project, setWindow }) => {
  return (
    <div className=' menu'>
      <ProjectSelector
        project={project}
        setWindow={setWindow}
      />
      <ProjectTasks
        project={project}
        setWindow={setWindow}
      />
    </div>
  )
}

export default Menu
