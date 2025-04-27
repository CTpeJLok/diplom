import { WINDOW_NOTE } from '@constants/WINDOW'
import useApi from '@hooks/useApi'
import { useState } from 'react'

const NoteEdit = ({ setActiveWindow, windowData, setWindowData }) => {
  const { createNote, updateNote } = useApi()

  const [note, setNote] = useState(windowData.note ?? {})

  return (
    <div className='window-note-edit'>
      <h3>Редактирование записки</h3>

      <div className='form-floating'>
        <input
          key='note_edit_name'
          type='text'
          className='form-control'
          placeholder='Enter name'
          value={note.name ?? ''}
          onChange={(e) => setNote((old) => ({ ...old, name: e.target.value }))}
        />
        <label>Название</label>
      </div>

      <div className='form-floating'>
        <input
          key='note_edit_description'
          type='text'
          className='form-control'
          placeholder='Enter description'
          value={note.description ?? ''}
          onChange={(e) =>
            setNote((old) => ({ ...old, description: e.target.value }))
          }
        />
        <label>Описание</label>
      </div>

      <button
        className='btn btn-primary'
        onClick={() => {
          if (note.id)
            updateNote(windowData.activeProject.id, note.id, note).then(
              (response) => {
                if (response.ok) {
                  setActiveWindow(() => WINDOW_NOTE)
                  setWindowData((old) => ({
                    activeProject: old.activeProject,
                    updateActiveProject: old.updateActiveProject,
                    setActiveProject: old.setActiveProject,
                  }))
                }
              }
            )
          else
            createNote(windowData.activeProject.id, note).then((response) => {
              if (response.ok) {
                setActiveWindow(() => WINDOW_NOTE)
                setWindowData((old) => ({
                  activeProject: old.activeProject,
                  updateActiveProject: old.updateActiveProject,
                  setActiveProject: old.setActiveProject,
                }))
                windowData.updateActiveProject()
              }
            })
        }}>
        Сохранить
      </button>

      <button
        className='btn btn-danger'
        onClick={() => {
          setActiveWindow(() => WINDOW_NOTE)
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

export default NoteEdit
