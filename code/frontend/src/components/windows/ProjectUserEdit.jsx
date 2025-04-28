import { WINDOW_PROJECT_USER } from '@constants/WINDOW'
import useApi from '@hooks/useApi'
import { useState } from 'react'

import UserPlus from '@images/user-plus.svg'

const ProjectUserEdit = ({ setActiveWindow, windowData, setWindowData }) => {
  const { inviteProjectUser } = useApi()

  const [email, setEmail] = useState('')

  return (
    <div className='window-project-user-edit'>
      <h3>Пригласить пользователя</h3>

      <div className='form-floating'>
        <input
          key='project_user_edit_email'
          type='text'
          className='form-control'
          placeholder='Enter Email'
          value={email ?? ''}
          onChange={(e) => setEmail(() => e.target.value)}
        />
        <label>Email</label>
      </div>

      <button
        className='btn btn-primary'
        onClick={() => {
          inviteProjectUser(windowData.activeProject.id, { email }).then(
            (response) => {
              if (response.ok) {
                setActiveWindow(() => WINDOW_PROJECT_USER)
                windowData.updateActiveProject()
              }
            }
          )
        }}>
        <img src={UserPlus} />
      </button>

      <button
        className='btn btn-danger'
        onClick={() => {
          setActiveWindow(() => WINDOW_PROJECT_USER)
        }}>
        Назад
      </button>
    </div>
  )
}

export default ProjectUserEdit
