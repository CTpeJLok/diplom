import {
  WINDOW_CLEAR,
  WINDOW_KANBAN,
  WINDOW_NOTE,
  WINDOW_NOTE_EDIT,
  WINDOW_NOTE_VIEW,
  WINDOW_PROJECT,
  WINDOW_PROJECT_EDIT,
  WINDOW_PROJECT_USER,
  WINDOW_TASK,
  WINDOW_TASK_EDIT,
} from '@constants/WINDOW'
import useApi from '@hooks/useApi'
import useToken from '@hooks/useToken'
import { useNavigate } from 'react-router-dom'

const Navigation = ({
  activeProject,
  setActiveProject,
  activeWindow,
  setActiveWindow,
  setWindowData,
  updateActiveProject,
}) => {
  const navigation = useNavigate()

  const token = useToken()
  const { logout } = useApi()

  const makeLogout = () => {
    logout({ refresh: token.refresh })
      .then(() => {
        token.removeTokens()
        token.removeUserInfo()
        setActiveProject({})
      })
      .catch(() => {
        token.removeTokens()
        token.removeUserInfo()
        setActiveProject({})
      })

    navigation('/auth')
  }

  return (
    <div className='navigation'>
      <div className='user-block block'>
        <div className='block-content'>
          <p className='block-label'>Пользовтель</p>
          <p className='block-content'>{token.userInfo.email?.split('@')[0]}</p>
        </div>

        <div className='block-action'>
          <button
            className='btn btn-danger'
            onClick={() => makeLogout()}>
            Выйти
          </button>
        </div>
      </div>

      <div className='project-block block'>
        <div className='block-content'>
          <p className='block-label'>Проект</p>
          <p className='block-content'>{activeProject.name ?? 'Не выбран'}</p>
        </div>

        <div className='block-action'>
          <button
            className='btn btn-primary'
            onClick={() => {
              setActiveWindow((old) =>
                [WINDOW_PROJECT, WINDOW_PROJECT_EDIT].includes(old)
                  ? WINDOW_CLEAR
                  : WINDOW_PROJECT
              )
              setWindowData(() =>
                [WINDOW_PROJECT, WINDOW_PROJECT_EDIT].includes(activeWindow)
                  ? {}
                  : { activeProject, setActiveProject, updateActiveProject }
              )
            }}>
            {[WINDOW_PROJECT, WINDOW_PROJECT_EDIT].includes(activeWindow)
              ? 'Скрыть'
              : 'Сменить'}
          </button>
        </div>
      </div>

      {activeProject.id && (
        <>
          <div className='kanban-block block'>
            <div className='block-content'>
              <p className='block-content'>Канбан</p>
            </div>

            <div className='block-action'>
              <button
                className='btn btn-primary'
                onClick={() => {
                  setActiveWindow((old) =>
                    old === WINDOW_KANBAN ? WINDOW_CLEAR : WINDOW_KANBAN
                  )
                  setWindowData(() =>
                    activeWindow === WINDOW_KANBAN
                      ? {}
                      : { activeProject, updateActiveProject }
                  )
                }}>
                {activeWindow === WINDOW_KANBAN ? 'Скрыть' : 'Показать'}
              </button>
            </div>
          </div>

          <div className='project-user-block block'>
            <div className='block-content'>
              <p className='block-label'>Команда</p>
              <p className='block-content'>
                Всего: {activeProject.users_count ?? 0}
              </p>
            </div>

            <div className='block-action'>
              <button
                className='btn btn-primary'
                onClick={() => {
                  setActiveWindow((old) =>
                    old === WINDOW_PROJECT_USER
                      ? WINDOW_CLEAR
                      : WINDOW_PROJECT_USER
                  )
                  setWindowData(() =>
                    activeWindow === WINDOW_PROJECT_USER
                      ? {}
                      : { activeProject, setActiveProject, updateActiveProject }
                  )
                }}>
                {activeWindow === WINDOW_PROJECT_USER ? 'Скрыть' : 'Показать'}
              </button>
            </div>
          </div>

          <div className='task-block block'>
            <div className='block-content'>
              <p className='block-label'>Задачи</p>
              <p className='block-content'>
                Активные: {activeProject.in_progress_tasks_count ?? 0}
              </p>
            </div>

            <div className='block-action'>
              <button
                className='btn btn-primary'
                onClick={() => {
                  setActiveWindow((old) =>
                    [WINDOW_TASK, WINDOW_TASK_EDIT].includes(old)
                      ? WINDOW_CLEAR
                      : WINDOW_TASK
                  )
                  setWindowData(() =>
                    [WINDOW_TASK, WINDOW_TASK_EDIT].includes(activeWindow)
                      ? {}
                      : { activeProject, setActiveProject, updateActiveProject }
                  )
                }}>
                {[WINDOW_TASK, WINDOW_TASK_EDIT].includes(activeWindow)
                  ? 'Скрыть'
                  : 'Показать'}
              </button>
            </div>
          </div>

          <div className='note-block block'>
            <div className='block-content'>
              <p className='block-label'>Записки</p>
              <p className='block-content'>
                Всего: {activeProject.notes_count}
              </p>
            </div>

            <div className='block-action'>
              <button
                className='btn btn-primary'
                onClick={() => {
                  setActiveWindow((old) =>
                    [WINDOW_NOTE, WINDOW_NOTE_EDIT, WINDOW_NOTE_VIEW].includes(
                      old
                    )
                      ? WINDOW_CLEAR
                      : WINDOW_NOTE
                  )
                  setWindowData(() =>
                    [WINDOW_NOTE, WINDOW_NOTE_EDIT, WINDOW_NOTE_VIEW].includes(
                      activeWindow
                    )
                      ? {}
                      : { activeProject, updateActiveProject }
                  )
                }}>
                {[WINDOW_NOTE, WINDOW_NOTE_EDIT, WINDOW_NOTE_VIEW].includes(
                  activeWindow
                )
                  ? 'Скрыть'
                  : 'Показать'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Navigation
