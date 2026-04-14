import { CategoriaService } from '../service/CategoriaService.mjs';
import { mostrarErro, limparErro, fecharModal } from './ui.mjs';

const svc = new CategoriaService();

export function getCategoriaService() {
  return svc;
}

export function salvarCategoria() {
  const nome = document.getElementById('cat-nome').value.trim();
  const desc = document.getElementById('cat-desc').value.trim();
  limparErro('cat-erro');

  try {
    svc.salvar({ nome, descricao: desc });
    document.getElementById('cat-nome').value = '';
    document.getElementById('cat-desc').value = '';
    fecharModal('modalCategoria');
    renderCategorias();
    window._atualizarTodosSelects?.();
  } catch (e) {
    mostrarErro('cat-erro', e.message);
  }
}

export function renderCategorias() {
  const tbody = document.getElementById('cat-tabela');
  if (!tbody) return;
  const lista = svc.listar();
  tbody.innerHTML = lista.length === 0
    ? '<tr><td colspan="3" class="text-center text-muted">Nenhuma categoria cadastrada.</td></tr>'
    : lista.map(c => `
      <tr>
        <td>${c.id.substring(0, 8)}…</td>
        <td>${c.nome}</td>
        <td>${c.descricao || '—'}</td>
      </tr>`).join('');
}
