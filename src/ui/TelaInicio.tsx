import { useState } from 'react'
import { gerarTimes } from '../engine/generate'
import type { Time } from '../engine/types'

interface Props {
  temSave: boolean
  onNovoJogo: (timeId: string) => void
  onContinuar: () => void
  onDeletar: () => void
}

const TIMES_PREVIEW = gerarTimes()

export default function TelaInicio({ temSave, onNovoJogo, onContinuar, onDeletar }: Props) {
  const [selecionado, setSelecionado] = useState<Time | null>(null)
  const [confirmaDeletar, setConfirmaDeletar] = useState(false)

  return (
    <div className="tela-inicio">
      <div className="header-jogo">
        <h1>⚽ Técnico BR</h1>
        <p className="subtitulo">Brasileirão Série A</p>
      </div>

      {temSave && !confirmaDeletar && (
        <div className="save-box">
          <button className="btn-primary" onClick={onContinuar}>▶ Continuar Jogo</button>
          <button className="btn-danger" onClick={() => setConfirmaDeletar(true)}>🗑 Novo Jogo</button>
        </div>
      )}

      {confirmaDeletar && (
        <div className="save-box">
          <p>Apagar o save atual e começar do zero?</p>
          <button className="btn-danger" onClick={() => { onDeletar(); setConfirmaDeletar(false) }}>Confirmar</button>
          <button className="btn-secondary" onClick={() => setConfirmaDeletar(false)}>Cancelar</button>
        </div>
      )}

      {!temSave && (
        <div className="selecao-time">
          <h2>Escolha seu time</h2>
          <div className="grid-times">
            {TIMES_PREVIEW.map(t => (
              <div
                key={t.id}
                className={`card-time ${selecionado?.id === t.id ? 'selecionado' : ''}`}
                style={{ borderColor: t.cor }}
                onClick={() => setSelecionado(t)}
              >
                <span className="sigla" style={{ color: t.cor }}>{t.sigla}</span>
                <span className="nome-time">{t.nome}</span>
                <span className="forca">⭐ {t.forca}</span>
              </div>
            ))}
          </div>
          {selecionado && (
            <button className="btn-primary btn-confirmar" onClick={() => onNovoJogo(selecionado.id)}>
              Jogar com {selecionado.nome} →
            </button>
          )}
        </div>
      )}
    </div>
  )
}
