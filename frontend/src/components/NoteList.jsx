export default function NoteList({ notes, fetching, onSelect, onDelete, selectedId }) {
  if (fetching && notes.length === 0) {
    return (
      <div className="flex items-center justify-center gap-2 text-sm text-gray-400 py-12">
        <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
        </svg>
        Loading notes...
      </div>
    )
  }

  if (notes.length === 0) {
    return <p className="text-center text-sm text-gray-400 py-12">No notes yet. Click + to create one!</p>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[calc(100vh-300px)] overflow-y-auto pr-4">
      {notes.map((note) => {
        const pokemon = note.pokemon
        const bgColor = pokemon ? pokemon.bg : 'from-gray-600 to-gray-800'

        return (
          <div
            key={note.id}
            onClick={() => onSelect(note)}
            className={`relative bg-white cursor-pointer hover:shadow-2xl transition-all rounded-lg group h-32 flex items-stretch ${
              selectedId === note.id ? 'ring-2 ring-blue-500' : ''
            }`}
            style={{ overflow: 'hidden' }}
          >
            {/* Left side - White background with info */}
            <div className="w-1/2 bg-white p-3 flex flex-col justify-between border-r-2 border-gray-200">
              <div>
                <p className="text-xs text-gray-400 font-bold tracking-wide">N°{note.id.slice(-3)}</p>
                <h3 className="text-base font-black text-gray-800 mt-1 leading-tight break-words">
                  {note.title}
                </h3>
              </div>

              {pokemon && (
                <div className="inline-flex items-center gap-2">
                  <span className="text-lg">🍃</span>
                  <span className="text-sm font-bold text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                    {pokemon.type}
                  </span>
                </div>
              )}
            </div>

            {/* Right side - Colored background with Pokemon image */}
            {pokemon && (
              <div className={`w-1/2 bg-gradient-to-br ${bgColor} relative flex items-center justify-center rounded-tr-lg rounded-br-lg`}>
                <img
                  src={pokemon.image}
                  alt={pokemon.name}
                  className="w-full h-full object-contain drop-shadow-lg p-2"
                />
              </div>
            )}

            {/* Heart button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
              }}
              className="absolute top-3 right-3 w-8 h-8 rounded-full border-2 border-gray-300 text-gray-600 hover:bg-gray-100 transition-all z-20 flex items-center justify-center text-sm"
            >
              ♡
            </button>

            {/* Delete button - on hover */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete(note.id)
              }}
              className="absolute bottom-3 right-3 text-gray-400 hover:text-red-400 z-20 opacity-0 group-hover:opacity-100 transition-opacity text-lg"
            >
              🗑️
            </button>
          </div>
        )
      })}
    </div>
  )
}
