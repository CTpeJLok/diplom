import Navigation from '@components/Navigation'
import Window from '@components/Window'
import { WINDOW_CLEAR } from '@constants/WINDOW'
import useApi from '@hooks/useApi'
import { useEffect, useState } from 'react'

const Home = () => {
  const { fetchProject } = useApi()

  const [activeProject, setActiveProject] = useState(() =>
    JSON.parse(localStorage.getItem('activeProject') ?? '{}')
  )

  const changeActiveProject = (project) => {
    setActiveProject(() => project)
    localStorage.setItem('activeProject', JSON.stringify(project))
  }

  const updateActiveProject = () => {
    fetchProject(activeProject.id).then((response) => {
      if (response.ok) changeActiveProject(response.data.project)
      else changeActiveProject({})
    })
  }

  useEffect(() => {
    if (activeProject?.id) updateActiveProject()
  }, [])

  const [activeWindow, setActiveWindow] = useState(WINDOW_CLEAR)
  const [windowData, setWindowData] = useState({})

  return (
    <div className='page home'>
      <Navigation
        activeProject={activeProject}
        setActiveProject={changeActiveProject}
        activeWindow={activeWindow}
        setActiveWindow={setActiveWindow}
        setWindowData={setWindowData}
        updateActiveProject={updateActiveProject}
      />

      <Window
        activeWindow={activeWindow}
        setActiveWindow={setActiveWindow}
        windowData={windowData}
        setWindowData={setWindowData}
      />
    </div>
  )
}

export default Home
