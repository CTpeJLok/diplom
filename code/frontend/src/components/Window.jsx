import Kanban from '@components/windows/Kanban'
import Note from '@components/windows/Note'
import NoteEdit from '@components/windows/NoteEdit'
import NoteView from '@components/windows/NoteView'
import Project from '@components/windows/Project'
import ProjectEdit from '@components/windows/ProjectEdit'
import ProjectUser from '@components/windows/ProjectUser'
import ProjectUserEdit from '@components/windows/ProjectUserEdit'
import Task from '@components/windows/Task'
import TaskEdit from '@components/windows/TaskEdit'
import {
  WINDOW_CLEAR,
  WINDOW_KANBAN,
  WINDOW_NOTE,
  WINDOW_NOTE_EDIT,
  WINDOW_NOTE_VIEW,
  WINDOW_PROJECT,
  WINDOW_PROJECT_EDIT,
  WINDOW_PROJECT_USER,
  WINDOW_PROJECT_USER_EDIT,
  WINDOW_TASK,
  WINDOW_TASK_EDIT,
} from '@constants/WINDOW'

const Window = ({
  activeWindow,
  setActiveWindow,
  windowData,
  setWindowData,
}) => {
  const windows = {
    [WINDOW_CLEAR]: <></>,
    [WINDOW_PROJECT]: (
      <Project
        setActiveWindow={setActiveWindow}
        windowData={windowData}
        setWindowData={setWindowData}
      />
    ),
    [WINDOW_PROJECT_EDIT]: (
      <ProjectEdit
        setActiveWindow={setActiveWindow}
        windowData={windowData}
        setWindowData={setWindowData}
      />
    ),
    [WINDOW_TASK]: (
      <Task
        setActiveWindow={setActiveWindow}
        windowData={windowData}
        setWindowData={setWindowData}
      />
    ),
    [WINDOW_TASK_EDIT]: (
      <TaskEdit
        setActiveWindow={setActiveWindow}
        windowData={windowData}
        setWindowData={setWindowData}
      />
    ),
    [WINDOW_KANBAN]: <Kanban windowData={windowData} />,
    [WINDOW_NOTE]: (
      <Note
        setActiveWindow={setActiveWindow}
        windowData={windowData}
        setWindowData={setWindowData}
      />
    ),
    [WINDOW_PROJECT_USER]: (
      <ProjectUser
        setActiveWindow={setActiveWindow}
        windowData={windowData}
        setWindowData={setWindowData}
      />
    ),
    [WINDOW_PROJECT_USER_EDIT]: (
      <ProjectUserEdit
        setActiveWindow={setActiveWindow}
        windowData={windowData}
        setWindowData={setWindowData}
      />
    ),
    [WINDOW_NOTE_EDIT]: (
      <NoteEdit
        setActiveWindow={setActiveWindow}
        windowData={windowData}
        setWindowData={setWindowData}
      />
    ),
    [WINDOW_NOTE_VIEW]: (
      <NoteView
        setActiveWindow={setActiveWindow}
        windowData={windowData}
        setWindowData={setWindowData}
      />
    ),
  }

  return (
    <div className='window'>
      <div className='window-content'>{windows[activeWindow]}</div>
    </div>
  )
}

export default Window
