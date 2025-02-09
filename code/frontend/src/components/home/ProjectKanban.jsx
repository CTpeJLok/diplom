const ProjectKanban = ({ window, setWindow }) => {
  return (
    <div className='block kanban'>
      <p>Канбан</p>
      <button
        onClick={() =>
          setWindow((i) => (i.type === 'KANBAN' ? {} : { type: 'KANBAN' }))
        }>
        {window?.type === 'KANBAN' ? 'Скрыть' : 'Показать'}
      </button>
    </div>
  )
}

export default ProjectKanban
