import Projects from '@components/home/Projects'
import Tasks from '@components/home/Tasks'
import Kanban from '@components/home/Kanban'
import Notes from '@components/home/Notes'
import Note from '@components/home/Note'
import Team from '@components/home/Team'

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

      {window?.type === 'NOTES' && (
        <Notes
          project={project}
          setWindow={setWindow}
        />
      )}

      {window?.type === 'NOTE' && (
        <Note
          project={project}
          note={window.note}
          setWindow={setWindow}
        />
      )}

      {window?.type === 'TEAM' && <Team project={project} />}
    </div>
  )
}

export default Window
