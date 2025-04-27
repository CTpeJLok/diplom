import { WINDOW_NOTE_EDIT, WINDOW_NOTE_VIEW } from '@constants/WINDOW'
import useApi from '@hooks/useApi'
import { useEffect, useState } from 'react'

const Note = ({ setActiveWindow, windowData, setWindowData }) => {
  const { fetchNotes, deleteNote } = useApi()

  const [notes, setNotes] = useState([])

  const updateNotes = () => {
    fetchNotes(windowData.activeProject.id).then((response) => {
      if (response.ok) setNotes(() => response.data.notes)
    })
  }

  useEffect(() => {
    updateNotes()
  }, [])

  return (
    <div className='window-note'>
      <h3>Записки</h3>

      <button
        className='btn btn-primary'
        onClick={() => {
          setWindowData((old) => ({
            note: {},
            activeProject: old.activeProject,
            setActiveProject: old.setActiveProject,
            updateActiveProject: old.updateActiveProject,
          }))
          setActiveWindow(() => WINDOW_NOTE_EDIT)
        }}>
        Создать
      </button>

      {notes.map((note) => (
        <div
          key={note.id}
          className='note'>
          <div className='note-info'>
            <p className='note-name'>{note.name}</p>
            {note.description && (
              <p className='note-description'>{note.description}</p>
            )}
          </div>

          <div className='note-actions'>
            <button
              className='btn btn-primary'
              onClick={() => {
                setWindowData((old) => ({
                  note,
                  activeProject: old.activeProject,
                  updateActiveProject: old.updateActiveProject,
                  setActiveProject: old.setActiveProject,
                }))
                setActiveWindow(() => WINDOW_NOTE_VIEW)
              }}>
              Просмотр
            </button>
            <button
              className='btn btn-secondary'
              onClick={() => {
                setWindowData((old) => ({
                  note,
                  activeProject: old.activeProject,
                  updateActiveProject: old.updateActiveProject,
                  setActiveProject: old.setActiveProject,
                }))
                setActiveWindow(() => WINDOW_NOTE_EDIT)
              }}>
              Редактировать
            </button>
            <button
              className='btn btn-danger'
              onClick={() => {
                deleteNote(windowData.activeProject.id, note.id).then(
                  (response) => {
                    if (response.ok) {
                      windowData.updateActiveProject()
                      updateNotes()
                    }
                  }
                )
              }}>
              Удалить
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Note
