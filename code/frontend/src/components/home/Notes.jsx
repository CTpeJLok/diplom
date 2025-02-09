import { useState, useEffect, useContext } from 'react'

import { AuthContext } from '@contexts/AuthContext'

import API_URL from '@constants/API'

const Notes = ({ project, setWindow }) => {
  const { accessToken } = useContext(AuthContext)

  const [notes, setNotes] = useState([])

  const [newNote, setNewNote] = useState({
    name: '',
  })

  const [error, setError] = useState('')

  const createNote = async (name) => {
    try {
      const result = await fetch(
        `${API_URL}/project/${project.id}/note/create/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            name,
          }),
        }
      )

      const data = await result.json()

      if (result.status === 200) {
        setNotes(() => data.data)
      }

      return [result.status === 200, data.detail]
    } catch (e) {
      return [false, e]
    }
  }

  const getNotes = async () => {
    try {
      const result = await fetch(`${API_URL}/project/${project.id}/note/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      })

      const data = await result.json()

      if (result.status === 200) {
        setNotes(() => data.data)
      }

      return [result.status === 200, data.detail]
    } catch (e) {
      return [false, e]
    }
  }

  useEffect(() => {
    if (project.id) getNotes()
  }, [])

  return (
    <>
      <div className='block create-task'>
        <h2>Добавить записку</h2>

        <div className='input-group'>
          <label htmlFor='name'>Название</label>
          <input
            type='text'
            name='name'
            id='name'
            value={newNote.name}
            onChange={(e) =>
              setNewNote({
                ...newNote,
                name: e.target.value,
              })
            }
          />
        </div>

        {error && <p className='error'>{error}</p>}

        <button
          onClick={async () => {
            setError(() => '')

            const result = await createNote(newNote.name)

            if (result[0]) setNewNote(() => ({ name: '' }))
            else setError(() => result[1])
          }}>
          Создать
        </button>
      </div>

      <div className='block tasks'>
        {notes.length === 0 ? (
          <h2>Нет записок</h2>
        ) : (
          <>
            <h2>Всего записок: {notes.length}</h2>
            <div className='task'>
              <div className='name'>
                <p>Название</p>
              </div>

              <div className='dates'>
                <p>Создано</p>
                <p>Изменено</p>
              </div>

              <p>Открыть</p>
            </div>
          </>
        )}

        {notes.map((note) => (
          <div
            className='task'
            key={note.id}>
            <div className='name'>
              <p>{note.name}</p>
            </div>

            <div className='dates'>
              <p>{note.createdAt}</p>
              <p>{note.updatedAt}</p>
            </div>

            <div className='actions'>
              <button
                onClick={() =>
                  setWindow((_) => ({ type: 'NOTE', note: note }))
                }>
                &gt;
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default Notes
