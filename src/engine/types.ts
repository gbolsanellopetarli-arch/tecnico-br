export interface Jogador {
  id: string
  nome: string
  posicao: 'GOL' | 'DEF' | 'MEI' | 'ATA'
  ataque: number    // 1–100
  defesa: number    // 1–100
  velocidade: number
  overall: number
}

export interface Time {
  id: string
  nome: string
  sigla: string
  cidade: string
  cor: string
  jogadores: Jogador[]
  forca: number     // média calculada dos overalls
}

export interface Partida {
  id: string
  timeCasa: string  // id do time
  timeVisitante: string
  golsCasa: number
  golsVisitante: number
  jogada: boolean
}

export interface Rodada {
  numero: number
  partidas: Partida[]
}

export interface Tabela {
  timeId: string
  pontos: number
  jogos: number
  vitorias: number
  empates: number
  derrotas: number
  golsPro: number
  golsContra: number
  saldoGols: number
}

export interface Liga {
  nome: string
  temporada: number
  times: Time[]
  rodadas: Rodada[]
  tabela: Tabela[]
  rodadaAtual: number
}

export interface SaveGame {
  versao: string
  dataSave: string
  timeJogadorId: string
  liga: Liga
}
