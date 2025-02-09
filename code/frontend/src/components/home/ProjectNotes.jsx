const ProjectNotes = ({ window, setWindow }) => {
  return (
    <div className='block tasks'>
      <div className='control'>
        <p>Записки</p>
        <button
          onClick={() =>
            setWindow((i) => (i.type === 'NOTES' ? {} : { type: 'NOTES' }))
          }>
          {window?.type === 'NOTES' ? 'Скрыть' : 'Показать'}
        </button>
      </div>
    </div>
  )
}

export default ProjectNotes
