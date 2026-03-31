import { useState, useCallback } from 'react'
import DragonImg from '../assets/dragon.png'
import PokeBallImg from '../assets/Pokeball.png'

export default function NoteForm({ saving, onAdd, onClose, storageMode }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [revealedPokemon, setRevealedPokemon] = useState(null)

  const canSubmit = title.trim() && content.trim()

  const handleSubmit = useCallback(async () => {
    if (!canSubmit) return
    try {
      const pokemon = await onAdd({ title, content })
      if (pokemon) setRevealedPokemon(pokemon)
      else onClose()
    } catch (err) {
      console.error('Error adding note:', err)
    }
  }, [title, content, canSubmit, onAdd, onClose])

  return (
    <div className="fixed inset-0 z-40 bg-black overflow-hidden">
      {/* Pokeball Background */}
      <img src={PokeBallImg} alt="" className="fixed -top-10 -right-16 w-48 h-48 sm:-top-20 sm:-right-32 sm:w-96 sm:h-96 opacity-30 pointer-events-none z-1" />
      <img src={PokeBallImg} alt="" className="fixed -bottom-10 -left-16 w-40 h-40 sm:bottom-0 sm:-left-40 sm:w-80 sm:h-80 opacity-30 pointer-events-none z-1" />

      {/* Pokemon Reveal Popup */}
      {revealedPokemon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="rounded-3xl border border-white/20 bg-zinc-900/95 backdrop-blur-xl p-8 text-center shadow-2xl w-full max-w-xs">
            <p className="text-gray-400 text-xs uppercase tracking-widest mb-5">Your Pokemon is</p>
            <div
              className="relative w-36 h-36 rounded-2xl mx-auto flex items-center justify-center overflow-hidden mb-5"
              style={{ backgroundColor: revealedPokemon.color }}
            >
              {revealedPokemon.cardAssets?.logo && (
                <img src={revealedPokemon.cardAssets.logo} alt="" className="absolute w-28 h-28 object-contain opacity-30" />
              )}
              {revealedPokemon.cardAssets?.pokemon && (
                <img src={revealedPokemon.cardAssets.pokemon} alt={revealedPokemon.name} className="relative z-10 w-24 h-24 object-contain" />
              )}
            </div>
            <p className="text-white text-2xl font-bold">{revealedPokemon.name}</p>
            <p className="text-gray-400 text-sm mt-1">{revealedPokemon.type} Type</p>
            <button
              onClick={onClose}
              className="mt-6 w-full py-3 rounded-full bg-white text-black font-semibold hover:bg-gray-100 transition-colors"
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      {/* Dragon Image */}
      <img
        src={DragonImg}
        alt=""
        className="pointer-events-none fixed right-0 bottom-0 w-52 sm:w-80 md:w-[480px] z-1 opacity-90"
      />

      <div className="relative h-screen flex flex-col px-4 pt-6 pb-6 sm:px-10 sm:pt-10 z-10 max-w-5xl mx-auto">

        {/* Top nav */}
        <div className="flex items-center justify-between mb-8 sm:mb-10 shrink-0">
          <button
            onClick={onClose}
            aria-label="Back"
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-gray-600 text-gray-400 hover:border-white hover:text-white transition-all flex items-center justify-center"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M14.5 5L7.5 12L14.5 19" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="flex-1 mx-4 sm:mx-6 flex flex-col gap-1">
            <p className="text-gray-500 text-xs uppercase tracking-widest">New Note</p>
            {storageMode && (
              <span className={`inline-flex items-center gap-1.5 w-fit px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                storageMode === 'pockethost'
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${storageMode === 'pockethost' ? 'bg-green-400' : 'bg-yellow-400'}`} />
                {storageMode === 'pockethost' ? 'Public (PocketHost)' : 'Personal'}
              </span>
            )}
          </div>

          <div className="flex gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => { setTitle(''); setContent('') }}
              aria-label="Clear form"
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-gray-600 text-gray-400 hover:border-white hover:text-white transition-all flex items-center justify-center"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M9 4H15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M10 8V17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M14 8V17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M6.5 7.5H17.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M8.5 20H15.5C16.3 20 17 19.3 17 18.5V7.5H7V18.5C7 19.3 7.7 20 8.5 20Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit || saving}
              aria-label="Save note"
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full transition-all flex items-center justify-center font-semibold ${
                canSubmit && !saving
                  ? 'bg-white text-black hover:bg-gray-100 shadow-lg'
                  : 'border border-gray-600 text-gray-600 cursor-not-allowed opacity-40'
              }`}
            >
              {saving ? (
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
              ) : (
                <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 13L10 18L19 8" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Form fields */}
        <div className="flex-1 overflow-y-auto">
          <div className="w-full sm:max-w-xl space-y-5">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your note a name..."
                required
                className="w-full h-14 sm:h-16 rounded-xl bg-white/5 border border-white/10 px-5 text-xl sm:text-2xl text-white placeholder:text-gray-600 outline-none transition-all focus:border-white/30 focus:bg-white/8"
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest">
                Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your thoughts, ideas, or anything on your mind..."
                required
                rows={6}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-5 py-4 text-base sm:text-lg text-white placeholder:text-gray-600 outline-none resize-none transition-all focus:border-white/30 focus:bg-white/8"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
