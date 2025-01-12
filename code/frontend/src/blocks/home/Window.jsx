import Projects from '@components/home/Projects'
import Tasks from '@components/home/Tasks'

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
    </div>
  )
}

export default Window
