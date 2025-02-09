const ProjectTeam = ({ project, window, setWindow }) => {
  return (
    <div className='block tasks'>
      <div className='control'>
        <p>Команда</p>
        <button
          onClick={() =>
            setWindow((i) => (i.type === 'TEAM' ? {} : { type: 'TEAM' }))
          }>
          {window?.type === 'TEAM' ? 'Скрыть' : 'Показать'}
        </button>
      </div>
    </div>
  )
}

export default ProjectTeam
