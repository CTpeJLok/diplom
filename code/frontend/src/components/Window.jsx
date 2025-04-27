import Project from '@components/windows/Project'
import ProjectEdit from '@components/windows/ProjectEdit'
import Task from '@components/windows/Task'
import TaskEdit from '@components/windows/TaskEdit'
import {
  WINDOW_CLEAR,
  WINDOW_KANBAN,
  WINDOW_PROJECT,
  WINDOW_PROJECT_EDIT,
  WINDOW_TASK,
  WINDOW_TASK_EDIT,
} from '@constants/WINDOW'
import Kanban from './windows/Kanban'

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
  }

  return (
    <div className='window'>
      <div className='window-content'>{windows[activeWindow]}</div>
    </div>
  )
}

export default Window
