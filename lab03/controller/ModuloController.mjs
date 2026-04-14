import { ModuloService } from '../service/ModuloService.mjs';
import { mostrarErro, limparErro, fecharModal } from './ui.mjs';

const svc = new ModuloService();

export function getModuloService() {
  return svc;
}

export function salvarModulo() {
  const idCurso = document.getElementById('mod-curso').value;
  const titulo  = document.getElementById('mod-titulo').value.trim();
  const ordem   = document.getElementById('mod-ordem').value;
  limparErro('mod-erro');

  try {
    svc.salvar({ idCurso, titulo, ordem: Number(ordem) });
    document.getElementById('mod-titulo').value = '';
    document.getElementById('mod-ordem').value  = '';
    fecharModal('modalModulo');
    renderModulos();
    window._atualizarTodosSelects?.();
  } catch (e) {
    mostrarErro('mod-erro', e.message);
  }
}

export function renderModulos() {
  const tbody = document.getElementById('mod-tabela');
  if (!tbody) return;
  const lista = svc.listar();
  const cursos = window._services?.curso?.listar() ?? [];

  tbody.innerHTML = lista.length === 0
    ? '<tr><td colspan="4" class="text-center text-muted">Nenhum módulo cadastrado.</td></tr>'
    : lista.map(m => {
        const cur = cursos.find(x => x.id === m.idCurso);
        return `<tr>
          <td>${m.id.substring(0, 8)}…</td>
          <td>${cur ? cur.titulo : '—'}</td>
          <td>${m.titulo}</td>
          <td>${m.ordem}</td>
        </tr>`;
      }).join('');
}
