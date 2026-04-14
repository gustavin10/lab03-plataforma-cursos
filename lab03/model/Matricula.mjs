export class Matricula {
  constructor(idUsuario, idCurso) {
    this.id = crypto.randomUUID();
    this.idUsuario = idUsuario;
    this.idCurso = idCurso;
    this.dataMatricula = new Date().toLocaleDateString('pt-BR');
    this.dataConclusao = null;
  }
}
