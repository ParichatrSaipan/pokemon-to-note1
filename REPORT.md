# Report — Pokèmon to Note

**Parichatr Tiangsombun — 66010464**

## 1. Where JavaScript Executes: Browser vs Node.js

JavaScript runs in two different environments in this project, but both use the **V8 engine** — the same engine that actually reads and executes JavaScript code.

**Browser (Frontend)**
The browser has its own JavaScript runtime built on V8. When a user opens the app, the browser downloads the JavaScript bundle and V8 executes it. The browser runtime gives JavaScript access to browser-specific APIs such as `document`, `window`, `localStorage`, and `fetch`. This is where React runs — it manages the UI and sends HTTP requests to the backend.

**Node.js (Backend)**
Node.js is a JavaScript runtime built on the same V8 engine, but it runs on the server — not in a browser. It does not have `document` or `window`. Instead, it provides server-specific APIs such as `fs` (file system), `http`, and access to environment variables via `process.env`. In this project, `server.js` runs on Node.js to handle API requests, read/write `notes.json`, and communicate with PocketHost.

**Summary:** Same V8 engine, different runtimes, different available APIs.

---

## 2. How the Frontend Updates the Screen: Virtual DOM

This project uses **React**, which updates the screen using a **Virtual DOM** — not by directly manipulating the real DOM.

**How it works:**
1. React keeps a lightweight copy of the DOM in memory called the Virtual DOM.
2. When state changes (e.g., a new note is added), React re-renders the affected components and creates a new Virtual DOM tree.
3. React then **diffs** the new tree against the previous one to find exactly what changed.
4. Only the changed parts are applied to the real DOM — this is called **reconciliation**.

**Example in this project:**
When `addNote()` runs successfully, the `useNotes` hook calls `setNotes((prev) => [noteWithId, ...prev])`. React detects that the notes array changed, re-renders `NoteList`, and only adds the new card to the DOM — without reloading the page or re-rendering cards that did not change.

**Contrast with Vanilla JS (direct DOM manipulation):**
In vanilla JavaScript, the developer manually calls `document.createElement()`, `appendChild()`, or `innerHTML` to update the screen. This is more error-prone and less efficient for complex UIs.

---

## 3. HTTP/HTTPS Request-Response Cycle — Submitting a Note

**Step-by-step cycle when the user clicks Save to create a note:**

1. **User action** — The user fills in the title and content fields and clicks the save button in `NoteForm.jsx`.
2. **JavaScript sends an HTTP request** — The `createNote()` function in `api.js` calls `fetch()`, which sends a `POST` request to `http://localhost:3000/api/notes` (local) or `https://pokemon-to-note-api.up.railway.app/api/notes` (production). The request includes:
   - **Method:** `POST`
   - **Headers:** `Content-Type: application/json`, `Authorization: <SECRET_TOKEN>`
   - **Body:** `{ "title": "...", "content": "..." }` as JSON
3. **Server receives the request** — Express in `server.js` matches the route `POST /api/notes`. It checks the `Authorization` header. If the token is wrong, it returns `401 Unauthorized`. If correct, it continues.
4. **Server processes and responds** — The server creates a new note object with `id: Date.now()`, saves it to `notes.json` (or PocketHost), and sends back a `201 Created` response with the new note as JSON.
5. **Frontend receives the response** — `fetch()` resolves with the response. The new note is added to the React state and the card appears on screen without a page reload.

**Why HTTPS matters in production:**

HTTP sends all data as plain text. If the app runs over HTTP in production, anyone on the same network (e.g., coffee shop Wi-Fi) can intercept the request and read the `Authorization` header — stealing the `SECRET_TOKEN`. With the token, they can create or delete notes freely.

HTTPS encrypts the entire request using TLS before it leaves the browser. The token, headers, and body are all unreadable to anyone intercepting the traffic. This is why the deployed backend on Railway and frontend on Vercel both use HTTPS automatically.

---

## 4. Why SECRET_TOKEN Lives in Backend `.env` and Not in Frontend Code

The `SECRET_TOKEN` is used to authorize write operations (POST and DELETE). If it were placed in the frontend code, it would be exposed to anyone who opens the browser's DevTools and inspects the JavaScript bundle — because all frontend code is downloaded and visible to the user.

**What happens if the token is in the frontend:**
- Any user can open DevTools → Sources → find the token in the JavaScript file
- They can then use it to call the API directly from any tool (e.g., `curl`, Postman) and delete all notes or spam the database

**The correct approach (used in this project):**
- `SECRET_TOKEN` is stored in `backend/.env` — a file that only exists on the server and is never committed to Git (excluded via `.gitignore`)
- The frontend hardcodes the token in `api.js` only because this is a course assignment with a single known user. In a real production app, the token would never appear in frontend code — instead, users would authenticate via a login system and receive a short-lived session token
- The backend `.env` is the only place the real secret lives. Even if someone reads the frontend source code, they cannot access the file system of the server

**Environment variables also allow changing the token without editing code** — the server reads `process.env.SECRET_TOKEN` at startup, so rotating the token only requires updating `.env` and restarting the server, with no code changes needed.
