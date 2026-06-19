import { useState } from 'react'
import type { SaveGame } from './engine/types'
import { gerarTimes } from './engine/generate'
import { criarLiga } from './engine/season'
import { salvarJogo, carregarJogo, deletarJogo } from './engine/save'
import TelaInicio from './ui/TelaInicio'
import TelaJogo from './ui/TelaJogo'
import './App.css'

type Tela = 'inicio' | 'jogo'

export default function App() {
  const [tela, setTela] = useState<Tela>('inicio')
  const [save, setSave] = useState<SaveGame | null>(null)

  function novoJogo(timeId: string) {
    const times = gerarTimes()
    const liga = criarLiga(times)
    const novaSave: SaveGame = {
      versao: '0.1.0',
      dataSave: new Date().toISOString(),
      timeJogadorId: timeId,
      liga,
    }
    salvarJogo(novaSave)
    setSave(novaSave)
    setTela('jogo')
  }

  function continuarJogo() {
    const s = carregarJogo()
    if (s) { setSave(s); setTela('jogo') }
  }

  function voltarMenu() {
    if (save) salvarJogo(save)
    setTela('inicio')
  }

  function atualizarSave(novo: SaveGame) {
    salvarJogo(novo)
    setSave(novo)
  }

  return (
    <div className="app">
      {tela === 'inicio' && (
        <TelaInicio
          temSave={!!carregarJogo()}
          onNovoJogo={novoJogo}
          onContinuar={continuarJogo}
          onDeletar={() => { deletarJogo(); setSave(null) }}
        />
      )}
      {tela === 'jogo' && save && (
        <TelaJogo
          save={save}
          onAtualizar={atualizarSave}
          onVoltar={voltarMenu}
        />
      )}
    </div>
  )
}
