import Projects from '@components/home/Projects'
import Tasks from '@components/home/Tasks'
import Kanban from '@components/home/Kanban'

const Window = ({ window, setWindow, project, setProject }) => {
  return (
    <div className=' window'>
      {window?.type === 'PROJECT_SELECTOR' && (
        <Projects
          project={project}
          setProject={setProject}
        />
      )}

      {window?.type === 'TASKS' && <Tasks project={project} />}

      {window?.type === 'KANBAN' && <Kanban project={project} />}
    </div>
  )
}

export default Window
