export class Usuario {
  constructor(nomeCompleto, email, senha) {
    this.id = crypto.randomUUID();
    this.nomeCompleto = nomeCompleto;
    this.email = email;
    this.senhaHash = btoa(senha);
    this.dataCadastro = new Date().toLocaleDateString('pt-BR');
  }

  static validar(dados) {
    const erros = [];
    if (!dados.nomeCompleto?.trim()) erros.push('Nome é obrigatório.');
    if (!dados.email?.trim()) erros.push('E-mail é obrigatório.');
    if (dados.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.email))
      erros.push('Formato de e-mail inválido.');
    if (!dados.senha?.trim()) erros.push('Senha é obrigatória.');
    return erros;
  }
}
