import { CursoService } from '../service/CursoService.mjs';
import { mostrarErro, limparErro, fecharModal } from './ui.mjs';

const svc = new CursoService();

export function getCursoService() {
  return svc;
}

export function salvarCurso() {
  const titulo      = document.getElementById('cur-titulo').value.trim();
  const desc        = document.getElementById('cur-desc').value.trim();
  const idInstrutor = document.getElementById('cur-instrutor').value;
  const idCategoria = document.getElementById('cur-categoria').value;
  const nivel       = document.getElementById('cur-nivel').value;
  const totalAulas  = document.getElementById('cur-aulas').value;
  const totalHoras  = document.getElementById('cur-horas').value;
  limparErro('cur-erro');

  try {
    svc.salvar({ titulo, descricao: desc, idInstrutor, idCategoria, nivel, totalAulas, totalHoras });
    document.getElementById('cur-titulo').value = '';
    document.getElementById('cur-desc').value   = '';
    document.getElementById('cur-aulas').value  = '';
    document.getElementById('cur-horas').value  = '';
    fecharModal('modalCurso');
    renderCursos();
    window._atualizarTodosSelects?.();
  } catch (e) {
    mostrarErro('cur-erro', e.message);
  }
}

export function renderCursos() {
  const filtroId = document.getElementById('filtro-categoria-cursos')?.value || null;
  const lista = filtroId
    ? svc.listarPorCategoria(filtroId)
    : svc.listar();
  const tbody = document.getElementById('cur-tabela');
  if (!tbody) return;

  const corNivel = { 'Iniciante': 'success', 'Intermediário': 'warning', 'Avançado': 'danger' };

  const usuarios  = window._services?.usuario?.listar() ?? [];
  const categorias = window._services?.categoria?.listar() ?? [];

  tbody.innerHTML = lista.length === 0
    ? '<tr><td colspan="6" class="text-center text-muted">Nenhum curso encontrado.</td></tr>'
    : lista.map(c => {
        const cat  = categorias.find(x => x.id === c.idCategoria);
        const inst = usuarios.find(x => x.id === c.idInstrutor);
        return `<tr>
          <td>${c.id.substring(0, 8)}…</td>
          <td>${c.titulo}</td>
          <td>${cat ? cat.nome : '—'}</td>
          <td>${inst ? inst.nomeCompleto : '—'}</td>
          <td><span class="badge bg-${corNivel[c.nivel] || 'secondary'}">${c.nivel}</span></td>
          <td>${c.dataPublicacao}</td>
        </tr>`;
      }).join('');
}
