export class Avaliacao {
  constructor(idUsuario, idCurso, nota, comentario) {
    this.id = crypto.randomUUID();
    this.idUsuario = idUsuario;
    this.idCurso = idCurso;
    this.nota = Number(nota);
    this.comentario = comentario || '';
    this.dataAvaliacao = new Date().toLocaleDateString('pt-BR');
  }

  static validar(dados) {
    const erros = [];
    if (!dados.idUsuario) erros.push('Selecione um usuário.');
    if (!dados.idCurso) erros.push('Selecione um curso.');
    if (!dados.nota || dados.nota < 1 || dados.nota > 5)
      erros.push('Nota deve ser entre 1 e 5.');
    return erros;
  }
}
