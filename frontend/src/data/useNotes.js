import { useState, useEffect, useCallback } from 'react'
import { getNotes, createNote, deleteNote, getStatus } from './api'
import { POKEMON } from './pokemon'

const POKEMON_MAP_KEY = 'pokemonMap'

const pokemonStorage = {
  getMap() {
    try {
      return JSON.parse(localStorage.getItem(POKEMON_MAP_KEY) || '{}')
    } catch {
      return {}
    }
  },

  saveMap(map) {
    localStorage.setItem(POKEMON_MAP_KEY, JSON.stringify(map))
  },

  setPokemon(noteId, pokemon) {
    const map = this.getMap()
    map[String(noteId)] = pokemon
    this.saveMap(map)
  },

  removePokemon(noteId) {
    const map = this.getMap()
    delete map[String(noteId)]
    this.saveMap(map)
  },

  mergePokemon(notes) {
    const map = this.getMap()
    return notes.map((note) => {
      const key = String(note.id)
      const cached = map[key]
      const isValid = cached && POKEMON.some((p) => p.id === cached.id && p.name === cached.name)
      if (!isValid) {
        const random = POKEMON[Math.floor(Math.random() * POKEMON.length)]
        map[key] = random
        this.saveMap(map)
      }
      return { ...note, pokemon: map[key] }
    })
  },
}

export function useNotes() {
  const [notes, setNotes] = useState([])
  const [fetching, setFetching] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [storageMode, setStorageMode] = useState(null)
  const [connected, setConnected] = useState(false)

  const fetchNotes = useCallback(async () => {
    setFetching(true)
    setError(null)
    setStorageMode(null)

    try {
      const [data, status] = await Promise.all([getNotes(), getStatus()])
      setConnected(true)
      setStorageMode(status.storage)
      console.log(`[STORAGE] Using: ${status.storage === 'pockethost' ? 'Public (PocketHost)' : 'Personal'}`)
      const normalizedNotes = data
        .map((note) => ({ ...note, id: String(note.id) }))
        .sort((a, b) => Number(b.id) - Number(a.id))
      const notesWithPokemon = pokemonStorage.mergePokemon(normalizedNotes)
      setNotes(notesWithPokemon)
    } catch (err) {
      const isNetworkError = err.message === 'Failed to fetch' || err.message === 'Load failed' || err.message === 'NetworkError when attempting to fetch resource.'
      setConnected(!isNetworkError)
      if (!isNetworkError) {
        setError({ message: err.message, id: Date.now() })
      }
    } finally {
      setFetching(false)
    }
  }, [])

  const addNote = useCallback(async ({ title, content }) => {
    setSaving(true)

    try {
      const newNote = await createNote({ title, content })
      const randomPokemon = POKEMON[Math.floor(Math.random() * POKEMON.length)]
      const noteWithId = {
        ...newNote,
        id: String(newNote.id),
        pokemon: randomPokemon,
      }

      pokemonStorage.setPokemon(newNote.id, randomPokemon)
      setNotes((prev) => [noteWithId, ...prev])
      return randomPokemon
    } catch (err) {
      setError({ message: err.message, id: Date.now() })
      throw err
    } finally {
      setSaving(false)
    }
  }, [])

  const removeNote = useCallback(async (id) => {
    try {
      await deleteNote(id)
      setNotes((prev) => prev.filter((note) => note.id !== id))
      pokemonStorage.removePokemon(id)
    } catch (err) {
      setError({ message: err.message, id: Date.now() })
      throw err
    }
  }, [])

  useEffect(() => {
    fetchNotes()
  }, [fetchNotes])

  const clearCache = useCallback(async () => {
    localStorage.removeItem(POKEMON_MAP_KEY)
    await fetchNotes()
  }, [fetchNotes])

  return { notes, fetching, saving, error, storageMode, connected, addNote, removeNote, fetchNotes, clearCache }
}
