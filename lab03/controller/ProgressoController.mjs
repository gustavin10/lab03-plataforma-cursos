import { ProgressoService } from '../service/ProgressoService.mjs';
import { mostrarErro, limparErro, fecharModal } from './ui.mjs';

const svc = new ProgressoService();

export function getProgressoService() {
  return svc;
}

export function salvarProgresso() {
  const idUsuario = document.getElementById('prog-usuario').value;
  const idAula    = document.getElementById('prog-aula').value;
  limparErro('prog-erro');

  try {
    svc.salvarProgresso(idUsuario, idAula);
    fecharModal('modalProgresso');
    renderProgressos();

    const aulas   = window._services?.aula?.listar() ?? [];
    const modulos = window._services?.modulo?.listar() ?? [];
    const aula    = aulas.find(a => a.id === idAula);
    const modulo  = aula ? modulos.find(m => m.id === aula.idModulo) : null;

    if (modulo) {
      const cert = svc.verificarConclusao(
        idUsuario,
        modulo.idCurso,
        modulos,
        aulas,
        (uid, cid) => window._services?.matricula?.marcarConcluida(uid, cid)
      );
      if (cert) {
        renderCertificados();
        window._renders?.matriculas?.();
        setTimeout(() => alert('🎓 Parabéns! Certificado gerado automaticamente!'), 200);
      }
    }
  } catch (e) {
    mostrarErro('prog-erro', e.message);
  }
}

export function renderProgressos() {
  const tbody = document.getElementById('prog-tabela');
  if (!tbody) return;
  const lista    = svc.listarProgressos();
  const usuarios = window._services?.usuario?.listar() ?? [];
  const aulas    = window._services?.aula?.listar() ?? [];

  tbody.innerHTML = lista.length === 0
    ? '<tr><td colspan="4" class="text-center text-muted">Nenhum progresso registrado.</td></tr>'
    : lista.map(p => {
        const usr = usuarios.find(x => x.id === p.idUsuario);
        const aul = aulas.find(x => x.id === p.idAula);
        return `<tr>
          <td>${usr ? usr.nomeCompleto : '—'}</td>
          <td>${aul ? aul.titulo : '—'}</td>
          <td><span class="badge bg-success">${p.status}</span></td>
          <td>${p.dataConclusao}</td>
        </tr>`;
      }).join('');
}

export function renderCertificados() {
  const tbody = document.getElementById('cert-tabela');
  if (!tbody) return;
  const lista    = svc.listarCertificados();
  const usuarios = window._services?.usuario?.listar() ?? [];
  const cursos   = window._services?.curso?.listar() ?? [];

  tbody.innerHTML = lista.length === 0
    ? '<tr><td colspan="5" class="text-center text-muted">Nenhum certificado emitido.</td></tr>'
    : lista.map(c => {
        const usr = usuarios.find(x => x.id === c.idUsuario);
        const cur = cursos.find(x => x.id === c.idCurso);
        return `<tr>
          <td>${c.id.substring(0, 8)}…</td>
          <td>${usr ? usr.nomeCompleto : '—'}</td>
          <td>${cur ? cur.titulo : '—'}</td>
          <td><span class="badge bg-warning text-dark font-monospace">${c.codigoVerificacao}</span></td>
          <td>${c.dataEmissao}</td>
        </tr>`;
      }).join('');
}
