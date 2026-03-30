import { useState } from 'react'
import { POKEMON } from '../data/pokemon'
import GroupImg from '../assets/Group.png'
import LisadonImg from '../assets/lisadon.png'

export default function NoteForm({ saving, onAdd, onClose }) {
  const [step, setStep] = useState(1) // 1: content, 2: pokemon selection
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [pendingPokemon, setPendingPokemon] = useState(null)
  const [showSelectionConfirm, setShowSelectionConfirm] = useState(false)

  async function handleStep2Submit() {
    setStep(2)
  }

  async function handlePokemonSelect(pokemon) {
    setPendingPokemon(pokemon)
    setShowSelectionConfirm(true)
  }

  async function handleSelectionConfirm() {
    if (!pendingPokemon) return
    try {
      await onAdd({ title, content, pokemon: pendingPokemon })
      setTitle('')
      setContent('')
      setPendingPokemon(null)
      setShowSelectionConfirm(false)
      setStep(1)
      onClose()
    } catch (err) {
      console.error('Error adding note:', err)
    }
  }

  function handleSelectionCancel() {
    setPendingPokemon(null)
    setShowSelectionConfirm(false)
  }

  function handleBack() {
    if (step === 2) {
      setShowSelectionConfirm(false)
      setPendingPokemon(null)
      setStep(1)
    }
    else onClose()
  }

  const decorations = [
    { id: 0, top: '18%', left: '-8%', size: 380 },
    { id: 1, top: '18%', right: '-10%', size: 420 },
  ]

  return (
    <div className="fixed inset-0 z-50 bg-black overflow-hidden">
      {decorations.map((decoration) => (
        <img
          key={decoration.id}
          src={GroupImg}
          alt=""
          className="absolute pointer-events-none opacity-70"
          style={{
            top: decoration.top,
            left: decoration.left,
            right: decoration.right,
            width: `${decoration.size}px`,
            height: `${decoration.size}px`,
            objectFit: 'contain',
          }}
        />
      ))}

      <div className="relative max-w-6xl mx-auto px-4 py-8 sm:px-8 sm:py-10">
        {step === 1 ? (
          <>
            <div className="flex items-start justify-between">
              <button
                onClick={handleBack}
                aria-label="Back"
                className="mt-1 w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-gray-400/70 text-white hover:border-white transition-colors flex items-center justify-center"
              >
                <svg className="w-7 h-7 sm:w-9 sm:h-9" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M14.5 5L7.5 12L14.5 19" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <div className="flex gap-3 sm:gap-4 shrink-0">
                <button
                  onClick={onClose}
                  aria-label="Close form"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-gray-400/70 text-white hover:border-white transition-colors flex items-center justify-center"
                >
                  <svg className="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M9 4H15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M10 8V17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M14 8V17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M6.5 7.5H17.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M8.5 20H15.5C16.3 20 17 19.3 17 18.5V7.5H7V18.5C7 19.3 7.7 20 8.5 20Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  onClick={handleStep2Submit}
                  disabled={!title || !content}
                  aria-label="Continue"
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-gray-400/70 text-white hover:border-white transition-colors flex items-center justify-center disabled:opacity-40 disabled:hover:border-gray-400/70"
                >
                  <svg className="w-7 h-7 sm:w-9 sm:h-9" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M5 13L10 18L19 8" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>

         
          </>
        ) : (
          <div className="flex items-start justify-between gap-4 mb-8">
            <div className="flex items-start gap-5">
              <button
                onClick={handleBack}
                aria-label="Back"
                className="mt-1 w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-gray-400/70 text-white hover:border-white transition-colors flex items-center justify-center"
              >
                <svg className="w-7 h-7 sm:w-9 sm:h-9" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M14.5 5L7.5 12L14.5 19" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

             
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="relative min-h-[calc(100vh-160px)] sm:min-h-[560px] mt-6 sm:mt-8">
            <div className="w-full sm:max-w-[760px] sm:ml-20 space-y-4 relative z-10">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                required
                className="w-full h-24 sm:h-[104px] rounded-2xl bg-zinc-800/75 px-6 text-2xl sm:text-5xl text-gray-200 placeholder:text-gray-400/90 outline-none"
                autoFocus
              />
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter text ..."
                required
                rows={7}
                className="w-full min-h-[300px] sm:min-h-[360px] rounded-2xl bg-zinc-800/75 px-6 py-6 text-xl sm:text-4xl text-gray-200 placeholder:text-gray-400/90 outline-none resize-none"
              />
            </div>

            <p className="sm:hidden absolute left-2 bottom-14 text-gray-300/90 text-[16px] leading-8 tracking-[0.08em] uppercase z-[2]">
              12<br />
              Pokemons<br />
              In Your<br />
              Pokedex
            </p>

            <img
              src={LisadonImg}
              alt=""
              className="pointer-events-none fixed right-0 bottom-0 w-[260px] sm:w-[420px] md:w-[500px] z-[1]"
            />
          </div>
        )}

        {step === 2 && (
          <div className="sm:ml-[4.6rem] relative">
            <h2 className="text-white text-2xl font-light mb-2">
              Select Your <span className="font-bold">Pokèmon to note</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 sm:gap-x-6 sm:gap-y-3 mt-6">
              {POKEMON.map((pokemon) => (
                <button
                  key={pokemon.id}
                  onClick={() => handlePokemonSelect(pokemon)}
                  className={`pokemon-btn relative w-full max-w-[280px] aspect-square rounded-2xl overflow-hidden group mx-auto border transition-all ${
                    pendingPokemon?.id === pokemon.id
                      ? 'border-white/80 ring-2 ring-white/60 shadow-[0_0_0_4px_rgba(255,255,255,0.12)]'
                      : 'border-white/10 hover:border-white/40'
                  }`}
                >
                  <img
                    src={pokemon.image}
                    alt={pokemon.name}
                    className="w-full h-full object-contain p-5 group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent flex flex-col justify-end p-3">
                    <p className="text-white font-semibold text-sm">{pokemon.name}</p>
                    <p className="text-gray-300 text-xs">{pokemon.type}</p>
                  </div>
                </button>
              ))}
            </div>

            {showSelectionConfirm && (
              <div className="absolute inset-0 z-30 flex items-center justify-center rounded-2xl bg-black/55 backdrop-blur-[2px]">
                <div className="w-[92%] max-w-[460px] rounded-3xl bg-zinc-900/80 backdrop-blur-xl p-6 sm:p-7 text-center border border-white/20 shadow-2xl">
                  <p className="text-white text-2xl sm:text-3xl font-semibold tracking-wide">Confirm Selection?</p>
               

                  <div className="mt-7 flex items-center justify-center gap-3 sm:gap-4">
                    <button
                      onClick={handleSelectionCancel}
                      className="min-w-24 px-5 py-2.5 rounded-full bg-white/15 border border-white/20 text-white text-base sm:text-lg hover:bg-white/25 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSelectionConfirm}
                      disabled={saving || !pendingPokemon}
                      className="min-w-24 px-5 py-2.5 rounded-full bg-sky-500 text-white text-base sm:text-lg font-semibold hover:bg-sky-400 transition-colors"
                    >
                      {saving ? 'Saving...' : 'Okay'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
