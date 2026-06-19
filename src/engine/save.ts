import type { SaveGame } from './types'

const SAVE_KEY = 'tecnico-br-save'

export function salvarJogo(save: SaveGame): void {
  localStorage.setItem(SAVE_KEY, JSON.stringify(save))
}

export function carregarJogo(): SaveGame | null {
  const raw = localStorage.getItem(SAVE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as SaveGame
  } catch {
    return null
  }
}

export function deletarJogo(): void {
  localStorage.removeItem(SAVE_KEY)
}
