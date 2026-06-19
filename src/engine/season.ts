import { Time, Rodada, Partida, Tabela, Liga } from './types'
import { gerarTabela } from './generate'

let partidaCounter = 0

function gerarPartida(casaId: string, visitanteId: string): Partida {
  return {
    id: `p-${++partidaCounter}`,
    timeCasa: casaId,
    timeVisitante: visitanteId,
    golsCasa: 0,
    golsVisitante: 0,
    jogada: false,
  }
}

export function gerarCalendario(times: Time[]): Rodada[] {
  const ids = times.map(t => t.id)
  const n = ids.length
  const rodadas: Rodada[] = []
  const lista = [...ids]
  if (n % 2 !== 0) lista.push('bye')
  const total = lista.length
  const numRodadas = total - 1
  const jogosRodada = total / 2

  for (let r = 0; r < numRodadas; r++) {
    const partidas: Partida[] = []
    for (let j = 0; j < jogosRodada; j++) {
      const casa = lista[j]
      const visit = lista[total - 1 - j]
      if (casa !== 'bye' && visit !== 'bye') {
        partidas.push(gerarPartida(casa, visit))
      }
    }
    rodadas.push({ numero: r + 1, partidas })
    lista.splice(1, 0, lista.pop()!)
  }

  // turno + returno
  const returno = rodadas.map((r, i) => ({
    numero: numRodadas + i + 1,
    partidas: r.partidas.map(p => gerarPartida(p.timeVisitante, p.timeCasa)),
  }))

  return [...rodadas, ...returno]
}

export function atualizarTabela(tabela: Tabela[], rodada: Rodada): Tabela[] {
  const nova = tabela.map(t => ({ ...t }))

  rodada.partidas.forEach(p => {
    if (!p.jogada) return
    const casa = nova.find(t => t.timeId === p.timeCasa)!
    const visit = nova.find(t => t.timeId === p.timeVisitante)!

    casa.jogos++
    visit.jogos++
    casa.golsPro += p.golsCasa
    casa.golsContra += p.golsVisitante
    visit.golsPro += p.golsVisitante
    visit.golsContra += p.golsCasa
    casa.saldoGols = casa.golsPro - casa.golsContra
    visit.saldoGols = visit.golsPro - visit.golsContra

    if (p.golsCasa > p.golsVisitante) {
      casa.vitorias++; casa.pontos += 3; visit.derrotas++
    } else if (p.golsCasa < p.golsVisitante) {
      visit.vitorias++; visit.pontos += 3; casa.derrotas++
    } else {
      casa.empates++; casa.pontos++; visit.empates++; visit.pontos++
    }
  })

  return nova.sort((a, b) =>
    b.pontos - a.pontos ||
    b.vitorias - a.vitorias ||
    b.saldoGols - a.saldoGols ||
    b.golsPro - a.golsPro
  )
}

export function criarLiga(times: Time[]): Liga {
  return {
    nome: 'Brasileirão Série A',
    temporada: new Date().getFullYear(),
    times,
    rodadas: gerarCalendario(times),
    tabela: gerarTabela(times.map(t => t.id)),
    rodadaAtual: 0,
  }
}
