export class ProgressoAula {
  constructor(idUsuario, idAula) {
    this.idUsuario = idUsuario;
    this.idAula = idAula;
    this.status = 'Concluído';
    this.dataConclusao = new Date().toLocaleDateString('pt-BR');
  }
}
