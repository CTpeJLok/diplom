import { WINDOW_TASK_EDIT } from '@constants/WINDOW'
import useApi from '@hooks/useApi'
import { useEffect, useState } from 'react'

import Pen from '@images/pen.svg'
import Trash from '@images/trash.svg'

const Task = ({ setActiveWindow, windowData, setWindowData }) => {
  const { fetchTasks, deleteTask } = useApi()

  const [tasks, setTasks] = useState([])

  const updateTasks = () => {
    fetchTasks(windowData.activeProject.id).then((response) => {
      if (response.ok) setTasks(() => response.data.tasks)
    })
  }

  useEffect(() => {
    updateTasks()
  }, [])

  const renderTaskClassname = (task) => {
    const className = 'task'

    if (task.stage === 'TODO') return className + ' todo'
    if (task.stage === 'IN_PROGRESS') return className + ' in-progress'
    if (task.stage === 'DONE') return className + ' done'

    return className
  }

  return (
    <div className='window-task'>
      <h3>Задачи</h3>

      <button
        className='btn btn-primary'
        onClick={() => {
          setWindowData((old) => ({
            activeProject: old.activeProject,
            updateActiveProject: old.updateActiveProject,
            setActiveProject: old.setActiveProject,
            task: { is_show_in_kanban: true },
          }))
          setActiveWindow(() => WINDOW_TASK_EDIT)
        }}>
        Создать
      </button>

      {tasks.map((task) => (
        <div
          key={task.id}
          className={renderTaskClassname(task)}>
          <div className='task-info'>
            <p className='task-name'>{task.name}</p>
            <p className='task-description'>{task.description}</p>
          </div>

          <div className='task-actions'>
            <button
              className='btn btn-secondary'
              onClick={() => {
                setWindowData((old) => ({
                  task,
                  activeProject: old.activeProject,
                  updateActiveProject: old.updateActiveProject,
                  setActiveProject: old.setActiveProject,
                }))
                setActiveWindow(() => WINDOW_TASK_EDIT)
              }}>
              <img src={Pen} />
            </button>
            <button
              className='btn btn-danger'
              onClick={() => {
                deleteTask(windowData.activeProject.id, task.id).then(
                  (response) => {
                    if (response.ok) {
                      windowData.updateActiveProject()
                      updateTasks()
                    }
                  }
                )
              }}>
              <img src={Trash} />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Task
