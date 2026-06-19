import type { SaveGame } from '../engine/types'
import { simularPartida } from '../engine/match'
import { atualizarTabela } from '../engine/season'

interface Props {
  save: SaveGame
  onAtualizar: (s: SaveGame) => void
  onVoltar: () => void
}

export default function TelaJogo({ save, onAtualizar, onVoltar }: Props) {
  const { liga, timeJogadorId } = save
  const times = liga.times
  const rodadaIdx = liga.rodadaAtual
  const rodadaAtual = liga.rodadas[rodadaIdx]
  const meuTime = times.find(t => t.id === timeJogadorId)!
  const temporadaFim = rodadaIdx >= liga.rodadas.length

  function getTime(id: string) { return times.find(t => t.id === id)! }

  function simularRodada() {
    if (temporadaFim) return
    const partidasSimuladas = rodadaAtual.partidas.map(p =>
      simularPartida(p, getTime(p.timeCasa), getTime(p.timeVisitante))
    )
    const novaRodada = { ...rodadaAtual, partidas: partidasSimuladas }
    const novasRodadas = liga.rodadas.map((r, i) => i === rodadaIdx ? novaRodada : r)
    const novaTabela = atualizarTabela(liga.tabela, novaRodada)
    const novoSave: SaveGame = {
      ...save,
      dataSave: new Date().toISOString(),
      liga: { ...liga, rodadas: novasRodadas, tabela: novaTabela, rodadaAtual: rodadaIdx + 1 },
    }
    onAtualizar(novoSave)
  }

  const minhasPartidas = temporadaFim ? [] : rodadaAtual.partidas.filter(
    p => p.timeCasa === timeJogadorId || p.timeVisitante === timeJogadorId
  )

  return (
    <div className="tela-jogo">
      <div className="jogo-header">
        <button className="btn-secondary btn-voltar" onClick={onVoltar}>← Menu</button>
        <h2 style={{ color: meuTime.cor }}>🏟 {meuTime.nome}</h2>
        <span className="temporada">{liga.nome} {liga.temporada}</span>
      </div>

      <div className="jogo-corpo">
        <div className="painel">
          <h3>{temporadaFim ? '🏆 Temporada encerrada!' : `Rodada ${rodadaIdx + 1} de ${liga.rodadas.length}`}</h3>

          {!temporadaFim && (
            <>
              {minhasPartidas.map(p => (
                <div key={p.id} className="partida-destaque">
                  <span>{getTime(p.timeCasa).sigla}</span>
                  <span className="placar">
                    {p.jogada ? `${p.golsCasa} × ${p.golsVisitante}` : 'vs'}
                  </span>
                  <span>{getTime(p.timeVisitante).sigla}</span>
                </div>
              ))}
              <button className="btn-primary btn-simular" onClick={simularRodada}>
                ▶ Simular Rodada {rodadaIdx + 1}
              </button>
            </>
          )}
        </div>

        <div className="painel">
          <h3>📊 Classificação</h3>
          <table className="tabela">
            <thead>
              <tr><th>#</th><th>Time</th><th>Pts</th><th>J</th><th>V</th><th>E</th><th>D</th><th>SG</th></tr>
            </thead>
            <tbody>
              {liga.tabela.map((t, i) => {
                const time = getTime(t.timeId)
                return (
                  <tr key={t.timeId} className={t.timeId === timeJogadorId ? 'meu-time' : ''}>
                    <td>{i + 1}</td>
                    <td style={{ color: time.cor }}>{time.sigla}</td>
                    <td><strong>{t.pontos}</strong></td>
                    <td>{t.jogos}</td>
                    <td>{t.vitorias}</td>
                    <td>{t.empates}</td>
                    <td>{t.derrotas}</td>
                    <td>{t.saldoGols > 0 ? '+' : ''}{t.saldoGols}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
