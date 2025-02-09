import { useState, useContext } from 'react'

import { AuthContext } from '@contexts/AuthContext'

import API_URL from '@constants/API'

const Note = ({ project, note, setWindow }) => {
  const { accessToken } = useContext(AuthContext)

  const [content, setContent] = useState(() => note.content)

  const updateNote = async () => {
    try {
      const result = await fetch(
        `${API_URL}/project/${project.id}/note/${note.id}/update/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            content,
          }),
        }
      )

      const data = await result.json()

      if (result.status === 200) {
        setContent(() => data.content)
      }

      return [result.status === 200, data.detail]
    } catch (e) {
      return [false, e]
    }
  }

  return (
    <div className='block note'>
      <h2>{note.name}</h2>

      <textarea
        value={content}
        onChange={(e) => setContent(() => e.target.value)}
      />

      <div className='buttons'>
        <button onClick={() => setWindow(() => ({}))}>Закрыть</button>
        <button onClick={() => updateNote()}>Соранить</button>
      </div>
    </div>
  )
}

export default Note
