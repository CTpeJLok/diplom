const ProjectKanban = ({ window, setWindow }) => {
  return (
    <div className='block kanban'>
      <p>Канбан</p>
      <button
        onClick={() =>
          setWindow((i) => (i.type === 'KANBAN' ? {} : { type: 'KANBAN' }))
        }>
        {window?.type === 'KANBAN' ? 'Закрыть' : 'Открыть'}
      </button>
    </div>
  )
}

export default ProjectKanban
