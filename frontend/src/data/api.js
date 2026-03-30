// API Configuration
// Local development:
const API_BASE = 'http://localhost:3000'

// Production: Railway backend (commented out):
// const API_BASE = 'https://secure-note-app-api.up.railway.app'

const TOKEN = 'mysecrettoken'
const NOTES_URL = `${API_BASE}/api/notes`

// Fetch all notes from backend
export async function getNotes() {
  console.log('GET /api/notes')
  const response = await fetch(NOTES_URL)

  if (!response.ok) throw new Error('Failed to fetch notes')

  const notes = await response.json()
  console.log('Notes fetched:', notes)
  return notes
}

// Create a new note on backend
export async function createNote({ title, content }) {
  console.log('POST /api/notes', { title, content })

  const response = await fetch(NOTES_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: TOKEN,
    },
    body: JSON.stringify({ title, content }),
  })

  if (response.status === 401) throw new Error('Unauthorized')
  if (!response.ok) throw new Error('Failed to create note')

  const newNote = await response.json()
  console.log('Note created:', newNote)
  return newNote
}

// Delete a note from backend
export async function deleteNote(id) {
  console.log('DELETE /api/notes/' + id)

  const response = await fetch(`${NOTES_URL}/${id}`, {
    method: 'DELETE',
    headers: { Authorization: TOKEN },
  })

  if (response.status === 401) throw new Error('Unauthorized')
  if (response.status === 404) throw new Error('Note not found')
  if (!response.ok) throw new Error('Failed to delete note')

  console.log('Note deleted:', id)
}
