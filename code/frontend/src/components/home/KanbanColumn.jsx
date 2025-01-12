import KanbanItem from '@components/home/KanbanItem'

const KanbanColumn = ({ project, name, tasks, setKanban, type }) => {
  return (
    <>
      <div className='kanban-column'>
        <p className='title'>{name}</p>
        <div className='kanban-content'>
          {tasks?.map((task) => (
            <KanbanItem
              key={task.id}
              task={task}
              project={project}
              setKanban={setKanban}
              type={type}
            />
          ))}
        </div>
      </div>
    </>
  )
}

export default KanbanColumn
