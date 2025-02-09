import { useState, useEffect, useContext } from 'react'

import { AuthContext } from '@contexts/AuthContext'

import API_URL from '@constants/API'

const Team = ({ project }) => {
  const { accessToken, userInfo } = useContext(AuthContext)

  const [users, setUsers] = useState([])

  const [newUser, setNewUser] = useState({
    username: '',
  })

  const [error, setError] = useState('')

  const getUsers = async () => {
    try {
      const result = await fetch(`${API_URL}/project/${project.id}/team/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      })

      const data = await result.json()

      if (result.status === 200) {
        setUsers(() => data.data)
      }

      return [result.status === 200, data.detail]
    } catch (e) {
      return [false, e]
    }
  }

  const createUser = async (username) => {
    try {
      const result = await fetch(
        `${API_URL}/project/${project.id}/team/create/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            username,
          }),
        }
      )

      const data = await result.json()

      if (result.status === 200) {
        setUsers(() => data.data)
      }

      return [result.status === 200, data.detail]
    } catch (e) {
      return [false, e]
    }
  }

  const deleteUser = async (id) => {
    try {
      const result = await fetch(
        `${API_URL}/project/${project.id}/team/${id}/delete/`,
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
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id))
      }

      return [result.status === 200, data.detail]
    } catch (e) {
      return [false, e]
    }
  }

  useEffect(() => {
    if (project.id) getUsers()
  }, [project])

  return (
    <>
      <div className='block create-task'>
        <h2>Добавить пользователя</h2>

        <div className='input-group'>
          <label htmlFor='name'>Логин</label>
          <input
            type='text'
            name='username'
            id='username'
            value={newUser.username}
            onChange={(e) =>
              setNewUser({
                ...newUser,
                username: e.target.value,
              })
            }
          />
        </div>

        {error && <p className='error'>{error}</p>}

        <button
          onClick={async () => {
            setError(() => '')

            const result = await createUser(newUser.username)

            if (result[0]) setNewUser(() => ({ username: '' }))
            else setError(() => result[1])
          }}>
          Создать
        </button>
      </div>

      <div className='block tasks'>
        {users.length === 0 ? (
          <h2>Нет пользователей</h2>
        ) : (
          <>
            <h2>Всего пользователей: {users.length}</h2>
            <div className='task'>
              <div className='name'>
                <p>Логин</p>
              </div>

              <div className='dates'>
                <p>Создано</p>
                <p>Изменено</p>
              </div>

              <p>Действия</p>
            </div>
          </>
        )}

        {users.map((projectUser) => (
          <div
            className='task'
            key={projectUser.id}>
            <div className='name'>
              <p>{projectUser.user.username.split('@')[0]}</p>
            </div>

            <div className='dates'>
              <p>{projectUser.createdAt}</p>
              <p>{projectUser.updatedAt}</p>
            </div>

            <div className='actions'>
              {projectUser.user.username !== userInfo?.username && (
                <button onClick={() => deleteUser(projectUser.id)}>X</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default Team
