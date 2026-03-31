import WaterPokemon from '../assets/card/water/water_pokemon.png'
import WaterLogo from '../assets/card/water/water_logo.png'
import WaterLogoInfo from '../assets/card/water/water_logo_info.svg'

import GrassPokemon from '../assets/card/grass/grass_pokemon.png'
import GrassLogo from '../assets/card/grass/grass_logo.svg'
import GrassLogoInfo from '../assets/card/grass/grass_logo_info.svg'

import IcePokemon from '../assets/card/ice/ice_pokemon.png'
import IceLogo from '../assets/card/ice/ice_logo.svg'
import IceLogoInfo from '../assets/card/ice/ice_logo_info.svg'

import DarkPokemon from '../assets/card/dark/dark_pokemon.png'
import DarkLogo from '../assets/card/dark/dark_logo.svg'
import DarkLogoInfo from '../assets/card/dark/dark_logo_info.svg'

import PsychicPokemon from '../assets/card/psychic/psychic_pokemon.png'
import PsychicLogo from '../assets/card/psychic/psychic_logo.svg'
import PsychicLogoInfo from '../assets/card/psychic/psychic_logo_info.svg'

import FairyPokemon from '../assets/card/fairy/fairy_pokemon.png'
import FairyLogo from '../assets/card/fairy/fairy_logo.svg'
import FairyLogoInfo from '../assets/card/fairy/fairy_logo_info.svg'

const CARD_ASSETS = {
  water: { pokemon: WaterPokemon, logo: WaterLogo, logoInfo: WaterLogoInfo },
  grass: { pokemon: GrassPokemon, logo: GrassLogo, logoInfo: GrassLogoInfo },
  ice: { pokemon: IcePokemon, logo: IceLogo, logoInfo: IceLogoInfo },
  dark: { pokemon: DarkPokemon, logo: DarkLogo, logoInfo: DarkLogoInfo },
  psychic: { pokemon: PsychicPokemon, logo: PsychicLogo, logoInfo: PsychicLogoInfo },
  fairy: { pokemon: FairyPokemon, logo: FairyLogo, logoInfo: FairyLogoInfo },
}

export const POKEMON = [
  {
    id: 1,
    name: 'Squirtle',
    type: 'Water',
    typeFolder: 'water',
    color: '#3B82F6',
    bgColor: '#1E40AF',
    cardAssets: CARD_ASSETS.water,
  },
  {
    id: 2,
    name: 'Houndoom',
    type: 'Dark',
    typeFolder: 'dark',
    color: '#1F2937',
    bgColor: '#111827',
    cardAssets: CARD_ASSETS.dark,
  },
  {
    id: 3,
    name: 'Alakazam',
    type: 'Psychic',
    typeFolder: 'psychic',
    color: '#8B5CF6',
    bgColor: '#6D28D9',
    cardAssets: CARD_ASSETS.psychic,
  },
  {
    id: 4,
    name: 'Clefable',
    type: 'Fairy',
    typeFolder: 'fairy',
    color: '#EC4899',
    bgColor: '#BE185D',
    cardAssets: CARD_ASSETS.fairy,
  },
  {
    id: 5,
    name: 'Onix',
    type: 'Ice',
    typeFolder: 'ice',
    color: '#64748B',
    bgColor: '#334155',
    cardAssets: CARD_ASSETS.ice,
  },
  {
    id: 6,
    name: 'Bulbasaur',
    type: 'Grass',
    typeFolder: 'grass',
    color: '#22C55E',
    bgColor: '#15803D',
    cardAssets: CARD_ASSETS.grass,
  },
]
