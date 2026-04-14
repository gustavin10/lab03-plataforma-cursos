import { AulaService } from '../service/AulaService.mjs';
import { mostrarErro, limparErro, fecharModal } from './ui.mjs';

const svc = new AulaService();

export function getAulaService() {
  return svc;
}

export function salvarAula() {
  const idModulo      = document.getElementById('aul-modulo').value;
  const titulo        = document.getElementById('aul-titulo').value.trim();
  const tipoConteudo  = document.getElementById('aul-tipo').value;
  const urlConteudo   = document.getElementById('aul-url').value.trim();
  const duracaoMinutos = document.getElementById('aul-duracao').value;
  const ordem         = document.getElementById('aul-ordem').value;
  limparErro('aul-erro');

  try {
    svc.salvar({ idModulo, titulo, tipoConteudo, urlConteudo, duracaoMinutos, ordem: Number(ordem) });
    document.getElementById('aul-titulo').value  = '';
    document.getElementById('aul-url').value     = '';
    document.getElementById('aul-duracao').value = '';
    document.getElementById('aul-ordem').value   = '';
    fecharModal('modalAula');
    renderAulas();
    window._atualizarTodosSelects?.();
  } catch (e) {
    mostrarErro('aul-erro', e.message);
  }
}

export function renderAulas() {
  const tbody = document.getElementById('aul-tabela');
  if (!tbody) return;
  const lista = svc.listar();
  const modulos = window._services?.modulo?.listar() ?? [];
  const corTipo = { 'Vídeo': 'primary', 'Texto': 'info', 'Quiz': 'warning' };

  tbody.innerHTML = lista.length === 0
    ? '<tr><td colspan="6" class="text-center text-muted">Nenhuma aula cadastrada.</td></tr>'
    : lista.map(a => {
        const mod = modulos.find(x => x.id === a.idModulo);
        return `<tr>
          <td>${a.id.substring(0, 8)}…</td>
          <td>${mod ? mod.titulo : '—'}</td>
          <td>${a.titulo}</td>
          <td><span class="badge bg-${corTipo[a.tipoConteudo] || 'secondary'}">${a.tipoConteudo}</span></td>
          <td>${a.duracaoMinutos} min</td>
          <td>${a.ordem}</td>
        </tr>`;
      }).join('');
}
