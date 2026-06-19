import type { Time, Partida } from './types'

function randomGols(forca: number): number {
  const base = forca / 100
  const rand = Math.random()
  if (rand < 0.15) return 0
  if (rand < 0.40) return 1
  if (rand < 0.65 + base * 0.1) return 2
  if (rand < 0.82 + base * 0.08) return 3
  if (rand < 0.93) return 4
  return 5
}

export function simularPartida(
  partida: Partida,
  timeCasa: Time,
  timeVisitante: Time
): Partida {
  const vantajem = 5 // bônus de jogar em casa
  const forcaCasa = Math.min(100, timeCasa.forca + vantajem)
  const forcaVisit = timeVisitante.forca

  const golsCasa = randomGols(forcaCasa)
  const golsVisitante = randomGols(forcaVisit)

  return {
    ...partida,
    golsCasa,
    golsVisitante,
    jogada: true,
  }
}
