import { WINDOW_CLEAR, WINDOW_PROJECT } from '@constants/WINDOW'
import useApi from '@hooks/useApi'
import { useState } from 'react'

import FloppyDisk from '@images/floppy-disk.svg'

const ProjectEdit = ({ setActiveWindow, windowData, setWindowData }) => {
  const { createProject, updateProject } = useApi()

  const [project, setProject] = useState(windowData.project ?? {})

  return (
    <div className='window-project-edit'>
      <h3>Редактирование проекта</h3>

      <div className='form-floating'>
        <input
          key='project_edit_name'
          type='text'
          className='form-control'
          placeholder='Enter name'
          value={project.name ?? ''}
          onChange={(e) =>
            setProject((old) => ({ ...old, name: e.target.value }))
          }
        />
        <label>Название</label>
      </div>

      <div className='form-floating'>
        <input
          key='project_edit_description'
          type='text'
          className='form-control'
          placeholder='Enter description'
          value={project.description ?? ''}
          onChange={(e) =>
            setProject((old) => ({ ...old, description: e.target.value }))
          }
        />
        <label>Описание</label>
      </div>

      <button
        className='btn btn-primary'
        onClick={() => {
          if (project.id)
            updateProject(project.id, project).then((response) => {
              if (response.ok) {
                windowData.setActiveProject(response.data.project)
                setActiveWindow(() => WINDOW_CLEAR)
                setWindowData(() => ({}))
                windowData.updateActiveProject()
              }
            })
          else
            createProject(project).then((response) => {
              if (response.ok) {
                windowData.setActiveProject(response.data.project)
                setActiveWindow(() => WINDOW_CLEAR)
                setWindowData(() => ({}))
                windowData.updateActiveProject()
              }
            })
        }}>
        <img src={FloppyDisk} />
      </button>

      <button
        className='btn btn-danger'
        onClick={() => {
          setActiveWindow(() => WINDOW_PROJECT)
          setWindowData((old) => ({
            activeProject: old.activeProject,
            updateActiveProject: old.updateActiveProject,
            setActiveProject: old.setActiveProject,
          }))
        }}>
        Назад
      </button>
    </div>
  )
}

export default ProjectEdit
