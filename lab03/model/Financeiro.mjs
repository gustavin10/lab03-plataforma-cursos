export class Plano {
  constructor(nome, descricao, preco, duracaoMeses) {
    this.id = crypto.randomUUID();
    this.nome = nome;
    this.descricao = descricao || '';
    this.preco = parseFloat(preco);
    this.duracaoMeses = Number(duracaoMeses);
  }

  static validar(dados) {
    const erros = [];
    if (!dados.nome?.trim()) erros.push('Nome é obrigatório.');
    if (!dados.preco || dados.preco <= 0) erros.push('Preço deve ser maior que zero.');
    if (!dados.duracaoMeses || dados.duracaoMeses < 1)
      erros.push('Duração deve ser maior que zero.');
    return erros;
  }
}

export class Assinatura {
  constructor(idUsuario, idPlano, duracaoMeses) {
    this.id = crypto.randomUUID();
    this.idUsuario = idUsuario;
    this.idPlano = idPlano;
    this.dataInicio = new Date().toLocaleDateString('pt-BR');
    const dataFim = new Date();
    dataFim.setMonth(dataFim.getMonth() + Number(duracaoMeses));
    this.dataFim = dataFim.toLocaleDateString('pt-BR');
  }
}

export class Pagamento {
  constructor(idAssinatura, valorPago, metodoPagamento) {
    this.id = crypto.randomUUID();
    this.idAssinatura = idAssinatura;
    this.valorPago = parseFloat(valorPago);
    this.metodoPagamento = metodoPagamento;
    this.dataPagamento = new Date().toLocaleDateString('pt-BR');
    this.idTransacaoGateway = 'TXN-' + Math.random().toString(36).substring(2, 10).toUpperCase();
  }
}
