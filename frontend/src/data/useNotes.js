import { useState, useEffect } from 'react'
import { getNotes, createNote, deleteNote } from './api'

// Helper to get Pokemon map from localStorage
function getPokemonMap() {
  try {
    return JSON.parse(localStorage.getItem('pokemonMap') || '{}')
  } catch {
    return {}
  }
}

// Helper to save Pokemon map to localStorage
function savePokemonMap(map) {
  localStorage.setItem('pokemonMap', JSON.stringify(map))
}

// Custom hook to manage notes state and API calls
export function useNotes() {
  // State management
  const [notes, setNotes] = useState([])
  const [fetching, setFetching] = useState(false)  // Loading when fetching initial notes
  const [saving, setSaving] = useState(false)      // Loading when creating/deleting
  const [error, setError] = useState(null)         // Error messages

  // Merge notes with their Pokemon data from localStorage
  function mergeWithPokemon(notesData) {
    const pokemonMap = getPokemonMap()
    return notesData.map((note) => ({
      ...note,
      pokemon: pokemonMap[String(note.id)] || null,
    }))
  }

  // Load all notes from backend
  async function fetchNotes() {
    setFetching(true)
    setError(null)

    try {
      const data = await getNotes()
      // Convert IDs to strings for consistency and merge with Pokemon
      const notesWithPokemon = mergeWithPokemon(data.map((note) => ({
        ...note,
        id: String(note.id),
      })))
      setNotes(notesWithPokemon)
    } catch (err) {
      setError('Failed to load notes. Is the backend running?')
    } finally {
      setFetching(false)
    }
  }

  // Add a new note
  async function addNote({ title, content, pokemon }) {
    setSaving(true)
    setError(null)

    try {
      const newNote = await createNote({ title, content })
      const noteWithId = { ...newNote, id: String(newNote.id), pokemon: pokemon || null }

      // Save Pokemon mapping to localStorage
      if (pokemon) {
        const pokemonMap = getPokemonMap()
        pokemonMap[String(newNote.id)] = pokemon
        savePokemonMap(pokemonMap)
      }

      // Add the new note to state
      setNotes((prev) => [...prev, noteWithId])
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setSaving(false)
    }
  }

  // Delete a note
  async function removeNote(id) {
    setError(null)

    try {
      await deleteNote(id)
      // Remove the note from state
      setNotes((prev) => prev.filter((note) => note.id !== id))

      // Clean up Pokemon mapping
      const pokemonMap = getPokemonMap()
      delete pokemonMap[String(id)]
      savePokemonMap(pokemonMap)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  // Load notes when component mounts
  useEffect(() => {
    fetchNotes()
  }, [])

  return { notes, fetching, saving, error, addNote, removeNote }
}
