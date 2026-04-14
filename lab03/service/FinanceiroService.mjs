import { Plano, Assinatura, Pagamento } from '../model/Financeiro.mjs';

const _planos = [];
const _assinaturas = [];
const _pagamentos = [];

export class FinanceiroService {
  listarPlanos() {
    return [..._planos];
  }

  listarAssinaturas() {
    return [..._assinaturas];
  }

  listarPagamentos() {
    return [..._pagamentos];
  }

  buscarPlanoPorId(id) {
    return _planos.find(p => p.id === id) ?? null;
  }

  buscarAssinaturaPorId(id) {
    return _assinaturas.find(a => a.id === id) ?? null;
  }

  salvarPlano(dados) {
    const erros = Plano.validar(dados);
    if (erros.length) throw new Error(erros.join(' | '));
    const plano = new Plano(dados.nome, dados.descricao, dados.preco, dados.duracaoMeses);
    _planos.push(plano);
    return plano;
  }

  realizarCheckout(idUsuario, idPlano, metodoPagamento) {
    if (!idUsuario) throw new Error('Selecione um usuário.');
    if (!idPlano) throw new Error('Selecione um plano.');
    if (!metodoPagamento) throw new Error('Selecione o método de pagamento.');

    const plano = this.buscarPlanoPorId(idPlano);
    if (!plano) throw new Error('Plano não encontrado.');

    const assinatura = new Assinatura(idUsuario, idPlano, plano.duracaoMeses);
    _assinaturas.push(assinatura);

    const pagamento = new Pagamento(assinatura.id, plano.preco, metodoPagamento);
    _pagamentos.push(pagamento);

    return { assinatura, pagamento };
  }
}
