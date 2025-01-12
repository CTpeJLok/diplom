import { useState, useEffect, useContext } from 'react'

import { AuthContext } from '@contexts/AuthContext'

import API_URL from '@constants/API'

import Checkbox from '@components/home/Checkbox'

const ProjectTasks = ({ project, window, setWindow }) => {
  const { accessToken } = useContext(AuthContext)

  const [firstTasks, setFirstTasks] = useState([])

  const getFirstTasks = async () => {
    try {
      const result = await fetch(
        `${API_URL}/project/${project.id}/task/first/5/`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )

      const data = await result.json()

      if (result.status === 200) {
        setFirstTasks(() => data.data)
      }

      return [result.status === 200, data.detail]
    } catch (e) {
      return [false, e]
    }
  }

  useEffect(() => {
    if (project.id) getFirstTasks()
  }, [project])

  return (
    <div className='block tasks'>
      <div className='control'>
        <p>Задачи</p>
        <button
          onClick={() =>
            setWindow((i) => (i.type === 'TASKS' ? {} : { type: 'TASKS' }))
          }>
          {window?.type === 'TASKS' ? 'Скрыть' : 'Показать все'}
        </button>
      </div>

      <div className='content'>
        {firstTasks.map((task) => (
          <div
            key={task.id}
            className='task'
            onClick={() =>
              setWindow((i) => (i.type === 'TASK' ? {} : { type: 'TASK' }))
            }>
            <div className='name'>
              <p>{task.name}</p>
              <p>{task.description}</p>
            </div>
            <Checkbox checked={task.is_done} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProjectTasks
