const API_BASE = 'http://localhost:3000'
const TOKEN = 'mysecrettoken'
const NOTES_URL = `${API_BASE}/api/notes`

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
}

const AUTH_HEADERS = {
  ...DEFAULT_HEADERS,
  Authorization: TOKEN,
}

function handleApiError(response) {
  if (response.status === 401) {
    console.error(`[ERROR] 401 Unauthorized — invalid token`)
    throw new Error('401 Unauthorized: Invalid token')
  }
  if (response.status === 404) {
    console.error(`[ERROR] 404 Not Found`)
    throw new Error('404 Not Found')
  }
  if (!response.ok) {
    console.error(`[ERROR] ${response.status} — unexpected error`)
    throw new Error(`${response.status} Error`)
  }
}

export async function getNotes() {
  try {
    const response = await fetch(NOTES_URL)
    handleApiError(response)
    const data = await response.json()
    console.log(`[GET] 200 OK — fetched ${data.length} notes`)
    return data
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch notes')
  }
}

export async function createNote({ title, content }) {
  if (!title?.trim() || !content?.trim()) {
    throw new Error('Title and content are required')
  }

  try {
    const response = await fetch(NOTES_URL, {
      method: 'POST',
      headers: AUTH_HEADERS,
      body: JSON.stringify({ title, content }),
    })

    handleApiError(response)
    const data = await response.json()
    console.log(`[POST] 201 Created — id: ${data.id}, title: "${data.title}"`)
    return data
  } catch (error) {
    throw new Error(error.message || 'Failed to create note')
  }
}

export async function toggleStorage() {
  try {
    const response = await fetch(`${API_BASE}/api/status/toggle`, {
      method: 'POST',
      headers: AUTH_HEADERS,
    })
    const data = await response.json()
    console.log(`[TOGGLE] Storage switched to: ${data.storage}`)
    return data
  } catch {
    return { storage: 'unknown' }
  }
}

export async function getStatus() {
  try {
    const response = await fetch(`${API_BASE}/api/status`)
    return await response.json()
  } catch {
    return { storage: 'unknown' }
  }
}

export async function deleteNote(id) {
  if (!id) {
    throw new Error('Note ID is required')
  }

  try {
    const response = await fetch(`${NOTES_URL}/${id}`, {
      method: 'DELETE',
      headers: AUTH_HEADERS,
    })

    handleApiError(response)
    console.log(`[DELETE] 200 OK — note id: ${id} deleted`)
  } catch (error) {
    throw new Error(error.message || 'Failed to delete note')
  }
}
