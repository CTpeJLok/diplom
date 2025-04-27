import useApi from '@hooks/useApi'
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'

import { COMPONENTS } from '@constants/MARKDOWN'
import { WINDOW_NOTE } from '@constants/WINDOW'

// import 'highlight.js/styles/base16/github.css'
import '@styles/github.css'

const NoteView = ({ setActiveWindow, windowData, setWindowData }) => {
  const { fetchNoteBlocks } = useApi()

  const [note, setNote] = useState(windowData.note)
  const [blocks, setBlocks] = useState([])

  const updateBlocks = () => {
    fetchNoteBlocks(windowData.activeProject.id, note.id).then((response) => {
      if (response.ok) setBlocks(() => response.data.note_blocks)
    })
  }

  useEffect(() => {
    updateBlocks()
  }, [])

  return (
    <div className='window-note-view'>
      <h3>Просмотр записки</h3>

      <button
        className='btn btn-primary'
        onClick={() => {
          setActiveWindow(() => WINDOW_NOTE)
        }}>
        Назад
      </button>

      {blocks.map((block) => {
        if (block.block_type === 'IMAGE') {
          return (
            <div
              className='note-view-image'
              key={block.id}>
              <img src={block.image} />
            </div>
          )
        }

        if (block.block_type === 'TEXT') {
          return (
            <div
              className='note-view-text'
              key={block.id}>
              <ReactMarkdown
                children={block.text}
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={COMPONENTS}
              />
            </div>
          )
        }

        return <div key={block.id}></div>
      })}

      <button
        className='btn btn-primary'
        onClick={() => {
          setActiveWindow(() => WINDOW_NOTE)
        }}>
        Назад
      </button>
    </div>
  )
}

export default NoteView
