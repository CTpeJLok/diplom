import { WINDOW_PROJECT_USER_EDIT } from '@constants/WINDOW'
import useApi from '@hooks/useApi'
import { useEffect, useState } from 'react'

import Trash from '@images/trash.svg'
import UserPlus from '@images/user-plus.svg'

const ProjectUser = ({ setActiveWindow, windowData, setWindowData }) => {
  const {
    fetchProjectUsers,
    rejectInviteProjectUser,
    resendInviteProjectUser,
  } = useApi()

  const [projectUsers, setProjectUsers] = useState([])

  const updateProjectUsers = () => {
    fetchProjectUsers(windowData.activeProject.id).then((response) => {
      if (response.ok) setProjectUsers(() => response.data.project_users)
    })
  }

  useEffect(() => {
    updateProjectUsers()
  }, [])

  return (
    <div className='window-project-user'>
      <h3>Пользователи</h3>

      <button
        className='btn btn-primary'
        onClick={() => {
          setActiveWindow(() => WINDOW_PROJECT_USER_EDIT)
        }}>
        Пригласить
      </button>

      {projectUsers.map((projectUser) => (
        <div
          key={projectUser.id}
          className='project-user'>
          <div className='project-user-info'>
            <p className='project-user-name'>{projectUser.user.email}</p>
            <p className='project-user-description'>{projectUser.role}</p>
          </div>

          {projectUser.role !== 'CREATOR' && (
            <div className='project-user-actions'>
              <button
                className='btn btn-primary'
                onClick={() => {
                  rejectInviteProjectUser(
                    projectUser.project.id,
                    projectUser.user.pk
                  ).then(() => {
                    updateProjectUsers()
                    windowData.updateActiveProject()
                  })
                }}>
                <img src={Trash} />
              </button>

              {projectUser.invite_code && (
                <button
                  className='btn btn-primary'
                  onClick={() => {
                    resendInviteProjectUser(
                      projectUser.project.id,
                      projectUser.user.pk,
                      projectUser.invite_code
                    ).then(() => {
                      updateProjectUsers()
                    })
                  }}>
                  <img src={UserPlus} />
                </button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default ProjectUser
