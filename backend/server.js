require('dotenv').config()
const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')

// Initialize Express app
const app = express()
//อ่านไฟล์ .env เพื่อรับค่าต่างๆ เช่น PORT, SECRET_TOKEN, และการตั้งค่า PocketHost
const PORT = process.env.PORT || 3000
const SECRET_TOKEN = process.env.SECRET_TOKEN
const DB_FILE = path.join(__dirname, 'notes.json')

// PocketHost configuration (optional cloud storage)
const POCKETHOST_URL = process.env.POCKETHOST_URL
const POCKETHOST_ENDPOINT = POCKETHOST_URL ? `${POCKETHOST_URL}/api/collections/notes/records` : null
const POCKETHOST_TOKEN = process.env.POCKETHOST_TOKEN
const POCKETHOST_USER_ID = parseInt(process.env.POCKETHOST_USER_ID) || 1

// Middleware
app.use(cors())
app.use(express.json())

// ============ Local JSON Storage Functions ============

// โหลดโน้ตจากไฟล์ notes.json ถ้าไฟล์ไม่มีจะคืนค่าเป็นอาร์เรย์ว่าง
function loadNotes() {
  if (!fs.existsSync(DB_FILE)) return []
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'))
}

// บันทึกโน้ตลงในไฟล์ notes.json โดยการเขียนอาร์เรย์ของโน้ตเป็น JSON
function saveNotes(notes) {
  fs.writeFileSync(DB_FILE, JSON.stringify(notes, null, 2))
}

// ============ Authentication Middleware ============

//ตรวจสอบว่าใน header ของคำขอมีค่า 'authorization' ที่ตรงกับ SECRET_TOKEN หรือไม่ ถ้าไม่ตรงจะส่งกลับสถานะ 401 Unauthorized
function requireAuth(req, res, next) {
  if (req.headers['authorization'] !== SECRET_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  next()
}

// Runtime storage mode (can be toggled without restart) — default to local
let useLocal = true

// ============ API Routes ============

app.get('/api/status', (_req, res) => {
  res.json({
    storage: useLocal ? 'local' : 'pockethost',
    url: useLocal ? null : POCKETHOST_URL,
  })
})

app.post('/api/status/toggle', requireAuth, (_req, res) => {
  if (!POCKETHOST_ENDPOINT) {
    return res.status(400).json({ error: 'PocketHost not configured' })
  }
  useLocal = !useLocal
  console.log(`[STORAGE] Switched to: ${useLocal ? 'Local JSON' : 'PocketHost'}`)
  res.json({ storage: useLocal ? 'local' : 'pockethost' })
})

//get เรียกข้อความทั้งหมดของโน้ตจาก PocketHost หรือจากไฟล์ JSON ขึ้นอยู่กับการตั้งค่า
app.get('/api/notes', async (_req, res) => {
  console.log('[GET] Fetching all notes...')
  try {
    let notes

    // Use PocketHost if configured and useLocal is false, otherwise use local JSON
    if (!useLocal) {
      const response = await fetch(`${POCKETHOST_ENDPOINT}?perPage=500&sort=-created`, {
        headers: { Authorization: `Bearer ${POCKETHOST_TOKEN}` },
      })
      const data = await response.json()
      if (!response.ok || !data.items) {
        console.error('PocketHost error:', data)
        return res.status(500).json({ error: 'PocketHost fetch failed', detail: data })
      }
      notes = data.items.map(({ id, title, content }) => ({ id, title, content }))
    } else {
      notes = loadNotes()
    }

    console.log(`[GET] Returning ${notes.length} notes`)
    res.json(notes)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notes' })
  }
})

//post /api/notes - สร้างโน้ตใหม่ โดยรับข้อมูล title และ content จาก body ของคำขอ และบันทึกโน้ตลงใน PocketHost หรือไฟล์ JSON ขึ้นอยู่กับการตั้งค่า
app.post('/api/notes', requireAuth, async (req, res) => {
  const { title, content } = req.body

  try {
    let newNote

    // Create note in PocketHost or local storage
    if (!useLocal) {
      const response = await fetch(POCKETHOST_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${POCKETHOST_TOKEN}`,
        },
        body: JSON.stringify({ title, content, user_id: POCKETHOST_USER_ID }),
      })

      const responseData = await response.json()

      if (!response.ok) {
        return res.status(response.status).json({
          error: responseData.message || 'PocketHost error',
        })
      }

      newNote = {
        id: responseData.id,
        title: responseData.title,
        content: responseData.content,
      }
    } else {
      // Create note in local storage
      newNote = { id: Date.now(), title, content }
      const notes = loadNotes()
      notes.push(newNote)
      saveNotes(notes)
    }

    console.log(`[CREATE] Note created — id: ${newNote.id}, title: "${newNote.title}"`)
    res.status(201).json(newNote)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create note' })
  }
})

// DELETE /api/notes/:id - Delete a note (requires auth)
app.delete('/api/notes/:id', requireAuth, async (req, res) => {
  const { id } = req.params

  try {
    // Delete from PocketHost or local storage
    if (!useLocal) {
      const response = await fetch(`${POCKETHOST_ENDPOINT}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${POCKETHOST_TOKEN}` },
      })

      if (response.status === 404) {
        return res.status(404).json({ error: 'Note not found' })
      }
    } else {
      // Delete from local storage ตรงกับการค้นหาโน้ตที่มี id ตรงกับพารามิเตอร์ id ที่ส่งมา ถ้าไม่พบจะส่งกลับสถานะ 404 Not Found ถ้าพบจะลบโน้ตออกจากอาร์เรย์และบันทึกอาร์เรย์ใหม่ลงในไฟล์ JSON
      const notes = loadNotes()
      const noteIndex = notes.findIndex((note) => note.id === parseInt(id))

      if (noteIndex === -1) {
        return res.status(404).json({ error: 'Note not found' })
      }

      notes.splice(noteIndex, 1)
      saveNotes(notes)
    }

    console.log(`[DELETE] Note deleted — id: ${id}`)
    res.json({ message: 'Note deleted' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete note' })
  }
})

// ============ Start Server ============
//เริ่มต้นเซิร์ฟเวอร์และแสดงข้อความในคอนโซลว่าเซิร์ฟเวอร์กำลังทำงานอยู่ที่ URL ไหน และใช้การเก็บข้อมูลแบบไหน (PocketHost หรือ JSON file)
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
  console.log(`Storage: ${POCKETHOST_ENDPOINT ? `PocketHost (${POCKETHOST_URL})` : `JSON file (${DB_FILE})`}`)
})
