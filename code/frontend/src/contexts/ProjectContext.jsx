import { createContext, useState, useEffect, useContext } from 'react'

import { AuthContext } from '@contexts/AuthContext'

import API_URL from '@constants/API'

export const ProjectContext = createContext()

export const ProjectProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true)
  const { accessToken } = useContext(AuthContext)

  const [projects, setProjects] = useState([])
  const [project, setProject] = useState()

  const getProjects = async () => {
    try {
      const result = await fetch(`${API_URL}/project/`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      const data = await result.json()

      if (result.status === 200) {
        setProjects(() => data.data)
      }

      return [result.status === 200, data.detail]
    } catch (error) {
      return [false, 'Error']
    }
  }

  const createProject = async (name, description) => {
    try {
      const result = await fetch(`${API_URL}/project/create/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          name,
          description,
        }),
      })

      if (result.status === 200) {
        setProjects((prevProjects) => [...prevProjects, result.data.data])
        setProject(() => result.data.data)
      }

      return [result.status === 200, result.data.detail]
    } catch (error) {
      return [false, error.response.data.detail]
    }
  }

  console.log(projects, project)

  useEffect(() => {
    // getProjects()
  }, [])

  useEffect(() => {
    if (!project && projects.length > 0) {
      setProject(() => projects[0])
    }
  }, [projects])

  useEffect(() => {
    setIsLoading(() => (accessToken ? false : true))

    if (accessToken) {
      getProjects()
    }
  }, [accessToken])

  const contextData = {
    projects,
    setProjects,

    project,
    setProject,

    getProjects,
    createProject,
  }

  return (
    <ProjectContext.Provider value={contextData}>
      {isLoading ? null : children}
    </ProjectContext.Provider>
  )
}
