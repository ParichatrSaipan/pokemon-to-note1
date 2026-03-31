function PokemonInfo({ pokemon }) {
  if (!pokemon) return null

  return (
    <div
      className="flex gap-2 items-center rounded-lg p-3 w-fit"
      style={{ backgroundColor: pokemon.bgColor || '#6b7280' }}
    >
      {pokemon.cardAssets?.pokemon && (
        <img
          src={pokemon.cardAssets.pokemon}
          alt={pokemon.name}
          className="w-16 h-16 object-contain drop-shadow-lg"
        />
      )}
      <div>
        <p className="text-white font-bold text-sm">{pokemon.name}</p>
        <p className="text-white/80 text-xs font-semibold">{pokemon.type} Type</p>
      </div>
    </div>
  )
}

export default function NoteDetail({ note, onClose }) {
  if (!note) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-xl border border-gray-700 max-w-3xl w-full max-h-[85vh] overflow-y-auto">
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-start gap-4">
            <div>
              <h2 className="text-3xl font-bold text-white">{note.title}</h2>
              {note.pokemon && (
                <p className="text-sm text-gray-400 mt-1">{note.pokemon.type} Type</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-200 text-2xl shrink-0"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-6 my-4">
            <p className="text-gray-200 text-lg leading-relaxed whitespace-pre-wrap break-words">
              {note.content}
            </p>
          </div>

          {note.pokemon && (
            <div className="pt-4 border-t border-gray-700">
              <p className="text-sm text-gray-400 mb-2">Associated Pokemon</p>
              <PokemonInfo pokemon={note.pokemon} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
