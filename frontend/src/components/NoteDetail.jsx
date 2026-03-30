export default function NoteDetail({ note, onClose }) {
  if (!note) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-end sm:items-center justify-center p-4">
      <div className="bg-gray-900 rounded-xl border border-gray-700 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-start gap-4">
            <h2 className="text-2xl font-bold text-white">{note.title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-200 text-2xl shrink-0"
            >
              ✕
            </button>
          </div>

          {note.pokemon && (
            <div className="flex gap-4 items-center bg-gray-800 rounded-lg p-4">
              <img
                src={note.pokemon.image}
                alt={note.pokemon.name}
                className="w-20 h-20 object-contain"
              />
              <div>
                <p className="text-white font-semibold">{note.pokemon.name}</p>
                <p className="text-gray-400 text-sm">{note.pokemon.type} Type</p>
              </div>
            </div>
          )}

          <p className="text-gray-300 whitespace-pre-wrap break-words">
            {note.content}
          </p>
        </div>
      </div>
    </div>
  )
}
