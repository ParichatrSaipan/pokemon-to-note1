import { useState, useCallback, useEffect, useMemo } from 'react'
import { toast } from 'sonner'
import { useNotes } from '../data/useNotes'
import { toggleStorage } from '../data/api'
import { POKEMON } from '../data/pokemon'
import NoteForm from '../components/NoteForm'
import NoteDetail from '../components/NoteDetail'
import NoteList from '../components/NoteList'

function ErrorModal({ message, onClose }) {
  const pokemon = useMemo(() => POKEMON[Math.floor(Math.random() * POKEMON.length)], [])

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl border border-red-500/30 w-full max-w-sm p-6 text-center shadow-2xl">
        <div
          className="relative w-28 h-28 rounded-2xl mx-auto flex items-center justify-center overflow-hidden mb-5"
          style={{ backgroundColor: pokemon.color }}
        >
          {pokemon.cardAssets?.logo && (
            <img src={pokemon.cardAssets.logo} alt="" className="absolute w-20 h-20 object-contain opacity-30" />
          )}
          <img src={pokemon.cardAssets.pokemon} alt={pokemon.name} className="relative z-10 w-20 h-20 object-contain" />
        </div>
        <p className="text-red-400 text-xs uppercase tracking-widest font-semibold mb-2">Error</p>
        <p className="text-white text-base font-medium">{message}</p>
        <button
          onClick={onClose}
          className="mt-6 w-full py-3 rounded-full bg-white text-black font-semibold hover:bg-gray-100 transition-colors"
        >
          OK
        </button>
      </div>
    </div>
  )
}

export default function NotesPage() {
  const { notes, fetching, saving, error, storageMode, addNote, removeNote, fetchNotes } = useNotes()
  const [selectedNote, setSelectedNote] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [showError, setShowError] = useState(false)

  useEffect(() => {
    if (error) setShowError(true)
  }, [error])

  const handleAdd = useCallback(async (noteData) => {
    try {
      const pokemon = await addNote(noteData)
      toast.success('Note added!')
      return pokemon
    } catch (err) {
      console.error('Error adding note:', err)
    }
  }, [addNote])

  const handleDelete = useCallback(async (id) => {
    try {
      await removeNote(id)
      if (selectedNote?.id === id) setSelectedNote(null)
      toast.error('Note deleted!')
    } catch (err) {
      console.error('Error deleting note:', err)
    }
  }, [selectedNote, removeNote])

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 sm:py-12 relative">
      <div className="max-w-6xl mx-auto mb-12 flex justify-between items-start gap-6">
        <div>
          <h1 className="text-gray-400 text-lg font-light">Select Your</h1>
          <h2 className="text-white text-4xl sm:text-5xl font-bold">Pokèmon to note</h2>
          {storageMode && storageMode !== 'unknown' && (
            <button
              onClick={async () => {
                await toggleStorage()
                await fetchNotes()
              }}
              className={`mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-opacity hover:opacity-75 ${
                storageMode === 'pockethost'
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${storageMode === 'pockethost' ? 'bg-green-400' : 'bg-yellow-400'}`} />
              {storageMode === 'pockethost' ? 'Cloud (PocketHost)' : 'Local Data'}
            </button>
          )}
        </div>
        <button
          onClick={() => setShowForm(true)}
          aria-label="Add note"
          className="shrink-0 mt-2 w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-gray-600 text-gray-400 hover:border-white hover:text-white hover:bg-white/5 transition-all duration-200 flex items-center justify-center text-3xl"
        >
          +
        </button>
      </div>


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
          storageMode={storageMode}
        />
      )}

      {/* Note Detail Modal */}
      <NoteDetail note={selectedNote} onClose={() => setSelectedNote(null)} />

      {/* Error Modal */}
      {error && showError && (
        <ErrorModal message={error.message} onClose={() => setShowError(false)} />
      )}
    </main>
  )
}
