export class Modulo {
  constructor(idCurso, titulo, ordem) {
    this.id = crypto.randomUUID();
    this.idCurso = idCurso;
    this.titulo = titulo;
    this.ordem = Number(ordem) || 1;
  }

  static validar(dados) {
    const erros = [];
    if (!dados.idCurso) erros.push('Selecione um curso.');
    if (!dados.titulo?.trim()) erros.push('Título é obrigatório.');
    if (!dados.ordem || dados.ordem < 1) erros.push('Ordem deve ser maior que zero.');
    return erros;
  }
}
