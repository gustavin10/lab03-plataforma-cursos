export class Trilha {
  constructor(titulo, descricao, idCategoria) {
    this.id = crypto.randomUUID();
    this.titulo = titulo;
    this.descricao = descricao || '';
    this.idCategoria = idCategoria;
  }

  static validar(dados) {
    const erros = [];
    if (!dados.titulo?.trim()) erros.push('Título é obrigatório.');
    if (!dados.idCategoria) erros.push('Selecione uma categoria.');
    return erros;
  }
}

export class TrilhaCurso {
  constructor(idTrilha, idCurso, ordem) {
    this.idTrilha = idTrilha;
    this.idCurso = idCurso;
    this.ordem = Number(ordem) || 1;
  }

  static validar(dados) {
    const erros = [];
    if (!dados.idTrilha) erros.push('Selecione uma trilha.');
    if (!dados.idCurso) erros.push('Selecione um curso.');
    if (!dados.ordem || dados.ordem < 1) erros.push('Ordem deve ser maior que zero.');
    return erros;
  }
}
