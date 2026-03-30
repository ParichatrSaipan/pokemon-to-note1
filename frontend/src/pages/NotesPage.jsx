import { useState, useMemo } from 'react'
import { toast } from 'sonner'
import { useNotes } from '../data/useNotes'
import NoteForm from '../components/NoteForm'
import NoteDetail from '../components/NoteDetail'
import NoteList from '../components/NoteList'
import GroupImg from '../assets/Group.png'
import AddButtonImg from '../assets/button.png'

export default function NotesPage() {
  const { notes, fetching, saving, error, addNote, removeNote } = useNotes()
  const [selectedNote, setSelectedNote] = useState(null)
  const [showForm, setShowForm] = useState(false)

  // Generate corner positions for decorative Group.png (memoized so they don't change on re-render)
  const decorations = useMemo(() => {
    return [
      { id: 0, top: '-5%', left: '-5%', size: 250 },
      { id: 1, top: 'auto', left: 'auto', bottom: '-10%', right: '-10%', size: 280 },
    ]
  }, [])

  async function handleAdd(noteData) {
    try {
      await addNote(noteData)
      toast.success('Note added!')
    } catch {}
  }

  async function handleDelete(id) {
    try {
      await removeNote(id)
      if (selectedNote?.id === id) setSelectedNote(null)
      toast.error('Note deleted!')
    } catch {}
  }

  return (
    <main className="min-h-screen bg-black px-4 py-8 sm:px-6 sm:py-12 relative overflow-hidden">
      {/* Decorative Group.png background - corners only */}
      {decorations.map((decoration) => (
        <img
          key={decoration.id}
          src={GroupImg}
          alt=""
          className="absolute pointer-events-none opacity-80"
          style={{
            top: decoration.top,
            left: decoration.left,
            bottom: decoration.bottom,
            right: decoration.right,
            width: `${decoration.size}px`,
            height: `${decoration.size}px`,
            objectFit: 'contain',
          }}
        />
      ))}

      {/* Header with add button image */}
      <div className="max-w-6xl mx-auto mb-12 flex justify-between items-start gap-6">
        <div>
          <h1 className="text-gray-400 text-lg font-light">Select Your</h1>
          <h2 className="text-white text-4xl sm:text-5xl font-bold">Pokèmon to note</h2>
        </div>
        <button
          onClick={() => setShowForm(true)}
          aria-label="Add note"
          className="shrink-0 mt-2 transition-transform hover:scale-105"
        >
          <img
            src={AddButtonImg}
            alt=""
            className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
          />
        </button>
      </div>

      {error && (
        <div className="max-w-6xl mx-auto mb-6 bg-red-950 border border-red-700 text-red-200 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {/* Notes Grid */}
      <div className="max-w-6xl mx-auto">
        <NoteList
          notes={notes}
          fetching={fetching}
          selectedId={selectedNote?.id}
          onSelect={(note) => setSelectedNote(selectedNote?.id === note.id ? null : note)}
          onDelete={handleDelete}
        />
      </div>

      {/* Form Modal */}
      {showForm && (
        <NoteForm
          saving={saving}
          onAdd={handleAdd}
          onClose={() => setShowForm(false)}
        />
      )}

      {/* Note Detail Modal */}
      <NoteDetail note={selectedNote} onClose={() => setSelectedNote(null)} />
    </main>
  )
}
