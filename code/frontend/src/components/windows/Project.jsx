import { WINDOW_CLEAR, WINDOW_PROJECT_EDIT } from '@constants/WINDOW'
import useApi from '@hooks/useApi'
import { useEffect, useState } from 'react'

import Check from '@images/check.svg'
import Pen from '@images/pen.svg'
import Trash from '@images/trash.svg'

const Project = ({ setActiveWindow, windowData, setWindowData }) => {
  const { fetchProjects, deleteProject } = useApi()

  const [projects, setProjects] = useState([])

  useEffect(() => {
    fetchProjects().then((response) => {
      if (response.ok) setProjects(() => response.data.projects)
    })
  }, [])

  return (
    <div className='window-project'>
      <h3>Проекты</h3>

      <button
        className='btn btn-primary'
        onClick={() => {
          setWindowData((old) => ({
            project: {},
            activeProject: old.activeProject,
            setActiveProject: old.setActiveProject,
            updateActiveProject: old.updateActiveProject,
          }))
          setActiveWindow(() => WINDOW_PROJECT_EDIT)
        }}>
        Создать
      </button>

      {projects.map((project) => (
        <div
          key={project.id}
          className={
            'project' +
            (windowData.activeProject.id === project.id ? ' active' : '')
          }>
          <div className='project-info'>
            <p className='project-name'>{project.name}</p>
            <p className='project-description'>{project.description}</p>
          </div>
          <div className='project-actions'>
            <button
              className='btn btn-primary'
              onClick={() => {
                windowData.setActiveProject(
                  project.id === windowData.activeProject.id ? {} : project
                )
                setActiveWindow(() => WINDOW_CLEAR)
              }}>
              <img src={Check} />
            </button>
            <button
              className='btn btn-secondary'
              onClick={() => {
                setWindowData((old) => ({
                  project,
                  activeProject: old.activeProject,
                  updateActiveProject: old.updateActiveProject,
                  setActiveProject: old.setActiveProject,
                }))
                setActiveWindow(() => WINDOW_PROJECT_EDIT)
              }}>
              <img src={Pen} />
            </button>
            <button
              className='btn btn-danger'
              onClick={() => {
                deleteProject(project.id).then((response) => {
                  if (response.ok) {
                    windowData.setActiveProject(
                      windowData.activeProject.id === project.id
                        ? {}
                        : windowData.activeProject
                    )
                    setActiveWindow(() => WINDOW_CLEAR)
                    windowData.updateActiveProject()
                  }
                })
              }}>
              <img src={Trash} />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Project
