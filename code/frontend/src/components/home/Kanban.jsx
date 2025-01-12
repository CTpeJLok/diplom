import { useState, useEffect, useContext } from 'react'

import { AuthContext } from '@contexts/AuthContext'

import API_URL from '@constants/API'

import KanbanColumn from '@components/home/KanbanColumn'

import KANBAN_TYPES from '@constants/KANBAN_TYPES'

const Kanban = ({ project }) => {
  const { accessToken } = useContext(AuthContext)

  const [kanban, setKanban] = useState({})

  const [newTask, setNewTask] = useState({
    name: '',
    description: '',
    status: 'TODO',
  })

  const [error, setError] = useState('')

  const getKanban = async () => {
    try {
      const result = await fetch(`${API_URL}/project/${project.id}/kanban/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      })

      const data = await result.json()

      if (result.status === 200) {
        setKanban(() => data.data)
      }

      return [result.status === 200, data.detail]
    } catch (e) {
      return [false, e]
    }
  }

  const createTask = async () => {
    try {
      const result = await fetch(
        `${API_URL}/project/${project.id}/kanban/create/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            name: newTask.name,
            description: newTask.description,
            status: newTask.status,
          }),
        }
      )

      const data = await result.json()

      if (result.status === 200) {
        setKanban(() => data.data)
      }

      return [result.status === 201, data.detail]
    } catch (e) {
      return [false, e]
    }
  }

  useEffect(() => {
    if (project.id) getKanban()
  }, [project])

  return (
    <>
      <div className='block create-kanban'>
        <h2>Создание задачи</h2>

        <div className='input-group'>
          <label htmlFor='name'>Название</label>
          <input
            type='text'
            name='name'
            id='name'
            value={newTask.name}
            onChange={(e) =>
              setNewTask(() => ({ ...newTask, name: e.target.value }))
            }
          />
        </div>

        <div className='input-group'>
          <label htmlFor='description'>Описание</label>
          <input
            type='text'
            name='description'
            id='description'
            value={newTask.description}
            onChange={(e) =>
              setNewTask(() => ({ ...newTask, description: e.target.value }))
            }
          />
        </div>

        <div className='input-group'>
          <label htmlFor='status'>Статус</label>
          <select
            name='status'
            id='status'
            value={newTask.status}
            onChange={(e) =>
              setNewTask(() => ({ ...newTask, status: e.target.value }))
            }>
            <option value='TODO'>To do</option>
            <option value='IN_PROGRESS'>In progress</option>
            <option value='DONE'>Done</option>
          </select>
        </div>

        {error && <p className='error'>{error}</p>}

        <button
          onClick={async () => {
            setError(() => '')

            const result = await createTask(
              newTask.name,
              newTask.description,
              newTask.status
            )

            if (result[0])
              setNewTask(() => ({ name: '', description: '', status: 'TODO' }))
            else setError(() => result[1])
          }}>
          Создать
        </button>
      </div>

      <div className='block kanban'>
        <h2>Канбан</h2>

        <div className='kanban-table'>
          <KanbanColumn
            name='To do'
            tasks={kanban?.todo}
            project={project}
            setKanban={setKanban}
            type={KANBAN_TYPES.TODO}
          />

          <KanbanColumn
            name='In progress'
            tasks={kanban?.inprogress}
            project={project}
            setKanban={setKanban}
            type={KANBAN_TYPES.IN_PROGRESS}
          />

          <KanbanColumn
            name='Done'
            tasks={kanban?.done}
            project={project}
            setKanban={setKanban}
            type={KANBAN_TYPES.DONE}
          />
        </div>
      </div>
    </>
  )
}

export default Kanban
