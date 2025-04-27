import {
  AUTH_CONFIRM,
  AUTH_LOGIN,
  AUTH_LOGOUT,
  AUTH_RECOVERY,
  AUTH_REFRESH,
  AUTH_REGISTER,
  CREATE_PROJECT,
  CREATE_TASK,
  DELETE_PROJECT,
  DELETE_TASK,
  GET_KANBAN_TASKS,
  GET_PROJECTS,
  GET_TASKS,
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

  const fetchTask = async (projectID, id) => {
    return await get(
      GET_TASKS.replace('%project_id%', projectID) + id + '/',
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

  return {
    login,
    register,
    logout,
    refresh,
    confirmCode,
    recoveryPassword,
    fetchProjects,
    fetchProject,
    createProject,
    updateProject,
    deleteProject,
    fetchTasks,
    fetchKanbanTasks,
    fetchTask,
    createTask,
    updateTask,
    deleteTask,
  }
}

export default useApi
