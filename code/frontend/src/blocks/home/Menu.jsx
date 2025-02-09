import ProjectSelector from '@components/home/ProjectSelector'
import ProjectTasks from '@components/home/ProjectTasks'
import ProjectKanban from '@components/home/ProjectKanban'
import ProjectNotes from '@components/home/ProjectNotes'
import ProjectTeam from '@components/home/ProjectTeam'
import ThemePicker from '@components/home/ThemePicker'

const Menu = ({ project, window, setWindow }) => {
  return (
    <div className=' menu'>
      <ProjectSelector
        project={project}
        window={window}
        setWindow={setWindow}
      />

      {project?.id && (
        <>
          <ProjectTasks
            project={project}
            window={window}
            setWindow={setWindow}
          />
          <ProjectKanban
            window={window}
            setWindow={setWindow}
          />
          <ProjectNotes
            window={window}
            setWindow={setWindow}
          />
          <ProjectTeam
            project={project}
            window={window}
            setWindow={setWindow}
          />
        </>
      )}
      <ThemePicker />
    </div>
  )
}

export default Menu
