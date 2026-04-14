export class Certificado {
  constructor(idUsuario, idCurso) {
    this.id = crypto.randomUUID();
    this.idUsuario = idUsuario;
    this.idCurso = idCurso;
    this.codigoVerificacao = 'CERT-' + Math.random().toString(36).substring(2, 10).toUpperCase();
    this.dataEmissao = new Date().toLocaleDateString('pt-BR');
  }
}
