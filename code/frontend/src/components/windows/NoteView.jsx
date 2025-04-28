import useApi from '@hooks/useApi'
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'

import { COMPONENTS } from '@constants/MARKDOWN'
import { WINDOW_NOTE } from '@constants/WINDOW'

import 'highlight.js/styles/base16/github.css'

import AngleDown from '@images/angle-down.svg'
import AngleUp from '@images/angle-up.svg'
import FloppyDisk from '@images/floppy-disk.svg'
import Pen from '@images/pen.svg'
import Trash from '@images/trash.svg'

const NoteView = ({ setActiveWindow, windowData, setWindowData }) => {
  const {
    fetchNoteBlocks,
    createNoteBlock,
    orderNoteBlock,
    deleteNoteBlock,
    updateNoteBlock,
  } = useApi()

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

  const renderCreateButtons = () => {
    return (
      <div className='create-buttons'>
        <button
          className='btn btn-success'
          onClick={() => {
            const formData = new FormData()
            formData.append('block_type', 'TEXT')
            createNoteBlock(
              windowData.activeProject.id,
              note.id,
              formData
            ).then((response) => {
              if (response.ok)
                setBlocks((old) => [...old, response.data.note_block])
            })
          }}>
          + Текст
        </button>

        <button
          className='btn btn-success'
          onClick={() => {
            const formData = new FormData()
            formData.append('block_type', 'IMAGE')
            createNoteBlock(
              windowData.activeProject.id,
              note.id,
              formData
            ).then((response) => {
              if (response.ok)
                setBlocks((old) => [...old, response.data.note_block])
            })
          }}>
          + Картинка
        </button>
      </div>
    )
  }

  const renderButtons = (reversed) => {
    return (
      <>
        {reversed && renderCreateButtons()}

        <button
          className='btn btn-primary'
          onClick={() => {
            setActiveWindow(() => WINDOW_NOTE)
          }}>
          Назад
        </button>

        {!reversed && renderCreateButtons()}
      </>
    )
  }

  const renderNoteBlockEdit = (block) => {
    return (
      <>
        <button
          className='btn btn-secondary'
          onClick={() =>
            orderNoteBlock(
              windowData.activeProject.id,
              note.id,
              block.id,
              0
            ).then((response) => {
              if (response.ok) setBlocks(() => response.data.note_blocks)
            })
          }>
          <img src={AngleUp} />
        </button>
        <button
          className='btn btn-secondary'
          onClick={() =>
            orderNoteBlock(
              windowData.activeProject.id,
              note.id,
              block.id,
              1
            ).then((response) => {
              if (response.ok) setBlocks(() => response.data.note_blocks)
            })
          }>
          <img src={AngleDown} />
        </button>
        <button
          className={'btn ' + (block.isEdit ? 'btn-success' : 'btn-primary')}
          onClick={() => {
            if (block.isEdit) {
              setBlocks((old) =>
                old.map((i) =>
                  i.id === block.id ? { ...i, isEdit: false } : i
                )
              )

              const formData = new FormData()
              formData.append('text', block.text)
              formData.append('image', block.imageUploaded)
              updateNoteBlock(
                windowData.activeProject.id,
                note.id,
                block.id,
                formData
              ).then((response) => {
                if (response.ok)
                  setBlocks((old) =>
                    old.map((i) =>
                      i.id === block.id ? response.data.note_block : i
                    )
                  )
              })
            } else {
              setBlocks((old) =>
                old.map((i) => (i.id === block.id ? { ...i, isEdit: true } : i))
              )
            }
          }}>
          <img src={block.isEdit ? FloppyDisk : Pen} />
        </button>
        <button
          className='btn btn-danger'
          onClick={() => {
            deleteNoteBlock(
              windowData.activeProject.id,
              note.id,
              block.id
            ).then((response) => {
              if (response.ok)
                setBlocks((old) => old.filter((i) => i.id !== block.id))
            })
          }}>
          <img src={Trash} />
        </button>
      </>
    )
  }

  return (
    <div className='window-note-view'>
      <h3>Просмотр записки</h3>

      {renderButtons()}

      {blocks.map((block) => {
        if (block.block_type === 'IMAGE') {
          return (
            <div
              className='note-view-image'
              key={block.id}>
              {block.image || block.imageUploaded ? (
                <img
                  src={block.image ?? URL.createObjectURL(block.imageUploaded)}
                />
              ) : (
                <p>Загрузите изображение</p>
              )}

              <div className='note-block-edit'>
                <div className='buttons'>{renderNoteBlockEdit(block)}</div>

                {block.isEdit && (
                  <>
                    <input
                      className='form-control'
                      type='file'
                      onChange={(e) =>
                        setBlocks((old) =>
                          old.map((i) =>
                            i.id === block.id
                              ? {
                                  ...i,
                                  imageUploaded: e.target.files
                                    ? e.target.files[0]
                                    : null,
                                }
                              : i
                          )
                        )
                      }
                    />
                  </>
                )}
              </div>
            </div>
          )
        }

        if (block.block_type === 'TEXT') {
          return (
            <div
              className='note-view-text'
              key={block.id}>
              {block.text ? (
                <ReactMarkdown
                  children={block.text}
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                  components={COMPONENTS}
                />
              ) : (
                <p className='text-center'>Введите текст</p>
              )}

              <div className='note-block-edit'>
                <div className='buttons'>{renderNoteBlockEdit(block)}</div>

                {block.isEdit && (
                  <>
                    <textarea
                      className='form-control'
                      rows={10}
                      value={block.text}
                      onChange={(e) =>
                        setBlocks((old) =>
                          old.map((i) =>
                            i.id === block.id
                              ? { ...i, text: e.target.value }
                              : i
                          )
                        )
                      }
                    />
                  </>
                )}
              </div>
            </div>
          )
        }

        return <div key={block.id}></div>
      })}

      {renderButtons(true)}
    </div>
  )
}

export default NoteView
