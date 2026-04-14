import { UsuarioService } from '../service/UsuarioService.mjs';
import { mostrarErro, limparErro, fecharModal } from './ui.mjs';

const svc = new UsuarioService();

export function getUsuarioService() {
  return svc;
}

export function salvarUsuario() {
  const nomeCompleto = document.getElementById('usr-nome').value.trim();
  const email        = document.getElementById('usr-email').value.trim();
  const senha        = document.getElementById('usr-senha').value.trim();
  limparErro('usr-erro');

  try {
    svc.salvar({ nomeCompleto, email, senha });
    document.getElementById('usr-nome').value  = '';
    document.getElementById('usr-email').value = '';
    document.getElementById('usr-senha').value = '';
    fecharModal('modalUsuario');
    renderUsuarios();
    window._atualizarTodosSelects?.();
  } catch (e) {
    mostrarErro('usr-erro', e.message);
  }
}

export function renderUsuarios() {
  const tbody = document.getElementById('usr-tabela');
  if (!tbody) return;
  const lista = svc.listar();
  tbody.innerHTML = lista.length === 0
    ? '<tr><td colspan="4" class="text-center text-muted">Nenhum usuário cadastrado.</td></tr>'
    : lista.map(u => `
      <tr>
        <td>${u.id.substring(0, 8)}…</td>
        <td>${u.nomeCompleto}</td>
        <td>${u.email}</td>
        <td>${u.dataCadastro}</td>
      </tr>`).join('');
}
