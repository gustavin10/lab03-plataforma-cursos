export class Aula {
  constructor(idModulo, titulo, tipoConteudo, urlConteudo, duracaoMinutos, ordem) {
    this.id = crypto.randomUUID();
    this.idModulo = idModulo;
    this.titulo = titulo;
    this.tipoConteudo = tipoConteudo;
    this.urlConteudo = urlConteudo || '';
    this.duracaoMinutos = Number(duracaoMinutos) || 0;
    this.ordem = Number(ordem) || 1;
  }

  static validar(dados) {
    const erros = [];
    if (!dados.idModulo) erros.push('Selecione um módulo.');
    if (!dados.titulo?.trim()) erros.push('Título é obrigatório.');
    if (!dados.tipoConteudo) erros.push('Selecione o tipo de conteúdo.');
    if (!dados.ordem || dados.ordem < 1) erros.push('Ordem deve ser maior que zero.');
    return erros;
  }
}
