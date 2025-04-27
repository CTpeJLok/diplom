import {
  AUTH_CONFIRM,
  AUTH_LOGIN,
  AUTH_LOGOUT,
  AUTH_RECOVERY,
  AUTH_REFRESH,
  AUTH_REGISTER,
  CREATE_NOTE,
  CREATE_NOTE_BLOCK,
  CREATE_PROJECT,
  CREATE_TASK,
  DELETE_NOTE,
  DELETE_NOTE_BLOCK,
  DELETE_PROJECT,
  DELETE_TASK,
  GET_KANBAN_TASKS,
  GET_NOTE_BLOCKS,
  GET_NOTES,
  GET_PROJECTS,
  GET_TASKS,
  UPDATE_NOTE,
  UPDATE_NOTE_BLOCK,
  UPDATE_PROJECT,
  UPDATE_TASK,
} from '@constants/API'
import useRequest from '@hooks/useRequest'
import useToken from '@hooks/useToken'

const useApi = () => {
  const { get, post, postFormData } = useRequest()
  const token = useToken()

  const headersWithToken = {
    Authorization: `Bearer ${token.access}`,
  }

  // AUTH
  const login = async (authData) => {
    return await post(AUTH_LOGIN, authData)
  }

  const register = async (authData) => {
    return await post(AUTH_REGISTER, authData)
  }

  const logout = async (refreshTokenDict) => {
    return await post(AUTH_LOGOUT, refreshTokenDict)
  }

  const refresh = async (refreshTokenDict) => {
    return await post(AUTH_REFRESH, refreshTokenDict)
  }

  const confirmCode = async (authData) => {
    return await post(AUTH_CONFIRM, authData)
  }

  const recoveryPassword = async (authData) => {
    return await post(AUTH_RECOVERY, authData)
  }

  // PROJECT
  const fetchProjects = async () => {
    return await get(GET_PROJECTS, headersWithToken)
  }

  const fetchProject = async (id) => {
    return await get(GET_PROJECTS + id + '/', headersWithToken)
  }

  const createProject = async (projectData) => {
    return await post(CREATE_PROJECT, projectData, headersWithToken)
  }

  const updateProject = async (id, projectData) => {
    return await post(UPDATE_PROJECT + id + '/', projectData, headersWithToken)
  }

  const deleteProject = async (id) => {
    return await get(DELETE_PROJECT + id + '/', headersWithToken)
  }

  // TASK
  const fetchTasks = async (projectID) => {
    return await get(
      GET_TASKS.replace('%project_id%', projectID),
      headersWithToken
    )
  }

  const fetchKanbanTasks = async (projectID) => {
    return await get(
      GET_KANBAN_TASKS.replace('%project_id%', projectID),
      headersWithToken
    )
  }

  const createTask = async (projectID, taskData) => {
    return await post(
      CREATE_TASK.replace('%project_id%', projectID),
      taskData,
      headersWithToken
    )
  }

  const updateTask = async (projectID, id, taskData) => {
    return await post(
      UPDATE_TASK.replace('%project_id%', projectID) + id + '/',
      taskData,
      headersWithToken
    )
  }

  const deleteTask = async (projectID, id) => {
    return await get(
      DELETE_TASK.replace('%project_id%', projectID) + id + '/',
      headersWithToken
    )
  }

  // NOTE
  const fetchNotes = async (projectID) => {
    return await get(
      GET_NOTES.replace('%project_id%', projectID),
      headersWithToken
    )
  }

  const createNote = async (projectID, noteData) => {
    return await post(
      CREATE_NOTE.replace('%project_id%', projectID),
      noteData,
      headersWithToken
    )
  }

  const updateNote = async (projectID, id, noteData) => {
    return await post(
      UPDATE_NOTE.replace('%project_id%', projectID) + id + '/',
      noteData,
      headersWithToken
    )
  }

  const deleteNote = async (projectID, id) => {
    return await get(
      DELETE_NOTE.replace('%project_id%', projectID) + id + '/',
      headersWithToken
    )
  }

  // NOTE BLOCK
  const fetchNoteBlocks = async (projectID, noteID) => {
    return await get(
      GET_NOTE_BLOCKS.replace('%project_id%', projectID).replace(
        '%note_id%',
        noteID
      ),
      headersWithToken
    )
  }

  const createNoteBlock = async (projectID, noteID, noteBlockData) => {
    return await postFormData(
      CREATE_NOTE_BLOCK.replace('%project_id%', projectID).replace(
        '%note_id%',
        noteID
      ),
      noteBlockData,
      headersWithToken
    )
  }

  const updateNoteBlock = async (projectID, noteID, id, noteBlockData) => {
    return await postFormData(
      UPDATE_NOTE_BLOCK.replace('%project_id%', projectID).replace(
        '%note_id%',
        noteID
      ) +
        id +
        '/',
      noteBlockData,
      headersWithToken
    )
  }

  const deleteNoteBlock = async (projectID, noteID, id) => {
    return await get(
      DELETE_NOTE_BLOCK.replace('%project_id%', projectID).replace(
        '%note_id%',
        noteID
      ) +
        id +
        '/',
      headersWithToken
    )
  }

  return {
    // auth
    login,
    register,
    logout,
    refresh,
    confirmCode,
    recoveryPassword,
    // projects
    fetchProjects,
    fetchProject,
    createProject,
    updateProject,
    deleteProject,
    // tasks
    fetchTasks,
    fetchKanbanTasks,
    createTask,
    updateTask,
    deleteTask,
    // notes
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
    // note blocks
    fetchNoteBlocks,
    createNoteBlock,
    updateNoteBlock,
    deleteNoteBlock,
  }
}

export default useApi
