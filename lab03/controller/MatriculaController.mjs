import { MatriculaService } from '../service/MatriculaService.mjs';
import { mostrarErro, limparErro, fecharModal } from './ui.mjs';

const svc = new MatriculaService();

export function getMatriculaService() {
  return svc;
}

export function trocarTipoMatricula(tipo) {
  document.getElementById('mat-grupo-curso').classList.toggle('d-none', tipo !== 'curso');
  document.getElementById('mat-grupo-plano').classList.toggle('d-none', tipo !== 'plano');
}

export function salvarMatricula() {
  const idUsuario = document.getElementById('mat-usuario').value;
  const tipo = document.querySelector('input[name="tipoMatricula"]:checked')?.value;
  limparErro('mat-erro');

  try {
    if (tipo === 'curso') {
      const idCurso = document.getElementById('mat-curso').value;
      svc.salvar(idUsuario, idCurso);
    } else {
      const idPlano  = document.getElementById('mat-plano').value;
      const metodo   = document.getElementById('mat-metodo').value;
      if (!idPlano) throw new Error('Selecione um plano.');
      if (!metodo)  throw new Error('Selecione o método de pagamento.');
      window._services?.financeiro?.realizarCheckout(idUsuario, idPlano, metodo);
      window._renders?.pagamentos?.();
      window._renders?.assinaturas?.();
    }
    fecharModal('modalMatricula');
    renderMatriculas();
  } catch (e) {
    mostrarErro('mat-erro', e.message);
  }
}

export function renderMatriculas() {
  const tbody = document.getElementById('mat-tabela');
  if (!tbody) return;
  const lista = svc.listar();
  const usuarios = window._services?.usuario?.listar() ?? [];
  const cursos   = window._services?.curso?.listar() ?? [];

  tbody.innerHTML = lista.length === 0
    ? '<tr><td colspan="4" class="text-center text-muted">Nenhuma matrícula registrada.</td></tr>'
    : lista.map(m => {
        const usr = usuarios.find(x => x.id === m.idUsuario);
        const cur = cursos.find(x => x.id === m.idCurso);
        return `<tr>
          <td>${m.id.substring(0, 8)}…</td>
          <td>${usr ? usr.nomeCompleto : '—'}</td>
          <td>${cur ? cur.titulo : '—'}</td>
          <td>${m.dataMatricula}</td>
        </tr>`;
      }).join('');
}
