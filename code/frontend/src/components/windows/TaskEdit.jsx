import { WINDOW_TASK } from '@constants/WINDOW'
import useApi from '@hooks/useApi'
import { useState } from 'react'

import FloppyDisk from '@images/floppy-disk.svg'

const TaskEdit = ({ setActiveWindow, windowData, setWindowData }) => {
  const { createTask, updateTask } = useApi()

  const [task, setTask] = useState(windowData.task ?? {})

  return (
    <div className='window-task-edit'>
      <h3>Редактирование задачи</h3>

      <div className='form-floating'>
        <input
          key='task_edit_name'
          type='text'
          className='form-control'
          placeholder='Enter name'
          value={task.name ?? ''}
          onChange={(e) => setTask((old) => ({ ...old, name: e.target.value }))}
        />
        <label>Название</label>
      </div>

      <div className='form-floating'>
        <input
          key='task_edit_description'
          type='text'
          className='form-control'
          placeholder='Enter description'
          value={task.description ?? ''}
          onChange={(e) =>
            setTask((old) => ({ ...old, description: e.target.value }))
          }
        />
        <label>Описание</label>
      </div>

      <div className='form-floating'>
        <select
          key='task_edit_stage'
          className='form-select'
          value={task.stage ?? ''}
          onChange={(e) =>
            setTask((old) => ({ ...old, stage: e.target.value }))
          }>
          <option value='TODO'>TODO</option>
          <option value='IN_PROGRESS'>IN_PROGRESS</option>
          <option value='DONE'>DONE</option>
        </select>
        <label>Стадия</label>
      </div>

      <div className='form-check'>
        <input
          key='task_edit_is_show_in_kanban'
          type='checkbox'
          className='form-check-input'
          checked={task.is_show_in_kanban ?? true}
          onChange={() =>
            setTask((old) => ({
              ...old,
              is_show_in_kanban: !old.is_show_in_kanban,
            }))
          }
        />
        <label className='form-check-label'>Показывать в канбан-доске</label>
      </div>

      <button
        className='btn btn-primary'
        onClick={() => {
          if (task.id)
            updateTask(windowData.activeProject.id, task.id, task).then(
              (response) => {
                if (response.ok) {
                  setActiveWindow(() => WINDOW_TASK)
                  setWindowData((old) => ({
                    activeProject: old.activeProject,
                    updateActiveProject: old.updateActiveProject,
                    setActiveProject: old.setActiveProject,
                  }))
                  windowData.updateActiveProject()
                }
              }
            )
          else
            createTask(windowData.activeProject.id, task).then((response) => {
              if (response.ok) {
                setActiveWindow(() => WINDOW_TASK)
                setWindowData((old) => ({
                  activeProject: old.activeProject,
                  updateActiveProject: old.updateActiveProject,
                  setActiveProject: old.setActiveProject,
                }))
                windowData.updateActiveProject()
              }
            })
        }}>
        <img src={FloppyDisk} />
      </button>

      <button
        className='btn btn-danger'
        onClick={() => {
          setActiveWindow(() => WINDOW_TASK)
          setWindowData((old) => ({
            activeProject: old.activeProject,
            updateActiveProject: old.updateActiveProject,
            setActiveProject: old.setActiveProject,
          }))
        }}>
        Назад
      </button>
    </div>
  )
}

export default TaskEdit
