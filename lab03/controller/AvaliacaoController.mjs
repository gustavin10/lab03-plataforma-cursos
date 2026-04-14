import { AvaliacaoService } from '../service/AvaliacaoService.mjs';
import { mostrarErro, limparErro, fecharModal, estrelas } from './ui.mjs';

const svc = new AvaliacaoService();

export function salvarAvaliacao() {
  const idUsuario  = document.getElementById('avl-usuario').value;
  const idCurso    = document.getElementById('avl-curso').value;
  const nota       = Number(document.getElementById('avl-nota').value);
  const comentario = document.getElementById('avl-comentario').value.trim();
  limparErro('avl-erro');

  try {
    svc.salvar({ idUsuario, idCurso, nota, comentario });
    document.getElementById('avl-nota').value       = '';
    document.getElementById('avl-comentario').value = '';
    fecharModal('modalAvaliacao');
    renderAvaliacoes();
  } catch (e) {
    mostrarErro('avl-erro', e.message);
  }
}

export function renderAvaliacoes() {
  const tbody    = document.getElementById('avl-tabela');
  if (!tbody) return;
  const lista    = svc.listar();
  const usuarios = window._services?.usuario?.listar() ?? [];
  const cursos   = window._services?.curso?.listar() ?? [];

  tbody.innerHTML = lista.length === 0
    ? '<tr><td colspan="5" class="text-center text-muted">Nenhuma avaliação registrada.</td></tr>'
    : lista.map(a => {
        const usr = usuarios.find(x => x.id === a.idUsuario);
        const cur = cursos.find(x => x.id === a.idCurso);
        return `<tr>
          <td>${usr ? usr.nomeCompleto : '—'}</td>
          <td>${cur ? cur.titulo : '—'}</td>
          <td class="text-warning">${estrelas(a.nota)} (${a.nota}/5)</td>
          <td>${a.comentario || '—'}</td>
          <td>${a.dataAvaliacao}</td>
        </tr>`;
      }).join('');
}
