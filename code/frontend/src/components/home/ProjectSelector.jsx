const ProjectSelector = ({ project, setWindow }) => {
  return (
    <div className='block project-selector'>
      <p className='project-name'>
        Активный проект: {project ? project.name : '-'}
      </p>
      <button
        className='selector-open'
        onClick={() =>
          setWindow((i) =>
            i.type === 'PROJECT_SELECTOR'
              ? {}
              : {
                  type: 'PROJECT_SELECTOR',
                }
          )
        }>
        Сменить
      </button>
    </div>
  )
}

export default ProjectSelector
