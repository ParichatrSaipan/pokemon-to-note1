# Pokèmon to Note

Name & Student ID: **Parichatr Tiangsombun — 66010464**

A full-stack note-taking app with a Pokèmon theme. Each note is assigned a random Pokèmon. Supports local JSON storage or cloud storage via PocketHost — switchable at runtime without restarting the server.

![Demo](./images/demo.gif)

## Table of Contents

- [Project Structure](#project-structure)
- [Backend](#backend)
- [Frontend](#frontend)
- [Deployment](#deployment)
- [API Endpoints](#api-endpoints)
- [Report](./REPORT.md)

---

## Project Structure

```
/pokemon-to-note
  /backend
    server.js       # Express server — all routes in one file
    notes.json      # Local notes storage (auto-created)
    .env            # Environment variables (never commit)
    package.json
  /frontend
    src/
      components/
        NoteForm.jsx      # Create note form + Pokèmon reveal popup
        NoteDetail.jsx    # Note detail modal
        NoteList.jsx      # Notes grid with loading/empty states
      pages/
        NotesPage.jsx     # Main page — assembles all components
      data/
        api.js            # Fetch functions (GET, POST, DELETE + console logs)
        useNotes.js       # Custom hook — notes state + storage mode
        pokemon.js        # Pokèmon data and card assets
      config/
        configureAPI.js   # API base URL (switches dev/production automatically)
    index.css             # Tailwind base styles
  README.md
  REPORT.md
```

---

## Backend

### Install & Run

```bash
cd backend
npm install
npm run dev       # nodemon (ignores notes.json changes)
# or
node server.js    # plain node
```

Server starts on `http://localhost:3000`

### Environment Variables

Create `backend/.env`:

```env
PORT=3000          # omit this if deploying to Railway (Railway injects PORT automatically)
SECRET_TOKEN=your_secret_here
```

**Optional — PocketHost cloud storage:**

```env
POCKETHOST_URL=https://your-instance.pockethost.io
POCKETHOST_USER_ID=1
POCKETHOST_TOKEN=your_token
```

If `POCKETHOST_URL` is set, the server starts in PocketHost mode. Otherwise it uses local `notes.json`. The mode can be toggled at runtime via `POST /api/status/toggle` without restarting, or by clicking the storage badge on the main page of the frontend.

![Status](./images/status.gif)

---

## Frontend

### Install & Run

```bash
cd frontend
npm install
npm run dev       # starts on http://localhost:5173
```

### Configuration

The API URL is managed in `src/config/configureAPI.js`. It switches automatically based on the build mode:

| Mode | URL |
|------|-----|
| `npm run dev` (development) | `http://localhost:3000` |
| `npm run build` (production) | `https://pokemon-to-note-api.up.railway.app` |

Update the `production` URL in `configureAPI.js` if you deploy the backend elsewhere.

---

## Deployment

| | URL |
|---|---|
| Backend (Railway) | https://pokemon-to-note-api.up.railway.app |
| Frontend (Vercel) | https://pokemon-to-note.vercel.app |

---

## API Endpoints

| Method | Path | Auth | Status | Description |
|--------|------|------|--------|-------------|
| GET | `/api/notes` | No | 200 OK | Get all notes |
| POST | `/api/notes` | Yes | 201 Created | Create note `{ title, content }` |
| DELETE | `/api/notes/:id` | Yes | 200 OK | Delete note by ID |
| GET | `/api/status` | No | 200 OK | Get current storage mode |
| POST | `/api/status/toggle` | Yes | 200 OK | Switch between local and PocketHost |

**Authorization:** Send `Authorization: your_secret_here` header on POST and DELETE requests.  
Returns `401 Unauthorized` if token is wrong, `404 Not Found` if note does not exist.

**Example:**
```bash
# Get all notes
curl http://localhost:3000/api/notes

# Create a note
curl -X POST http://localhost:3000/api/notes \
  -H "Authorization: your_secret_here" \
  -H "Content-Type: application/json" \
  -d '{"title":"My Note","content":"Hello world"}'

# Delete a note
curl -X DELETE http://localhost:3000/api/notes/123 \
  -H "Authorization: your_secret_here"
```
