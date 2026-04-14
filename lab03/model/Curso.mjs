export class Curso {
  constructor(titulo, descricao, idInstrutor, idCategoria, nivel, totalAulas, totalHoras) {
    this.id = crypto.randomUUID();
    this.titulo = titulo;
    this.descricao = descricao || '';
    this.idInstrutor = idInstrutor;
    this.idCategoria = idCategoria;
    this.nivel = nivel;
    this.totalAulas = Number(totalAulas) || 0;
    this.totalHoras = Number(totalHoras) || 0;
    this.dataPublicacao = new Date().toLocaleDateString('pt-BR');
  }

  static validar(dados) {
    const erros = [];
    if (!dados.titulo?.trim()) erros.push('Título é obrigatório.');
    if (!dados.idInstrutor) erros.push('Selecione um instrutor.');
    if (!dados.idCategoria) erros.push('Selecione uma categoria.');
    if (!dados.nivel) erros.push('Selecione o nível.');
    return erros;
  }
}
