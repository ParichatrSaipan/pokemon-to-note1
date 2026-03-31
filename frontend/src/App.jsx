import NotesPage from './pages/NotesPage'
import PokeBallImg from './assets/Pokeball.png'

export default function App() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <img
        src={PokeBallImg}
        alt=""
        className="fixed -top-10 -right-16 w-48 h-48 sm:-top-20 sm:-right-32 sm:w-96 sm:h-96 opacity-50 pointer-events-none z-0 mix-blend-screen"
      />
      <img
        src={PokeBallImg}
        alt=""
        className="fixed -bottom-10 -left-16 w-40 h-40 sm:bottom-0 sm:-left-40 sm:w-80 sm:h-80 opacity-50 pointer-events-none z-0 mix-blend-screen"
      />

      <div className="relative z-10">
        <NotesPage />
      </div>
    </div>
  )
}
