import { useState, useEffect, useContext } from 'react'

import { AuthContext } from '@contexts/AuthContext'

import API_URL from '@constants/API'

import Checkbox from '@components/home/Checkbox'

const Tasks = ({ project }) => {
  const { accessToken } = useContext(AuthContext)

  const [tasks, setTasks] = useState([])

  const [newTask, setNewTask] = useState({
    name: '',
    description: '',
  })

  const [error, setError] = useState('')

  const getTasks = async () => {
    try {
      const result = await fetch(`${API_URL}/project/${project.id}/task/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      })

      const data = await result.json()

      if (result.status === 200) {
        setTasks(() => data.data)
      }

      return [result.status === 200, data.detail]
    } catch (e) {
      return [false, e]
    }
  }

  const createTask = async (name, description) => {
    try {
      const result = await fetch(
        `${API_URL}/project/${project.id}/task/create/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            name,
            description,
          }),
        }
      )

      const data = await result.json()

      if (result.status === 200) {
        setTasks(() => data.data)
      }

      return [result.status === 200, data.detail]
    } catch (e) {
      return [false, e]
    }
  }

  const toggleTask = async (id) => {
    try {
      const result = await fetch(
        `${API_URL}/project/${project.id}/task/${id}/toggle/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )

      const data = await result.json()

      if (result.status === 200) {
        setTasks((prevTasks) =>
          prevTasks.map((task) => {
            if (task.id === id) {
              return { ...task, is_done: !task.is_done }
            }

            return task
          })
        )
      }

      return [result.status === 200, data.detail]
    } catch (e) {
      return [false, e]
    }
  }

  const deleteTask = async (id) => {
    try {
      const result = await fetch(
        `${API_URL}/project/${project.id}/task/${id}/delete/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )

      const data = await result.json()

      if (result.status === 200) {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id))
      }

      return [result.status === 200, data.detail]
    } catch (e) {
      return [false, e]
    }
  }

  useEffect(() => {
    if (project.id) getTasks()
  }, [project])

  return (
    <>
      <div className='block create-task'>
        <h2>Создать новую задачу</h2>

        <div className='input-group'>
          <label htmlFor='name'>Название</label>
          <input
            type='text'
            name='name'
            id='name'
            value={newTask.name}
            onChange={(e) =>
              setNewTask({
                ...newTask,
                name: e.target.value,
              })
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
              setNewTask({
                ...newTask,
                description: e.target.value,
              })
            }
          />
        </div>

        {error && <p className='error'>{error}</p>}

        <button
          onClick={async () => {
            setError(() => '')

            const result = await createTask(newTask.name, newTask.description)

            if (result[0]) setNewTask(() => ({ name: '', description: '' }))
            else setError(() => result[1])
          }}>
          Создать
        </button>
      </div>

      <div className='block tasks'>
        {tasks.length === 0 ? (
          <h2>Нет задач</h2>
        ) : (
          <>
            <h2>Задач: {tasks.length}</h2>
            <div className='task'>
              <div className='name'>
                <p>Название</p>
                <p>Описание</p>
              </div>

              <div className='dates'>
                <p>Создано</p>
                <p>Изменено</p>
              </div>

              <p>Выполнено</p>
            </div>
          </>
        )}

        {tasks.map((task) => (
          <div
            className='task'
            key={task.id}>
            <div className='name'>
              <p>{task.name}</p>
              <p>{task.description}</p>
            </div>

            <div className='dates'>
              <p>{task.created_at}</p>
              <p>{task.updated_at}</p>
            </div>

            <div className='actions'>
              <Checkbox
                checked={task.is_done}
                onChange={() => toggleTask(task.id)}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default Tasks
