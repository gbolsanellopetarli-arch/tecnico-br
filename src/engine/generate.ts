import type { Jogador, Time, Tabela } from './types'

const TIMES_BR = [
  { nome: 'Flamengo',          sigla: 'FLA', cidade: 'Rio de Janeiro', cor: '#E8001C', forca: 88 },
  { nome: 'Palmeiras',         sigla: 'PAL', cidade: 'São Paulo',       cor: '#006437', forca: 87 },
  { nome: 'Atlético Mineiro',  sigla: 'CAM', cidade: 'Belo Horizonte',  cor: '#000000', forca: 85 },
  { nome: 'Fluminense',        sigla: 'FLU', cidade: 'Rio de Janeiro',  cor: '#6E1E2B', forca: 82 },
  { nome: 'Corinthians',       sigla: 'COR', cidade: 'São Paulo',       cor: '#000000', forca: 81 },
  { nome: 'São Paulo',         sigla: 'SPF', cidade: 'São Paulo',       cor: '#CC0000', forca: 81 },
  { nome: 'Grêmio',            sigla: 'GRE', cidade: 'Porto Alegre',    cor: '#0A3871', forca: 80 },
  { nome: 'Internacional',     sigla: 'INT', cidade: 'Porto Alegre',    cor: '#C8102E', forca: 80 },
  { nome: 'Santos',            sigla: 'SAN', cidade: 'Santos',          cor: '#000000', forca: 78 },
  { nome: 'Botafogo',          sigla: 'BOT', cidade: 'Rio de Janeiro',  cor: '#000000', forca: 78 },
  { nome: 'Vasco',             sigla: 'VAS', cidade: 'Rio de Janeiro',  cor: '#000000', forca: 76 },
  { nome: 'Cruzeiro',          sigla: 'CRU', cidade: 'Belo Horizonte',  cor: '#003087', forca: 76 },
  { nome: 'Athletico PR',      sigla: 'CAP', cidade: 'Curitiba',        cor: '#CC0000', forca: 75 },
  { nome: 'Fortaleza',         sigla: 'FOR', cidade: 'Fortaleza',       cor: '#0033A0', forca: 74 },
  { nome: 'Bahia',             sigla: 'BAH', cidade: 'Salvador',        cor: '#0033A0', forca: 73 },
  { nome: 'Ceará',             sigla: 'CEA', cidade: 'Fortaleza',       cor: '#000000', forca: 71 },
  { nome: 'Sport',             sigla: 'SPT', cidade: 'Recife',          cor: '#CC0000', forca: 70 },
  { nome: 'Goiás',             sigla: 'GOI', cidade: 'Goiânia',         cor: '#006400', forca: 69 },
  { nome: 'Cuiabá',            sigla: 'CUI', cidade: 'Cuiabá',          cor: '#FFD700', forca: 67 },
  { nome: 'América MG',        sigla: 'AME', cidade: 'Belo Horizonte',  cor: '#006400', forca: 66 },
]

const NOMES = ['Lucas','Gabriel','Rafael','Matheus','Felipe','Bruno','Rodrigo','Pedro','Thiago','Diego',
  'André','Marcos','Paulo','João','Carlos','Gustavo','Leonardo','Fernando','Alexandre','Victor']
const SOBRENOMES = ['Silva','Santos','Oliveira','Costa','Souza','Lima','Ferreira','Alves','Pereira',
  'Carvalho','Ribeiro','Almeida','Nascimento','Barros','Cunha','Moura','Rocha','Pinto','Lopes','Araújo']

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function nomeAleatorio(): string {
  const n = NOMES[Math.floor(Math.random() * NOMES.length)]
  const s = SOBRENOMES[Math.floor(Math.random() * SOBRENOMES.length)]
  return `${n} ${s}`
}

function gerarJogador(id: string, posicao: Jogador['posicao'], forcaBase: number): Jogador {
  const variacao = rand(-10, 10)
  const base = Math.min(99, Math.max(40, forcaBase + variacao))
  return {
    id,
    nome: nomeAleatorio(),
    posicao,
    ataque: posicao === 'ATA' ? rand(base - 5, Math.min(99, base + 5)) : rand(base - 20, base),
    defesa: posicao === 'DEF' || posicao === 'GOL' ? rand(base - 5, Math.min(99, base + 5)) : rand(base - 20, base),
    velocidade: rand(base - 10, Math.min(99, base + 10)),
    overall: base,
  }
}

function gerarElenco(timeId: string, forcaBase: number): Jogador[] {
  const jogadores: Jogador[] = []
  const posicoes: Jogador['posicao'][] = [
    'GOL','GOL',
    'DEF','DEF','DEF','DEF','DEF','DEF',
    'MEI','MEI','MEI','MEI','MEI',
    'ATA','ATA','ATA','ATA','ATA','ATA','ATA',
    'GOL','DEF','MEI','ATA',
  ]
  posicoes.forEach((pos, i) => {
    jogadores.push(gerarJogador(`${timeId}-j${i}`, pos, forcaBase))
  })
  return jogadores
}

export function gerarTabela(timeIds: string[]): Tabela[] {
  return timeIds.map(id => ({
    timeId: id,
    pontos: 0,
    jogos: 0,
    vitorias: 0,
    empates: 0,
    derrotas: 0,
    golsPro: 0,
    golsContra: 0,
    saldoGols: 0,
  }))
}

export function gerarTimes(): Time[] {
  return TIMES_BR.map((t, i) => {
    const id = `time-${i}`
    const jogadores = gerarElenco(id, t.forca)
    const overall = Math.round(jogadores.reduce((s, j) => s + j.overall, 0) / jogadores.length)
    return {
      id,
      nome: t.nome,
      sigla: t.sigla,
      cidade: t.cidade,
      cor: t.cor,
      jogadores,
      forca: overall,
    }
  })
}
