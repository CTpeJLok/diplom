export const API_URL = 'https://diplom.by-byte.ru/api/'

export const AUTH_LOGIN = API_URL + 'auth/login/'
export const AUTH_REGISTER = API_URL + 'auth/register/'
export const AUTH_LOGOUT = API_URL + 'auth/logout/'
export const AUTH_REFRESH = API_URL + 'auth/refresh/'
export const AUTH_CONFIRM = API_URL + 'auth/confirm/'
export const AUTH_RECOVERY = API_URL + 'auth/recovery/'

export const GET_PROJECTS = API_URL + 'project/'
export const CREATE_PROJECT = API_URL + 'project/create/'
export const UPDATE_PROJECT = API_URL + 'project/update/'
export const DELETE_PROJECT = API_URL + 'project/delete/'

export const GET_PROJECT_USERS = API_URL + 'project/users/'
export const INVITE_PROJECT_USER = API_URL + 'project/invite/'
export const REJECT_INVITE_PROJECT_USER =
  API_URL + 'project/invite/%project_id%/reject/'
export const RESEND_INVITE_PROJECT_USER =
  API_URL + 'project/invite/%project_id%/resend/'

export const GET_TASKS = API_URL + 'project/%project_id%/task/'
export const GET_KANBAN_TASKS = API_URL + 'project/%project_id%/task/kanban/'
export const CREATE_TASK = API_URL + 'project/%project_id%/task/create/'
export const UPDATE_TASK = API_URL + 'project/%project_id%/task/update/'
export const DELETE_TASK = API_URL + 'project/%project_id%/task/delete/'

export const GET_NOTES = API_URL + 'project/%project_id%/note/'
export const CREATE_NOTE = API_URL + 'project/%project_id%/note/create/'
export const UPDATE_NOTE = API_URL + 'project/%project_id%/note/update/'
export const DELETE_NOTE = API_URL + 'project/%project_id%/note/delete/'

export const GET_NOTE_BLOCKS =
  API_URL + 'project/%project_id%/note/blocks/%note_id%/'
export const CREATE_NOTE_BLOCK =
  API_URL + 'project/%project_id%/note/blocks/%note_id%/create/'
export const UPDATE_NOTE_BLOCK =
  API_URL + 'project/%project_id%/note/blocks/%note_id%/update/'
export const DELETE_NOTE_BLOCK =
  API_URL + 'project/%project_id%/note/blocks/%note_id%/delete/'
export const ORDER_NOTE_BLOCK =
  API_URL + 'project/%project_id%/note/blocks/%note_id%/order/'
