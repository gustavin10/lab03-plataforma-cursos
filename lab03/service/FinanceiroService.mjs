import { Plano, Assinatura, Pagamento } from '../model/Financeiro.mjs';

const KEY_PLANOS = 'planos';
const KEY_ASSINATURAS = 'assinaturas';
const KEY_PAGAMENTOS = 'pagamentos';

export class FinanceiroService {
  #listarPlanosRaw() {
    return JSON.parse(localStorage.getItem(KEY_PLANOS) ?? '[]');
  }

  #listarAssinaturasRaw() {
    return JSON.parse(localStorage.getItem(KEY_ASSINATURAS) ?? '[]');
  }

  #listarPagamentosRaw() {
    return JSON.parse(localStorage.getItem(KEY_PAGAMENTOS) ?? '[]');
  }

  listarPlanos() {
    return this.#listarPlanosRaw();
  }

  listarAssinaturas() {
    return this.#listarAssinaturasRaw();
  }

  listarPagamentos() {
    return this.#listarPagamentosRaw();
  }

  buscarPlanoPorId(id) {
    return this.#listarPlanosRaw().find(p => p.id === id) ?? null;
  }

  buscarAssinaturaPorId(id) {
    return this.#listarAssinaturasRaw().find(a => a.id === id) ?? null;
  }

  salvarPlano(dados) {
    const erros = Plano.validar(dados);
    if (erros.length) throw new Error(erros.join(' | '));
    const plano = new Plano(dados.nome, dados.descricao, dados.preco, dados.duracaoMeses);
    const lista = this.#listarPlanosRaw();
    lista.push(plano);
    localStorage.setItem(KEY_PLANOS, JSON.stringify(lista));
    return plano;
  }

  realizarCheckout(idUsuario, idPlano, metodoPagamento) {
    if (!idUsuario) throw new Error('Selecione um usuário.');
    if (!idPlano) throw new Error('Selecione um plano.');
    if (!metodoPagamento) throw new Error('Selecione o método de pagamento.');

    const plano = this.buscarPlanoPorId(idPlano);
    if (!plano) throw new Error('Plano não encontrado.');

    const assinatura = new Assinatura(idUsuario, idPlano, plano.duracaoMeses);
    const listaAss = this.#listarAssinaturasRaw();
    listaAss.push(assinatura);
    localStorage.setItem(KEY_ASSINATURAS, JSON.stringify(listaAss));

    const pagamento = new Pagamento(assinatura.id, plano.preco, metodoPagamento);
    const listaPag = this.#listarPagamentosRaw();
    listaPag.push(pagamento);
    localStorage.setItem(KEY_PAGAMENTOS, JSON.stringify(listaPag));

    return { assinatura, pagamento };
  }
}
