import { useMemo } from 'react'
import PokeBallImg from '../assets/Pokeball.png'
import { POKEMON } from '../data/pokemon'

function LoadingState() {
  const pokemon = useMemo(() => POKEMON[Math.floor(Math.random() * POKEMON.length)], [])

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24">
      <img
        src={pokemon.cardAssets.pokemon}
        alt={pokemon.name}
        className="w-28 h-28 object-contain animate-spin"
        style={{ animationDuration: '1.2s' }}
      />
      <p className="text-gray-400 text-base font-medium tracking-wide">Loading notes...</p>
    </div>
  )
}


function EmptyState({ connected }) {
  const pokemon = useMemo(() => POKEMON[Math.floor(Math.random() * POKEMON.length)], [])

  if (!connected) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-6">
        <div className="relative w-32 h-32 rounded-2xl flex items-center justify-center overflow-hidden" style={{ backgroundColor: pokemon.color + '33' }}>
          {pokemon.cardAssets?.logo && (
            <img src={pokemon.cardAssets.logo} alt="" className="absolute w-24 h-24 object-contain opacity-20" />
          )}
          <img src={pokemon.cardAssets.pokemon} alt={pokemon.name} className="relative z-10 w-20 h-20 object-contain opacity-50" />
        </div>
        <div className="text-center space-y-1">
          <p className="text-red-400 font-semibold text-sm">Backend not connected</p>
          <p className="text-gray-600 text-xs">Start the backend server to load your notes</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <img src={pokemon.cardAssets.pokemon} alt={pokemon.name} className="w-24 h-24 object-contain opacity-30" />
      <p className="text-gray-500 text-sm">No notes yet. Click + to create one!</p>
    </div>
  )
}

export default function NoteList({ notes, fetching, connected, onSelect, onDelete, selectedId }) {
  if (fetching) return <LoadingState />
  if (notes.length === 0) return <EmptyState connected={connected} />

  const pokeballs = Array.from({ length: 5 }, (_, i) => ({
    id: i,
    top: `${Math.random() * 80}%`,
    left: `${Math.random() * 90}%`,
    size: Math.random() * 60 + 40,
    opacity: Math.random() * 0.15 + 0.05,
  }))

  return (
    <div className="relative">
      {/* Random Pokeballs Background */}
      {pokeballs.map((ball) => (
        <img
          key={ball.id}
          src={PokeBallImg}
          alt=""
          className="absolute pointer-events-none z-0"
          style={{
            top: ball.top,
            left: ball.left,
            width: `${ball.size}px`,
            height: `${ball.size}px`,
            opacity: ball.opacity,
          }}
        />
      ))}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 relative z-10">
        {notes.map((note) => {
          const pokemon = note.pokemon

          return (
            <div
              key={note.id}
              onClick={() => onSelect(note)}
              className={`group relative h-40 sm:h-44 rounded-2xl overflow-hidden cursor-pointer transition-shadow duration-200 hover:shadow-2xl border border-white/10 ${
                selectedId === note.id ? 'ring-2 ring-offset-2 ring-offset-black ring-blue-400' : ''
              }`}
              style={{ backgroundColor: '#f1f5f9' }}
            >
              {/* Left section */}
              <div className="absolute left-4 sm:left-5 right-32 sm:right-40 top-0 bottom-0 z-10 flex flex-col justify-between py-3 sm:py-3.5 overflow-hidden">
                <div className="overflow-hidden min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 leading-tight truncate tracking-tight min-w-0">
                    {note.title}
                  </h3>
                  {note.content && (
                    <p className="text-xs text-gray-400 mt-1 line-clamp-3 leading-relaxed wrap-break-word overflow-hidden">
                      {note.content}
                    </p>
                  )}
                </div>

                {pokemon && (
                  <div
                    className="px-2 py-1 sm:py-1.5 rounded-full inline-flex items-center gap-1.5 w-fit"
                    style={{ backgroundColor: pokemon.color }}
                  >
                    {pokemon.cardAssets?.logoInfo && (
                      <div className="w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full flex items-center justify-center shrink-0">
                        <img src={pokemon.cardAssets.logoInfo} alt={pokemon.type} className="w-2.5 h-2.5 sm:w-3 sm:h-3 object-contain" />
                      </div>
                    )}
                    <span className="text-white text-xs font-semibold">{pokemon.type}</span>
                  </div>
                )}
              </div>

              {/* Right section */}
              {pokemon && pokemon.cardAssets?.pokemon && (
                <div
                  className="absolute right-0 top-0 w-32 h-40 sm:w-40 sm:h-44 flex items-center justify-center"
                  style={{ backgroundColor: pokemon.color }}
                >
                  {pokemon.cardAssets?.logo && (
                    <img src={pokemon.cardAssets.logo} alt={pokemon.type} className="absolute w-24 h-24 sm:w-28 sm:h-28 object-contain opacity-40" />
                  )}
                  <img src={pokemon.cardAssets.pokemon} alt={pokemon.name} className="w-16 h-16 sm:w-20 sm:h-20 object-contain relative z-10" />
                </div>
              )}

              {/* Delete button — always visible on mobile, hover-only on larger screens */}
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(note.id) }}
                className="absolute bottom-2 right-2 sm:bottom-2.5 sm:right-2.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-black/10 hover:bg-red-500 text-gray-500 hover:text-white z-20 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-150 flex items-center justify-center"
                aria-label="Delete note"
              >
                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 4H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M10 8V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M14 8V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M6.5 7.5H17.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M8.5 20H15.5C16.3 20 17 19.3 17 18.5V7.5H7V18.5C7 19.3 7.7 20 8.5 20Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
