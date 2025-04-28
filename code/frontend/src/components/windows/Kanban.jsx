import useApi from '@hooks/useApi'
import { useEffect, useState } from 'react'

import AngleLeft from '@images/angle-left.svg'
import AngleRight from '@images/angle-right.svg'
import EyeSlash from '@images/eye-slash.svg'

const Kanban = ({ windowData }) => {
  const { fetchKanbanTasks, updateTask } = useApi()

  const [tasks, setTasks] = useState([])

  const todo = tasks.filter((task) => task.stage === 'TODO')
  const inProgress = tasks.filter((task) => task.stage === 'IN_PROGRESS')
  const done = tasks.filter((task) => task.stage === 'DONE')

  const updateTasks = () => {
    fetchKanbanTasks(windowData.activeProject.id).then((response) => {
      if (response.ok) setTasks(() => response.data.tasks)
    })
  }

  useEffect(() => {
    updateTasks()
  }, [])

  const moveTaskNext = (task) => {
    if (task.stage === 'DONE') return

    updateTask(windowData.activeProject.id, task.id, {
      stage: task.stage === 'TODO' ? 'IN_PROGRESS' : 'DONE',
    }).then((response) => {
      if (response.ok) {
        updateTasks()
        windowData.updateActiveProject()
      }
    })
  }

  const moveTaskPrevious = (task) => {
    if (task.stage === 'TODO') return

    updateTask(windowData.activeProject.id, task.id, {
      stage: task.stage === 'DONE' ? 'IN_PROGRESS' : 'TODO',
    }).then((response) => {
      if (response.ok) {
        updateTasks()
        windowData.updateActiveProject()
      }
    })
  }

  const hideFromKanban = (task) => {
    updateTask(windowData.activeProject.id, task.id, {
      is_show_in_kanban: false,
    }).then((response) => {
      if (response.ok) {
        updateTasks()
        windowData.updateActiveProject()
      }
    })
  }

  return (
    <div className='window-kanban'>
      <h3>Канбан</h3>

      <div className='kanban'>
        <div className='kanban-todo'>
          <h4>TODO</h4>

          {todo.map((task) => (
            <div
              className='task'
              key={task.id}>
              <div className='task-info'>
                <div className='task-name'>{task.name}</div>
                <div className='task-description'>{task.description}</div>
              </div>

              <div className='task-actions'>
                <button
                  className='btn btn-primary'
                  onClick={() => moveTaskNext(task)}>
                  <img src={AngleRight} />
                </button>
                <button
                  className='btn btn-danger'
                  onClick={() => hideFromKanban(task)}>
                  <img src={EyeSlash} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className='kanban-in-progress'>
          <h4>IN PROGRESS</h4>

          {inProgress.map((task) => (
            <div
              className='task'
              key={task.id}>
              <div className='task-info'>
                <div className='task-name'>{task.name}</div>
                <div className='task-description'>{task.description}</div>
              </div>

              <div className='task-actions'>
                <button
                  className='btn btn-primary'
                  onClick={() => moveTaskPrevious(task)}>
                  <img src={AngleLeft} />
                </button>
                <button
                  className='btn btn-primary'
                  onClick={() => moveTaskNext(task)}>
                  <img src={AngleRight} />
                </button>
                <button
                  className='btn btn-danger'
                  onClick={() => hideFromKanban(task)}>
                  <img src={EyeSlash} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className='kanban-done'>
          <h4>DONE</h4>

          {done.map((task) => (
            <div
              className='task'
              key={task.id}>
              <div className='task-info'>
                <div className='task-name'>{task.name}</div>
                <div className='task-description'>{task.description}</div>
              </div>

              <div className='task-actions'>
                <button
                  className='btn btn-primary'
                  onClick={() => moveTaskPrevious(task)}>
                  <img src={AngleLeft} />
                </button>
                <button
                  className='btn btn-danger'
                  onClick={() => hideFromKanban(task)}>
                  <img src={EyeSlash} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Kanban
