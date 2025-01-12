import { useState, useEffect, useContext } from 'react'

import Menu from '@blocks/home/Menu'
import Window from '@blocks/home/Window'

import { AuthContext } from '@contexts/AuthContext'

import API_URL from '@constants/API'

import '@styles/home.css'

const HomePage = () => {
  const { accessToken } = useContext(AuthContext)

  const [window, setWindow] = useState({})
  const [project, setProject] = useState({})

  const getProject = async (id) => {
    try {
      const result = await fetch(`${API_URL}/project/${id}/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      })

      const data = await result.json()

      return [result.status === 200, data.data]
    } catch (e) {
      return [false, e]
    }
  }

  useEffect(() => {
    const setMainProject = async (id) => {
      const result = await getProject(id)

      if (result[0]) setProject(() => result[1])
    }

    const projectID = localStorage.getItem('project')
    if (projectID) setMainProject(projectID)
  }, [])

  return (
    <div className='home-page'>
      <Menu
        project={project}
        setWindow={setWindow}
      />
      <Window
        window={window}
        setWindow={setWindow}
        project={project}
        setProject={setProject}
      />
    </div>
  )
}

export default HomePage
