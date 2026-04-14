export class Categoria {
  constructor(nome, descricao) {
    this.id = crypto.randomUUID();
    this.nome = nome;
    this.descricao = descricao || '';
  }

  static validar(dados) {
    const erros = [];
    if (!dados.nome?.trim()) erros.push('Nome é obrigatório.');
    return erros;
  }
}
