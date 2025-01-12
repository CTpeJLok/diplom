import { useContext, useState } from 'react'

import { AuthContext } from '@contexts/AuthContext'

import API_URL from '@constants/API'

import KANBAN_TYPES from '@constants/KANBAN_TYPES'

const KanbanItem = ({ task, project, setKanban, type }) => {
  const { accessToken } = useContext(AuthContext)

  const deleteTask = async () => {
    try {
      const result = await fetch(
        `${API_URL}/project/${project.id}/kanban/${task.id}/${type}/delete/`,
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
        setKanban(() => data.data)
      }

      return [result.status === 200, data.detail]
    } catch (e) {
      return [false, e]
    }
  }

  const moveNext = async () => {
    try {
      const result = await fetch(
        `${API_URL}/project/${project.id}/kanban/${task.id}/${type}/move/`,
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
        setKanban(() => data.data)
      }

      return [result.status === 200, data.detail]
    } catch (e) {
      return [false, e]
    }
  }

  return (
    <>
      <div className='block kanban-item'>
        <div className='name'>
          <p className='task-name'>{task.name}</p>
          <p className='task-description'>{task.description}</p>
        </div>

        <div className='actions'>
          {type !== KANBAN_TYPES.DONE && (
            <button onClick={() => moveNext()}>Дальше</button>
          )}
          <button onClick={() => deleteTask()}>Удалить</button>
        </div>
      </div>
    </>
  )
}

export default KanbanItem
