import { FinanceiroService } from '../service/FinanceiroService.mjs';
import { mostrarErro, limparErro, fecharModal } from './ui.mjs';

const svc = new FinanceiroService();

export function getFinanceiroService() {
  return svc;
}

export function salvarPlano() {
  const nome        = document.getElementById('pla-nome').value.trim();
  const desc        = document.getElementById('pla-desc').value.trim();
  const preco       = document.getElementById('pla-preco').value;
  const duracaoMeses = document.getElementById('pla-duracao').value;
  limparErro('pla-erro');

  try {
    svc.salvarPlano({ nome, descricao: desc, preco: Number(preco), duracaoMeses: Number(duracaoMeses) });
    document.getElementById('pla-nome').value    = '';
    document.getElementById('pla-desc').value    = '';
    document.getElementById('pla-preco').value   = '';
    document.getElementById('pla-duracao').value = '';
    fecharModal('modalPlano');
    renderPlanos();
    window._atualizarTodosSelects?.();
  } catch (e) {
    mostrarErro('pla-erro', e.message);
  }
}

export function realizarCheckout() {
  const idUsuario = document.getElementById('pay-usuario').value;
  const idPlano   = document.getElementById('pay-plano').value;
  const metodo    = document.getElementById('pay-metodo').value;
  limparErro('pay-erro');

  try {
    const { pagamento, assinatura } = svc.realizarCheckout(idUsuario, idPlano, metodo);
    fecharModal('modalCheckout');
    renderPagamentos();
    renderAssinaturas();
    setTimeout(() => {
      alert(
        `✅ Pagamento realizado!\n\nID da Transação: ${pagamento.idTransacaoGateway}\nMétodo: ${metodo}\nValor: R$ ${pagamento.valorPago.toFixed(2)}`
      );
    }, 200);
  } catch (e) {
    mostrarErro('pay-erro', e.message);
  }
}

export function renderPlanos() {
  const tbody = document.getElementById('pla-tabela');
  if (!tbody) return;
  const lista = svc.listarPlanos();

  tbody.innerHTML = lista.length === 0
    ? '<tr><td colspan="4" class="text-center text-muted">Nenhum plano cadastrado.</td></tr>'
    : lista.map(p => `
      <tr>
        <td>${p.id.substring(0, 8)}…</td>
        <td>${p.nome}</td>
        <td>R$ ${p.preco.toFixed(2)}</td>
        <td>${p.duracaoMeses} meses</td>
      </tr>`).join('');
}

export function renderAssinaturas() {
  const tbody    = document.getElementById('ass-tabela');
  if (!tbody) return;
  const lista    = svc.listarAssinaturas();
  const usuarios = window._services?.usuario?.listar() ?? [];
  const planos   = svc.listarPlanos();

  tbody.innerHTML = lista.length === 0
    ? '<tr><td colspan="5" class="text-center text-muted">Nenhuma assinatura ativa.</td></tr>'
    : lista.map(a => {
        const usr = usuarios.find(x => x.id === a.idUsuario);
        const pla = planos.find(x => x.id === a.idPlano);
        return `<tr>
          <td>${a.id.substring(0, 8)}…</td>
          <td>${usr ? usr.nomeCompleto : '—'}</td>
          <td>${pla ? pla.nome : '—'}</td>
          <td>${a.dataInicio}</td>
          <td>${a.dataFim}</td>
        </tr>`;
      }).join('');
}

export function renderPagamentos() {
  const tbody    = document.getElementById('pay-tabela');
  if (!tbody) return;
  const lista        = svc.listarPagamentos();
  const assinaturas  = svc.listarAssinaturas();
  const planos       = svc.listarPlanos();
  const usuarios     = window._services?.usuario?.listar() ?? [];

  tbody.innerHTML = lista.length === 0
    ? '<tr><td colspan="7" class="text-center text-muted">Nenhum pagamento registrado.</td></tr>'
    : lista.map(p => {
        const ass = assinaturas.find(a => a.id === p.idAssinatura);
        const usr = ass ? usuarios.find(u => u.id === ass.idUsuario) : null;
        const pla = ass ? planos.find(x => x.id === ass.idPlano) : null;
        return `<tr>
          <td>${p.id.substring(0, 8)}…</td>
          <td>${usr ? usr.nomeCompleto : '—'}</td>
          <td>${pla ? pla.nome : '—'}</td>
          <td>R$ ${p.valorPago.toFixed(2)}</td>
          <td><span class="badge bg-info text-dark">${p.metodoPagamento}</span></td>
          <td><code>${p.idTransacaoGateway}</code></td>
          <td>${p.dataPagamento}</td>
        </tr>`;
      }).join('');
}
