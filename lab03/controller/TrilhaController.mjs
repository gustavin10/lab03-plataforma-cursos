import { TrilhaService } from '../service/TrilhaService.mjs';
import { mostrarErro, limparErro, fecharModal } from './ui.mjs';

const svc = new TrilhaService();

export function getTrilhaService() {
  return svc;
}

export function salvarTrilha() {
  const titulo      = document.getElementById('tri-titulo').value.trim();
  const desc        = document.getElementById('tri-desc').value.trim();
  const idCategoria = document.getElementById('tri-categoria').value;
  limparErro('tri-erro');

  try {
    svc.salvarTrilha({ titulo, descricao: desc, idCategoria });
    document.getElementById('tri-titulo').value = '';
    document.getElementById('tri-desc').value   = '';
    fecharModal('modalTrilha');
    renderTrilhas();
    window._atualizarTodosSelects?.();
  } catch (e) {
    mostrarErro('tri-erro', e.message);
  }
}

export function salvarTrilhaCurso() {
  const idTrilha = document.getElementById('tc-trilha').value;
  const idCurso  = document.getElementById('tc-curso').value;
  const ordem    = document.getElementById('tc-ordem').value;
  limparErro('tc-erro');

  try {
    svc.salvarTrilhaCurso({ idTrilha, idCurso, ordem: Number(ordem) });
    document.getElementById('tc-ordem').value = '';
    fecharModal('modalTrilhaCurso');
    renderTrilhasCursos();
  } catch (e) {
    mostrarErro('tc-erro', e.message);
  }
}

export function renderTrilhas() {
  const tbody      = document.getElementById('tri-tabela');
  if (!tbody) return;
  const lista      = svc.listarTrilhas();
  const categorias = window._services?.categoria?.listar() ?? [];

  tbody.innerHTML = lista.length === 0
    ? '<tr><td colspan="3" class="text-center text-muted">Nenhuma trilha cadastrada.</td></tr>'
    : lista.map(t => {
        const cat = categorias.find(x => x.id === t.idCategoria);
        return `<tr>
          <td>${t.id.substring(0, 8)}…</td>
          <td>${t.titulo}</td>
          <td>${cat ? cat.nome : '—'}</td>
        </tr>`;
      }).join('');
}

export function renderTrilhasCursos() {
  const tbody  = document.getElementById('tc-tabela');
  if (!tbody) return;
  const lista  = svc.listarTrilhasCursos();
  const trilhas = svc.listarTrilhas();
  const cursos  = window._services?.curso?.listar() ?? [];

  tbody.innerHTML = lista.length === 0
    ? '<tr><td colspan="3" class="text-center text-muted">Nenhum curso vinculado às trilhas.</td></tr>'
    : lista.map(tc => {
        const tri = trilhas.find(x => x.id === tc.idTrilha);
        const cur = cursos.find(x => x.id === tc.idCurso);
        return `<tr>
          <td>${tri ? tri.titulo : '—'}</td>
          <td>${cur ? cur.titulo : '—'}</td>
          <td>${tc.ordem}</td>
        </tr>`;
      }).join('');
}
