import { useState, useEffect, useContext } from 'react'

import { AuthContext } from '@contexts/AuthContext'

import API_URL from '@constants/API'

const Projects = ({ project, setProject }) => {
  const { accessToken } = useContext(AuthContext)

  const [projects, setProjects] = useState([])

  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
  })

  const [error, setError] = useState('')

  const getProjects = async () => {
    try {
      const result = await fetch(`${API_URL}/project/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      })

      const data = await result.json()

      if (result.status === 200) {
        setProjects(() => data.data)
      }

      return [result.status === 200, data.detail]
    } catch (e) {
      return [false, e]
    }
  }

  const createProject = async (name, description) => {
    try {
      const result = await fetch(`${API_URL}/project/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          name,
          description,
        }),
      })

      const data = await result.json()

      if (result.status === 200) {
        setProjects((prevProjects) => [...prevProjects, data.data])
      }

      return [result.status === 200, data.detail]
    } catch (e) {
      return [false, e]
    }
  }

  const selectProject = (id) => {
    if (id === project?.id) {
      setProject(() => {})
      localStorage.removeItem('project')
      return
    }

    setProject(() => projects.find((i) => i.id === id))
    localStorage.setItem('project', id)
  }

  useEffect(() => {
    getProjects()
  }, [])

  return (
    <>
      <div className='block create-project'>
        <h2>Создать новый проект</h2>

        <div className='input-group'>
          <label htmlFor='name'>Название</label>
          <input
            type='text'
            name='name'
            id='name'
            value={newProject.name}
            onChange={(e) =>
              setNewProject({
                ...newProject,
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
            value={newProject.description}
            onChange={(e) =>
              setNewProject({
                ...newProject,
                description: e.target.value,
              })
            }
          />
        </div>

        {error && <p className='error'>{error}</p>}

        <button
          onClick={async () => {
            setError(() => '')

            const result = await createProject(
              newProject.name,
              newProject.description
            )

            if (result[0]) setNewProject(() => ({ name: '', description: '' }))
            else setError(() => result[1])
          }}>
          Создать
        </button>
      </div>

      <div className='block select-project'>
        <h2>Выбрать проект</h2>
        {projects.length === 0 && (
          <div className='project'>
            <p>Нет проектов</p>
          </div>
        )}

        {projects.map((i) => (
          <div
            key={i.id}
            className='project'
            onClick={() => selectProject(i.id)}>
            <p>{(project?.id === i.id ? '👉 ' : '') + i.name}</p>
            <p>{i.description}</p>
          </div>
        ))}
      </div>
    </>
  )
}

export default Projects
