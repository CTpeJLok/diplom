const ProjectTasks = ({ project, setWindow }) => {
  return (
    <div className='block tasks'>
      <div className='control'>
        <p>Задачи</p>
        <button
          onClick={() =>
            setWindow((i) => (i.type === 'TASKS' ? {} : { type: 'TASKS' }))
          }>
          Показать
        </button>
      </div>
    </div>
  )
}

export default ProjectTasks
